import 'server-only';
import sanitizeHtml from 'sanitize-html';

/**
 * Cleans blog HTML from the visual/HTML editor before it is stored or shown.
 * Keeps formatting (headings, lists, links, images, tables, alignment) and
 * strips scripts, event handlers, iframes and inline styles other than text-align.
 */
export function sanitizeBlogHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'sub', 'sup',
      'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      '*': ['style'],
    },
    allowedStyles: {
      '*': { 'text-align': [/^(left|right|center|justify)$/] },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['https'] },
    transformTags: {
      // External links open in a new tab; every image lazy-loads.
      a: (tag, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? '') && !/dieseldynamix\.com/.test(attribs.href ?? '');
        return { tagName: 'a', attribs: external ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' } : attribs };
      },
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy', alt: attribs.alt ?? '' } }),
      b: 'strong',
      i: 'em',
    },
  });
}

/** Small Markdown → HTML for opening older Markdown posts in the visual editor. */
export function markdownToEditorHtml(md: string) {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]*)\)/g, '<a href="$2">$1</a>');
  return md
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => {
      const b = block.trim();
      if (!b) return '';
      if (b.startsWith('### ')) return `<h3>${inline(b.slice(4))}</h3>`;
      if (b.startsWith('## ')) return `<h2>${inline(b.slice(3))}</h2>`;
      const lines = b.split('\n');
      if (lines.every((l) => /^[-*] /.test(l.trim()))) return `<ul>${lines.map((l) => `<li>${inline(l.trim().slice(2))}</li>`).join('')}</ul>`;
      if (lines.every((l) => /^\d+\. /.test(l.trim()))) return `<ol>${lines.map((l) => `<li>${inline(l.trim().replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    })
    .join('\n');
}

/** Plain-text copy of a post, kept in `body` for search snippets and as a fallback. */
export function htmlToText(html: string) {
  return sanitizeHtml(html.replace(/<\/(p|h[2-4]|li|blockquote|tr)>/gi, '\n\n'), { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
