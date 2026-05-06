import { useEffect, useMemo, useRef, useState } from 'react';
import { POSTS } from '../lib/posts.js';

export default function CmdK({ router, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setQ('');
      setActive(0);
    }
  }, [open]);

  const items = useMemo(() => {
    const pages = [
      { group: 'Pages', icon: '~',  label: 'home',     hint: '/',         keys: 'g h', run: () => router.go('/') },
      { group: 'Pages', icon: '?',  label: 'about',    hint: '/about',    keys: 'g a', run: () => router.go('/about') },
      { group: 'Pages', icon: '∷',  label: 'blog',     hint: '/blog',     keys: 'g b', run: () => router.go('/blog') },
      { group: 'Pages', icon: '@',  label: 'contact',  hint: '/contact',  keys: 'g c', run: () => router.go('/contact') },
      { group: 'Pages', icon: '§',  label: 'resume',   hint: '/resume',   keys: 'g r', run: () => router.go('/resume') },
      { group: 'Pages', icon: '✎',  label: 'guestbook', hint: '/guestbook', keys: 'g g', run: () => router.go('/guestbook') },
    ];
    const posts = POSTS.slice(0, 8).map(p => ({
      group: 'Posts',
      icon: '›',
      label: p.title,
      hint: p.date,
      keys: '',
      run: () => router.go('/blog/' + p.slug),
    }));
    const actions = [
      { group: 'Actions', icon: '☼', label: theme === 'dark' ? 'switch to light theme' : 'switch to dark theme', hint: '', keys: 't', run: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
      { group: 'Actions', icon: '↗', label: 'open github',   hint: 'github.com/ismaelezequiel',  keys: '', run: () => window.open('https://github.com/ismaelezequiel', '_blank') },
      { group: 'Actions', icon: '↗', label: 'open linkedin', hint: 'linkedin.com/in/ismaelezequiel', keys: '', run: () => window.open('https://linkedin.com/in/ismaelezequiel', '_blank') },
      { group: 'Actions', icon: '✉', label: 'copy email',    hint: 'ismaelezequiel@yahoo.com', keys: '', run: () => navigator.clipboard?.writeText('ismaelezequiel@yahoo.com') },
    ];
    return [...pages, ...posts, ...actions];
  }, [router, theme, setTheme]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    const score = (s) => {
      s = s.toLowerCase();
      let last = -1, gaps = 0;
      for (const c of needle) {
        const at = s.indexOf(c, last + 1);
        if (at === -1) return -1;
        if (last !== -1) gaps += at - last - 1;
        last = at;
      }
      return 10000 - gaps - (last - needle.length);
    };
    return items
      .map(it => ({ it, s: Math.max(score(it.label), score(it.hint || '')) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map(x => x.it);
  }, [q, items]);

  useEffect(() => { setActive(0); }, [q]);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter')     { e.preventDefault(); const it = filtered[active]; if (it) { it.run(); setOpen(false); } }
  };

  const grouped = useMemo(() => {
    const out = {};
    filtered.forEach(it => { (out[it.group] = out[it.group] || []).push(it); });
    return out;
  }, [filtered]);

  if (!open) return null;

  let idx = -1;
  return (
    <div className="cmdk-backdrop" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={e => e.stopPropagation()}>
        <div className="cmdk-input">
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="type a command or search…"
          />
          <span className="esc"><span className="kbd">esc</span></span>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <div className="cmdk-empty">no matches</div>}
          {Object.entries(grouped).map(([g, list]) => (
            <div key={g}>
              <div className="cmdk-group-label">{g}</div>
              {list.map((it) => {
                idx++;
                const i = idx;
                return (
                  <div
                    key={g + i}
                    className="cmdk-row"
                    data-active={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => { it.run(); setOpen(false); }}
                  >
                    <span className="icon">{it.icon}</span>
                    <span className="label">{it.label}{it.hint && <small>{it.hint}</small>}</span>
                    {it.keys && <span className="keys">{it.keys}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><span className="kbd">↑↓</span> navigate &nbsp; <span className="kbd">↵</span> select</span>
          <span><span className="kbd">⌘K</span> toggle</span>
        </div>
      </div>
    </div>
  );
}
