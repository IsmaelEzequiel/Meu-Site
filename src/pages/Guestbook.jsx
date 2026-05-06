import { useEffect, useState } from 'react';
import Prompt from '../components/Prompt.jsx';
import { apiUrl } from '../lib/api.js';

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState('');
  const [nick, setNick] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl('/api/guestbook'))
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { if (!cancelled) { setEntries(data); setLoading(false); } })
      .catch(e => { if (!cancelled) { setLoadErr(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!nick.trim()) { setErr('nickname is required'); return; }
    if (!msg.trim())  { setErr('message is required');  return; }
    if (msg.length > 280) { setErr('max 280 characters'); return; }
    setErr(''); setBusy(true);
    try {
      const r = await fetch(apiUrl('/api/guestbook'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick: nick.trim(), message: msg.trim() }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      const created = await r.json();
      setEntries(prev => [created, ...prev]);
      setNick(''); setMsg('');
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const fmt = (iso) => iso.slice(0, 10);

  return (
    <div>
      <Prompt cmd="cat ~/.guestbook/intro" />
      <div className="output" style={{ paddingLeft: 14, borderLeft: '2px solid var(--line)' }}>
        leave a note. no email, no login — just a nickname and a message.
      </div>

      <Prompt cmd="./sign-guestbook.sh" blink />
      <div className="output">
        <form onSubmit={submit} className="box" style={{ background: 'transparent' }}>
          <div className="field">
            <label>nickname <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input value={nick} onChange={e => setNick(e.target.value)} maxLength={24} placeholder="pick anything" />
            <div className="hint">required · max 24 characters</div>
          </div>
          <div className="field">
            <label>message <span style={{ color: 'var(--accent)' }}>*</span></label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} maxLength={280} placeholder="say something nice…" />
            <div className="hint">{msg.length}/280</div>
          </div>
          {err && <div className="field"><div className="err">! {err}</div></div>}
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="tbtn" disabled={busy}>{busy ? 'sending…' : '[ send ]'}</button>
          </div>
        </form>
      </div>

      <Prompt cmd={`tail -n ${entries.length} guestbook.log`} />
      <div className="output">
        {loading && <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>loading entries…</div>}
        {loadErr && <div style={{ fontSize: 12, color: 'var(--accent)' }}>! could not load entries: {loadErr}</div>}
        {!loading && !loadErr && (
          <>
            <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 6 }}>{entries.length} entries</div>
            {entries.map(e => (
              <div key={e.id} className="gb-entry">
                <div className="head">
                  <span className="nick">@{e.nick}</span>
                  <span className="date">{fmt(e.created_at)}</span>
                </div>
                <div className="msg">{e.message}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
