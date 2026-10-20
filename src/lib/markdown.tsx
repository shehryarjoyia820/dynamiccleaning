import { Fragment } from 'react';

/**
 * Minimal Markdown for blog posts edited in /admin: ## / ### headings,
 * paragraphs, "- " and "1. " lists, **bold** and [links](https://...).
 * Output is React elements, so post text can never inject HTML.
 */
function inline(text: string, key: string) {
  const parts: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={`${key}-b${i++}`}>{m[1]}</strong>);
    else {
      const external = m[3].startsWith('http');
      parts.push(
        <a key={`${key}-a${i++}`} href={m[3]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {m[2]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, '\n').split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, bi) => {
        const b = block.trim();
        const k = `b${bi}`;
        if (!b) return null;
        if (b.startsWith('### ')) return <h3 key={k}>{inline(b.slice(4), k)}</h3>;
        if (b.startsWith('## ')) return <h2 key={k}>{inline(b.slice(3), k)}</h2>;
        const lines = b.split('\n');
        if (lines.every((l) => /^[-*] /.test(l.trim())))
          return <ul key={k}>{lines.map((l, li) => <li key={li}>{inline(l.trim().slice(2), `${k}-${li}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l.trim())))
          return <ol key={k}>{lines.map((l, li) => <li key={li}>{inline(l.trim().replace(/^\d+\. /, ''), `${k}-${li}`)}</li>)}</ol>;
        return (
          <p key={k}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 ? <br /> : null}
                {inline(l, `${k}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
