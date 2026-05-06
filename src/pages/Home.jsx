import Prompt from '../components/Prompt.jsx';
import { POSTS } from '../lib/posts.js';

export default function Home() {
  const latest = POSTS[0];
  return (
    <div>
      <Prompt cmd="cat ~/.identity" />
      <div className="output">
        <pre className="banner">{` ████████  ███████  ████   ████   █████   ██████  ██
░░░██░░░  ██░░░░░ ░░██░  ░░██░  ██░░░██ ██░░░░██░██
   ░██    ░██      ░███  ░███  ██   ░░██░██   ░██░██
   ░██    ░███████ ░████ ░████░██    ░██░█████████░██
   ░██    ░░░░░░██ ░██░██░██░██░█████████░██░░░░██░██
   ░██    █     ░██░██░░███░░██░██░░░░██ ░██   ░██░██
   ░██   ░░██████ ░██ ░░█ ░░██░██   ░██ ░██   ░██░██████
   ░░     ░░░░░░  ░░   ░   ░░ ░░    ░░  ░░    ░░ ░░░░░░ `}</pre>
        <div className="subhead">// senior full-stack engineer · remote · UTC-3 · last login: today</div>
      </div>

      <Prompt cmd="whoami --short" />
      <div className="output" style={{ paddingLeft: 14, borderLeft: '2px solid var(--line)' }}>
        Building scalable web and mobile systems for ~8 years. Currently <span style={{ color: 'var(--accent)' }}>Senior Full Stack</span> at Headline VC,
        previously Edusynch. Comfortable across <span style={{ color: 'var(--fg)' }}>React / TypeScript / Node / Elixir</span>.
        Migrations, real-time systems, and design systems are my favorite things to talk about.
      </div>

      <Prompt cmd="cat latest-post.md | head" />
      <div className="output">
        <a href={`#/blog/${latest.slug}`} style={{ borderBottom: 'none' }}>
          <div className="box accent-edge">
            <div className="box-title">latest entry · {latest.date} · {latest.read}</div>
            <div style={{ fontSize: 17, color: 'var(--fg)', marginBottom: 6 }}>›&nbsp; {latest.title}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>read full entry →</div>
          </div>
        </a>
      </div>

      <Prompt cmd="ls -t posts/ | head -4" />
      <div className="output">
        <ul className="post-list" style={{ marginTop: 4 }}>
          {POSTS.slice(1, 5).map(p => (
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
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-faint)' }}>
          → <a href="#/blog">see all {POSTS.length} posts</a>
        </div>
      </div>

      <Prompt cmd="help" blink />
      <div className="output" style={{ fontSize: 12, color: 'var(--fg-dim)', paddingLeft: 14 }}>
        press <span className="kbd">⌘K</span> to open the command palette · everything is keyboard-first
      </div>
    </div>
  );
}
