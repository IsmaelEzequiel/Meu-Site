import { useEffect, useRef, useState } from 'react';
import Prompt from '../components/Prompt.jsx';
import { adminFetch, checkAuth, clearToken, fmtBytes, getToken, login } from '../lib/admin.js';

function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!password) { setErr('password is required'); return; }
    setBusy(true); setErr('');
    try {
      await login(password);
      onSuccess();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Prompt cmd="sudo -i" blink />
      <div className="output">
        <form onSubmit={submit} className="box" style={{ background: 'transparent', maxWidth: 420 }}>
          <div className="field">
            <label>password</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="enter admin password"
            />
            <div className="hint">configured via ADMIN_PASSWORD in server/.env</div>
          </div>
          {err && <div className="field"><div className="err">! {err}</div></div>}
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="tbtn" disabled={busy}>
              {busy ? 'authenticating…' : '[ login ]'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileManager({ onLogout }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(null);
  const inputRef = useRef(null);

  const load = async () => {
    setLoading(true); setErr('');
    try {
      const r = await adminFetch('/api/uploads');
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      setFiles(await r.json());
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFiles = async (fileList) => {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;
    setErr('');
    setUploading(arr.length);
    try {
      for (const file of arr) {
        const fd = new FormData();
        fd.append('file', file);
        const r = await adminFetch('/api/uploads', { method: 'POST', body: fd });
        if (!r.ok) {
          const data = await r.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${r.status}`);
        }
      }
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(0);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const remove = async (file) => {
    if (!confirm(`Delete ${file.originalName}?`)) return;
    try {
      const r = await adminFetch(`/api/uploads/${file.id}`, { method: 'DELETE' });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } catch (e) {
      setErr(e.message);
    }
  };

  const copy = (file) => {
    const fullUrl = window.location.origin + file.url;
    navigator.clipboard?.writeText(fullUrl);
    setCopied(file.id);
    setTimeout(() => setCopied(c => (c === file.id ? null : c)), 1500);
  };

  return (
    <div>
      <Prompt cmd="whoami" />
      <div className="output" style={{ paddingLeft: 14, borderLeft: '2px solid var(--green)' }}>
        <span style={{ color: 'var(--green)' }}>● authenticated</span>
        <span style={{ marginLeft: 14, color: 'var(--fg-dim)', fontSize: 12 }}>
          <button
            className="tbtn ghost"
            style={{ padding: '2px 10px', fontSize: 11 }}
            onClick={() => { clearToken(); onLogout(); }}
          >logout</button>
        </span>
      </div>

      <Prompt cmd="upload --static" blink />
      <div className="output">
        <div
          className="box"
          style={{
            background: dragOver ? 'var(--accent-soft)' : 'transparent',
            borderStyle: 'dashed',
            borderColor: dragOver ? 'var(--accent)' : 'var(--line)',
            textAlign: 'center',
            padding: 28,
            cursor: 'pointer',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div style={{ fontSize: 13, color: 'var(--fg)', marginBottom: 4 }}>
            {uploading ? `uploading ${uploading} file${uploading > 1 ? 's' : ''}…` : 'drop images here or click to browse'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-faint)' }}>
            png · jpeg · webp · gif · avif · svg
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
          />
        </div>
        {err && <div className="field" style={{ marginTop: 10 }}><div className="err">! {err}</div></div>}
      </div>

      <Prompt cmd={`ls -lh uploads/${loading ? '' : ` # ${files.length} files`}`} />
      <div className="output">
        {loading && <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>loading…</div>}
        {!loading && files.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>no uploads yet</div>
        )}
        {!loading && files.length > 0 && (
          <div className="upload-grid">
            {files.map(f => (
              <div key={f.id} className="upload-card">
                <a href={f.url} target="_blank" rel="noreferrer" className="upload-thumb">
                  {f.mimeType.startsWith('image/')
                    ? <img src={f.url} alt={f.originalName} loading="lazy" />
                    : <div className="upload-fallback">{f.mimeType}</div>}
                </a>
                <div className="upload-meta">
                  <div className="name" title={f.originalName}>{f.originalName}</div>
                  <div className="sub">
                    <span>{fmtBytes(f.size)}</span>
                    <span>·</span>
                    <span>{f.created_at.slice(0, 10)}</span>
                  </div>
                  <div className="actions">
                    <button className="tbtn ghost" onClick={() => copy(f)}>
                      {copied === f.id ? 'copied!' : 'copy url'}
                    </button>
                    <button className="tbtn ghost danger" onClick={() => remove(f)}>delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    checkAuth().then(ok => {
      setAuthed(ok);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div>
        <Prompt cmd="auth-check" blink />
        <div className="output" style={{ color: 'var(--fg-dim)' }}>verifying session…</div>
      </div>
    );
  }

  return authed
    ? <FileManager onLogout={() => setAuthed(false)} />
    : <LoginForm onSuccess={() => setAuthed(true)} />;
}
