'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * EN | SP switch. Spanish uses Google's website translator, loaded only after a visitor picks SP
 * (no Google script or cookie for English visitors). The choice is kept in Google's own
 * "googtrans" cookie, so every page a visitor opens afterwards stays in Spanish.
 */
type Lang = 'en' | 'es';

declare global {
  interface Window {
    ddTranslateInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: object, el: string) => unknown } };
  }
}

const COOKIE = 'googtrans';

function current(): Lang {
  return /(?:^|;\s*)googtrans=\/en\/es/.test(document.cookie) ? 'es' : 'en';
}

function setCookie(value: string | null) {
  const host = location.hostname;
  const parts = host.split('.');
  const apex = parts.length > 1 ? `.${parts.slice(-2).join('.')}` : host;
  const expire = value ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  for (const domain of ['', `; domain=${host}`, `; domain=${apex}`]) {
    document.cookie = `${COOKIE}=${value ?? ''}; path=/${domain}${expire}`;
  }
}

/** Google's translator rewrites text nodes; keep React from crashing when it later updates them. */
function guardDom() {
  const proto = Node.prototype as unknown as { __ddGuard?: boolean; removeChild: typeof Node.prototype.removeChild; insertBefore: typeof Node.prototype.insertBefore };
  if (proto.__ddGuard) return;
  proto.__ddGuard = true;
  const remove = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return remove.call(this, child) as T;
  };
  const insert = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insert.call(this, node, ref) as T;
  };
}

/** Official program and brand names stay in English (Spanish-speaking truckers search them in English). */
const KEEP = /\b(Clean Truck Check|CTC-VIS|Diesel Dynamix|CARB|OBD|GVWR)\b/;

function protectTerms(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentElement;
      if (!p || p.closest('script,style,noscript,.notranslate,[translate="no"]')) return NodeFilter.FILTER_REJECT;
      return KEEP.test(n.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    // Split into [text, term, text, term, ...]; the spaces around a term go inside its span,
    // because the translator trims the edges of the text it translates ("Fleet " -> "Flota").
    const parts = (node.nodeValue ?? '').split(new RegExp(KEEP.source, 'g'));
    if (parts.length < 2) continue;
    for (let i = 1; i < parts.length; i += 2) {
      const lead = parts[i - 1].match(/\s+$/)?.[0] ?? '';
      const trail = parts[i + 1]?.match(/^\s+/)?.[0] ?? '';
      parts[i - 1] = parts[i - 1].slice(0, parts[i - 1].length - lead.length);
      parts[i] = lead + parts[i] + trail;
      if (parts[i + 1] !== undefined) parts[i + 1] = parts[i + 1].slice(trail.length);
    }
    const frag = document.createDocumentFragment();
    parts.forEach((part, i) => {
      if (!part) return;
      if (i % 2) {
        const span = document.createElement('span');
        span.className = 'notranslate';
        span.setAttribute('translate', 'no');
        span.style.whiteSpace = 'pre-wrap';
        span.textContent = part;
        frag.appendChild(span);
      } else frag.appendChild(document.createTextNode(part));
    });
    node.parentNode?.replaceChild(frag, node);
  }
}

let observer: MutationObserver | null = null;
function watchTerms() {
  protectTerms(document.body);
  if (observer) return;
  // New content after client-side navigation gets the same protection before it is translated.
  observer = new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE) && protectTerms(n.nodeType === Node.TEXT_NODE ? n.parentNode ?? n : n));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function loadTranslator() {
  if (document.getElementById('dd-gt-script')) return;
  guardDom();
  watchTerms();
  let host = document.getElementById('dd-gt');
  if (!host) {
    host = document.createElement('div');
    host.id = 'dd-gt';
    host.hidden = true;
    document.body.appendChild(host);
  }
  window.ddTranslateInit = () => {
    if (window.google?.translate) new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,es', autoDisplay: false }, 'dd-gt');
  };
  const s = document.createElement('script');
  s.id = 'dd-gt-script';
  s.src = 'https://translate.google.com/translate_a/element.js?cb=ddTranslateInit';
  s.async = true;
  document.body.appendChild(s);
}

export function LangToggle({ className }: { className?: string }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const l = current();
    setLang(l);
    if (l === 'es') {
      document.documentElement.lang = 'es';
      loadTranslator();
    }
  }, []);

  const pick = (l: Lang) => {
    if (l === lang) return;
    if (l === 'es') {
      setCookie('/en/es');
      setLang('es');
      document.documentElement.lang = 'es';
      loadTranslator();
    } else {
      // Back to the original English page: drop the choice and reload without the translator.
      setCookie(null);
      location.reload();
    }
  };

  return (
    <div role="group" aria-label="Language" className={cn('notranslate inline-flex overflow-hidden rounded-md border border-white/25 text-xs font-bold', className)} translate="no">
      {(['en', 'es'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => pick(l)}
          aria-pressed={lang === l}
          lang={l}
          title={l === 'en' ? 'English' : 'Español'}
          className={cn('px-2 py-1 text-[11px] tracking-wide transition-colors sm:px-2.5 sm:py-1.5 sm:text-xs', lang === l ? 'bg-accent-deep text-white' : 'text-white/80 hover:bg-white/10 hover:text-white')}
        >
          {l === 'en' ? 'EN' : 'SP'}
        </button>
      ))}
    </div>
  );
}
