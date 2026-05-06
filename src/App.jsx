import { useEffect, useState } from 'react';
import { useRoute } from './lib/router.js';
import BootSequence from './components/BootSequence.jsx';
import StatusBar from './components/StatusBar.jsx';
import CmdK from './components/CmdK.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import Post from './pages/Post.jsx';
import Contact from './pages/Contact.jsx';
import Resume from './pages/Resume.jsx';
import Guestbook from './pages/Guestbook.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

function useKbd(router, setTheme, theme) {
  useEffect(() => {
    let pendingG = false;
    let timer;
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'g') {
        pendingG = true;
        clearTimeout(timer);
        timer = setTimeout(() => { pendingG = false; }, 800);
        return;
      }
      if (pendingG) {
        pendingG = false;
        clearTimeout(timer);
        const map = { h: '/', a: '/about', b: '/blog', c: '/contact', r: '/resume', g: '/guestbook' };
        if (map[e.key]) { e.preventDefault(); router.go(map[e.key]); }
      } else if (e.key === 't') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(timer); };
  }, [router, theme, setTheme]);
}

export default function App() {
  const router = useRoute();
  const [theme, setTheme] = useTheme();
  const [booted, setBooted] = useState(() => sessionStorage.getItem('booted') === '1');
  useKbd(router, setTheme, theme);

  useEffect(() => {
    if (booted) sessionStorage.setItem('booted', '1');
  }, [booted]);

  const renderRoute = () => {
    const p = router.path;
    if (p === '/' || p === '') return <Home />;
    if (p === '/about')        return <About />;
    if (p === '/blog')         return <Blog />;
    if (p.startsWith('/blog/')) return <Post slug={p.slice(6)} />;
    if (p === '/contact')      return <Contact />;
    if (p === '/resume')       return <Resume />;
    if (p === '/guestbook')    return <Guestbook />;
    if (p === '/admin')        return <Admin />;
    return <NotFound path={p} />;
  };

  const section = (() => {
    const p = router.path;
    if (p === '/' || p === '') return '';
    if (p.startsWith('/blog/')) return 'blog/' + p.slice(6);
    return p.slice(1);
  })();

  const pageLabel = (() => {
    const p = router.path;
    if (p === '/' || p === '') return 'Home';
    if (p.startsWith('/blog/')) return 'Post · ' + p.slice(6);
    return p.slice(1).charAt(0).toUpperCase() + p.slice(2);
  })();

  const openCmd = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}

      <StatusBar section={section} currentPath={router.path} theme={theme} setTheme={setTheme} openCmd={openCmd} />

      <main className="shell" data-screen-label={pageLabel}>
        {renderRoute()}

        <footer className="foot">
          <span>© 2026 ismael ezequiel</span>
          <span className="sep">·</span>
          <span>built with html, css, and stubbornness</span>
          <span className="sep">·</span>
          <a href="https://github.com/ismaelezequiel" target="_blank" rel="noreferrer">github ↗</a>
          <span className="sep">·</span>
          <span>press <span className="kbd">⌘K</span></span>
        </footer>
      </main>

      <CmdK router={router} theme={theme} setTheme={setTheme} />
    </>
  );
}
