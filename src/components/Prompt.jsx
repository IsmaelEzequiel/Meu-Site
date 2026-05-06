export default function Prompt({ user = 'ismael', host = 'dev', path = '~', cmd, blink = false }) {
  return (
    <div className="prompt-line">
      <span className="user">{user}</span>
      <span className="at">@</span>
      <span className="host">{host}</span>
      <span className="path"> {path}</span>
      <span className="dollar">$</span>
      <span className="cmd">{cmd}</span>
      {blink && <span className="cursor" />}
    </div>
  );
}
