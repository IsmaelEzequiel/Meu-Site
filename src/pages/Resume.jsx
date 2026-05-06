import { useEffect, useState } from 'react';
import Prompt from '../components/Prompt.jsx';
import { renderMarkdown } from '../lib/markdown.js';

export default function Resume() {
  const [md, setMd] = useState(null);
  useEffect(() => {
    fetch('/resume.md').then(r => r.text()).then(setMd);
  }, []);
  return (
    <div>
      <Prompt cmd="cat resume.md | typeset --print" />
      <div className="output" style={{ marginBottom: 10, fontSize: 12, color: 'var(--fg-dim)' }}>
        rendered from <a href="/resume.md" target="_blank" rel="noreferrer">resume.md</a>
        <span style={{ margin: '0 8px' }}>·</span>
        <button className="tbtn ghost" style={{ padding: '2px 10px', fontSize: 11 }} onClick={() => window.print()}>print / save pdf</button>
        <span style={{ margin: '0 8px' }}>·</span>
        <a href="/resume.md" download>download .md</a>
      </div>
      <div className="resume" id="resume-doc">
        {md
          ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(md) }} />
          : <div style={{ color: 'var(--fg-dim)' }}>loading…</div>}
      </div>
    </div>
  );
}
