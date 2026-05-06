import Prompt from '../components/Prompt.jsx';

export default function About() {
  return (
    <div>
      <Prompt cmd="cat about.txt" />
      <div className="output" style={{ paddingLeft: 14, borderLeft: '2px solid var(--line)' }}>
        <p style={{ marginTop: 0 }}>I build software for a living and write about it for fun. I started in
        Maceió (a small city on the Brazilian coast) shipping landing pages and e-commerce sites,
        and have spent the last several years on harder problems — real-time systems, large
        legacy migrations, and the kind of full-stack work that doesn't fit cleanly under
        "frontend" or "backend".</p>
        <p>Currently at <span style={{ color: 'var(--accent)' }}>Headline VC</span> in San
        Francisco (remote), where I've architected the migration of our core platform to React
        Native and built data-enrichment services in Phoenix/Elixir. Before that, I spent
        ~5 years at Edusynch building a Chrome extension for online proctoring that served
        5,000+ MAU.</p>
        <p>I care about: <span style={{ color: 'var(--fg)' }}>shipping fast without making future-me hate
        present-me</span>, design systems that have teeth, and writing code that the next person
        can actually read. I don't care about: religious wars over frameworks.</p>
      </div>

      <Prompt cmd="cat ~/.now" />
      <div className="output">
        <div className="now-grid">
          <div className="box">
            <div className="box-title">working on</div>
            Phoenix/Elixir MCP endpoints and a learning platform with React + Next (SSG).
          </div>
          <div className="box">
            <div className="box-title">reading</div>
            A Philosophy of Software Design (Ousterhout). Re-reading, actually.
          </div>
          <div className="box">
            <div className="box-title">learning</div>
            Going deeper on the BEAM internals — supervision strategies, distributed Erlang.
          </div>
          <div className="box">
            <div className="box-title">listening</div>
            Lots of ambient and Brazilian instrumental while I work.
          </div>
        </div>
      </div>

      <Prompt cmd="cat stack.txt" />
      <div className="output" style={{ fontSize: 13, color: 'var(--fg-dim)', paddingLeft: 14 }}>
        <div><span style={{ color: 'var(--accent)' }}>fe </span>→ react · next · typescript · tailwind · storybook</div>
        <div><span style={{ color: 'var(--accent)' }}>be </span>→ node · elixir/phoenix · rails · graphql</div>
        <div><span style={{ color: 'var(--accent)' }}>db </span>→ postgres · mongo · redis</div>
        <div><span style={{ color: 'var(--accent)' }}>ops</span>→ aws · docker · kubernetes</div>
      </div>

      <Prompt cmd="echo 'thanks for reading'" blink />
    </div>
  );
}
