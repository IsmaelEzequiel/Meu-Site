// Tiny markdown renderer for our blog posts and resume.
// Handles: # / ## / ### headings, bullet/numbered lists,
// **bold**, *italic*, `code`, [links](url), --- hr, > blockquotes, paragraphs.

export function renderMarkdown(md) {
  const lines = md.split('\n');
  let html = '';
  let i = 0;
  let inList = false;
  let listTag = 'ul';
  let inPara = false;
  let inCode = false;

  const closeList = () => { if (inList) { html += `</${listTag}>`; inList = false; } };
  const closePara = () => { if (inPara) { html += '</p>'; inPara = false; } };

  const inline = (s) => {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      closeList(); closePara();
      if (!inCode) { html += '<pre><code>'; inCode = true; }
      else { html += '</code></pre>'; inCode = false; }
      i++; continue;
    }
    if (inCode) {
      html += line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
      i++; continue;
    }

    if (trimmed === '') { closeList(); closePara(); i++; continue; }
    if (trimmed === '---') { closeList(); closePara(); html += '<hr>'; i++; continue; }

    let m;
    if ((m = trimmed.match(/^(#{1,4})\s+(.+)$/))) {
      closeList(); closePara();
      const level = m[1].length;
      html += `<h${level}>${inline(m[2])}</h${level}>`;
      i++; continue;
    }

    if ((m = trimmed.match(/^[-*]\s+(.+)$/))) {
      closePara();
      if (!inList || listTag !== 'ul') { closeList(); html += '<ul>'; inList = true; listTag = 'ul'; }
      html += `<li>${inline(m[1])}</li>`;
      i++; continue;
    }
    if ((m = trimmed.match(/^\d+\.\s+(.+)$/))) {
      closePara();
      if (!inList || listTag !== 'ol') { closeList(); html += '<ol>'; inList = true; listTag = 'ol'; }
      html += `<li>${inline(m[1])}</li>`;
      i++; continue;
    }

    if (trimmed.startsWith('> ')) {
      closeList(); closePara();
      html += `<blockquote>${inline(trimmed.slice(2))}</blockquote>`;
      i++; continue;
    }

    closeList();
    if (!inPara) { html += '<p>'; inPara = true; }
    else { html += ' '; }
    html += inline(trimmed);
    i++;
  }

  closeList(); closePara();
  if (inCode) html += '</code></pre>';
  return html;
}

export function parsePostMeta(md) {
  const lines = md.split('\n');
  let title = '';
  let meta = '';
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const t = lines[i].trim();
    if (!title && t.startsWith('# ')) title = t.slice(2).trim();
    else if (!meta && /^\*.+\*$/.test(t)) meta = t.slice(1, -1).trim();
    if (title && meta) break;
  }
  return { title, meta };
}
