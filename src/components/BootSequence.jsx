import { useEffect, useState } from 'react';

const LINES = [
  { t: 0,    text: '[    0.000000] booting ismael.dev v.2026.05',          cls: 'dim' },
  { t: 220,  text: '[    0.124310] reticulating splines........... ',      cls: '',     after: '[ ok ]', afterCls: 'ok' },
  { t: 480,  text: '[    0.342102] mounting /home/ismael........... ',     cls: '',     after: '[ ok ]', afterCls: 'ok' },
  { t: 760,  text: '[    0.618992] starting blog service........... ',     cls: '',     after: '[ ok ]', afterCls: 'ok' },
  { t: 1040, text: '[    0.871057] starting guestbook daemon....... ',     cls: '',     after: '[ ok ]', afterCls: 'ok' },
  { t: 1280, text: '[    1.104210] loading command palette......... ',     cls: '',     after: '[ ok ]', afterCls: 'ok' },
  { t: 1560, text: '[    1.430925] resolving identity.............. ',     cls: '',     after: '[ ok ]', afterCls: 'ok' },
  { t: 1820, text: '',                                                     cls: '' },
  { t: 1880, text: 'welcome.',                                              cls: 'accent' },
];

export default function BootSequence({ onDone }) {
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timeouts = LINES.map((l, i) =>
      setTimeout(() => setShown(s => Math.max(s, i + 1)), l.t)
    );
    const fade = setTimeout(() => setFading(true), 2500);
    const done = setTimeout(onDone, 2850);
    return () => { timeouts.forEach(clearTimeout); clearTimeout(fade); clearTimeout(done); };
  }, [onDone]);

  return (
    <div className={'boot' + (fading ? ' fading' : '')}>
      <div className="boot-inner">
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={l.cls}>
            {l.text}
            {l.after && <span className={l.afterCls}>{l.after}</span>}
          </div>
        ))}
        {shown < LINES.length && <span className="cursor" />}
      </div>
    </div>
  );
}
