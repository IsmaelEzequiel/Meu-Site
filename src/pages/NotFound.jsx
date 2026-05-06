import Prompt from '../components/Prompt.jsx';

export default function NotFound({ path }) {
  return (
    <div>
      <Prompt cmd={`cd ${path}`} />
      <div className="output" style={{ color: 'var(--accent)' }}>cd: {path}: No such file or directory</div>
      <div className="back-link">→ <a href="#/">back to home</a> &nbsp;or press <span className="kbd">⌘K</span></div>
    </div>
  );
}
