import { useEffect, useState } from 'react';

const NAV = [
  { path: '/',          label: 'home' },
  { path: '/about',     label: 'about' },
  { path: '/blog',      label: 'blog' },
  { path: '/contact',   label: 'contact' },
  { path: '/resume',    label: 'resume' },
  { path: '/guestbook', label: 'guestbook' },
];

const fmtTime = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export default function StatusBar({ section, currentPath, theme, setTheme, openCmd }) {
  const [time, setTime] = useState(fmtTime);
  useEffect(() => {
    const id = setInterval(() => setTime(fmtTime()), 30000);
    return () => clearInterval(id);
  }, []);

  const isActive = (p) => {
    if (p === '/') return currentPath === '/' || currentPath === '';
    if (p === '/blog') return currentPath === '/blog' || currentPath.startsWith('/blog/');
    return currentPath === p;
  };

  return (
    <div className="statusbar" data-screen-label="Status Bar">
      <span className="sb-host">[ismael@dev]</span>
      <span className="sb-section">~/{section}</span>
      <nav className="sb-nav">
        {NAV.map(it => (
          <a key={it.path} href={'#' + it.path} className={isActive(it.path) ? 'active' : ''}>{it.label}</a>
        ))}
      </nav>
      <span className="sb-spacer" />
      <span className="sb-meta">
        <span className="sb-status">available</span>
        <button onClick={openCmd}><span className="kbd" style={{ whiteSpace: 'nowrap' }}>⌘/Ctrl K</span></button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="toggle theme (t)">
          {theme === 'dark' ? '☼ light' : '☾ dark'}
        </button>
        <span style={{ color: 'var(--fg-faint)' }}>{time}</span>
      </span>
    </div>
  );
}
