import Prompt from '../components/Prompt.jsx';

export default function Contact() {
  return (
    <div>
      <Prompt cmd="ping ismael" />
      <div className="output" style={{ paddingLeft: 14, borderLeft: '2px solid var(--green)' }}>
        <div style={{ color: 'var(--green)' }}>● available — open to interesting work</div>
        <div style={{ color: 'var(--fg-dim)', fontSize: 12 }}>response time: ~24h on weekdays · timezone: UTC-3 (Maceió, BR)</div>
      </div>

      <Prompt cmd="cat contact.json" />
      <div className="output">
        <div className="contact-info">
          <div className="row"><span className="key">email</span>
            <span style={{ fontFamily: 'inherit' }}>
              <span style={{ color: 'var(--fg)' }}>ismaelezequiel</span>
              <span style={{ color: 'var(--fg-dim)', margin: '0 4px' }}>[at]</span>
              <span style={{ color: 'var(--fg)' }}>yahoo</span>
              <span style={{ color: 'var(--fg-dim)', margin: '0 4px' }}>[dot]</span>
              <span style={{ color: 'var(--fg)' }}>com</span>
              <span style={{ color: 'var(--fg-faint)', marginLeft: 10, fontSize: 11 }}>// type it out, dodge the bots</span>
            </span>
          </div>
          <div className="row"><span className="key">github</span>   <a href="https://github.com/ismaelezequiel" target="_blank" rel="noreferrer">github.com/ismaelezequiel ↗</a></div>
          <div className="row"><span className="key">linkedin</span> <a href="https://linkedin.com/in/ismaelezequiel" target="_blank" rel="noreferrer">linkedin.com/in/ismaelezequiel ↗</a></div>
        </div>
      </div>

      <Prompt cmd="echo 'see you in the inbox'" blink />
    </div>
  );
}
