import { useEffect, useState } from 'react';
import Prompt from '../components/Prompt.jsx';
import { renderMarkdown, parsePostMeta } from '../lib/markdown.js';

export default function Post({ slug }) {
  const [md, setMd] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setMd(null); setErr(null);
    fetch(`/posts/${slug}.md`).then(r => {
      if (!r.ok) throw new Error('not found');
      return r.text();
    }).then(setMd).catch(e => setErr(e.message));
  }, [slug]);

  if (err) return (
    <div>
      <Prompt cmd={`cat posts/${slug}.md`} />
      <div className="output" style={{ color: 'var(--accent)' }}>cat: posts/{slug}.md: No such file or directory</div>
      <div className="back-link">→ <a href="#/blog">back to /blog</a></div>
    </div>
  );
  if (!md) return (
    <div>
      <Prompt cmd={`cat posts/${slug}.md`} blink />
      <div className="output" style={{ color: 'var(--fg-dim)' }}>loading…</div>
    </div>
  );

  const meta = parsePostMeta(md);
  const body = md.replace(/^#\s+.+$/m, '').replace(/^\*[^*\n]+\*$/m, '').trimStart();
  return (
    <div>
      <Prompt cmd={`cat posts/${slug}.md`} />
      <div className="output">
        <div className="post-meta">{meta.meta}</div>
        <h1 style={{ fontSize: 24, color: 'var(--accent)', margin: '6px 0 4px' }}>{meta.title}</h1>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
      </div>
      <div className="back-link">→ <a href="#/blog">back to /blog</a></div>
    </div>
  );
}
