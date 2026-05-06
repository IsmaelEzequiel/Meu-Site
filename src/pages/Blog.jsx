import Prompt from '../components/Prompt.jsx';
import { POSTS } from '../lib/posts.js';

export default function Blog() {
  return (
    <div>
      <Prompt cmd="ls -lah posts/ | sort -r" />
      <div className="output">
        <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 4 }}>
          total {POSTS.length} entries
        </div>
        <ul className="post-list">
          {POSTS.map(p => (
            <li key={p.slug}>
              <a href={`#/blog/${p.slug}`}>
                <span className="date">{p.date}</span>
                <span className="title">{p.title}</span>
                <span className="read">{p.read}</span>
                <span className="arrow">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginTop: 14 }}>
        // posts are markdown files in <span style={{ color: 'var(--fg-dim)' }}>posts/</span> · press <span className="kbd">⌘K</span> to jump
      </div>
    </div>
  );
}
