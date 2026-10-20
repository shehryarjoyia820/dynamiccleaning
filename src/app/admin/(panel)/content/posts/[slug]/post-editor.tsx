'use client';

import { useRef, useState, useTransition } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  Upload,
} from 'lucide-react';
import { uploadBlogImage } from '../../../actions';

async function upload(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await uploadBlogImage(fd);
  if (res.error || !res.url) throw new Error(res.error ?? 'Upload failed');
  return res.url;
}

// ---------------------------------------------------------------- Featured image

export function CoverField({ url: initialUrl, alt: initialAlt }: { url: string; alt: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  const pick = (file?: File) => {
    if (!file) return;
    setError('');
    start(async () => {
      try {
        setUrl(await upload(file));
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  return (
    <fieldset className="rounded-lg border border-ink/15 p-4">
      <legend className="px-1 text-sm font-semibold text-ink">Featured image</legend>
      <input type="hidden" name="cover_url" value={url} />
      <div className="grid gap-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-dashed border-ink/25 bg-offwhite">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={alt || 'Featured image preview'} className="h-full w-full object-cover" />
          ) : (
            <button type="button" onClick={() => input.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm text-muted hover:text-ink">
              <Upload className="h-5 w-5" aria-hidden /> Upload image
            </button>
          )}
          {pending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-6 w-6 animate-spin text-accent-ink" aria-label="Uploading" />
            </div>
          ) : null}
        </div>
        <div className="grid content-start gap-3">
          <div>
            <label className="label" htmlFor="cover_alt">Alt text {url ? <span className="text-[#B42318]">*</span> : null}</label>
            <input
              id="cover_alt"
              name="cover_alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              maxLength={300}
              required={Boolean(url)}
              placeholder="e.g. Technician running an OBD test on a Freightliner at the Port of Long Beach"
              className="field"
            />
            <p className="mt-1 text-xs text-muted">Describe what the image shows. Used by screen readers and Google Images.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-ink/20 px-3 py-1.5 hover:bg-offwhite">
              <Upload className="h-4 w-4" aria-hidden /> {url ? 'Replace' : 'Upload'}
            </button>
            {url ? (
              <button type="button" onClick={() => setUrl('')} className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[#B42318] hover:bg-[#B42318]/5">
                <Trash2 className="h-4 w-4" aria-hidden /> Remove
              </button>
            ) : null}
          </div>
          {error ? <p className="text-sm font-semibold text-[#B42318]">{error}</p> : null}
          <p className="text-xs text-muted">JPG, PNG or WebP up to 4 MB. 1600×900 works best; also used when the post is shared on social media.</p>
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
    </fieldset>
  );
}

// ---------------------------------------------------------------- Body editor

function ToolButton({ on, active, label, children, disabled }: { on: () => void; active?: boolean; label: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      className={`inline-flex h-8 w-8 items-center justify-center rounded ${active ? 'bg-ink text-white' : 'text-ink hover:bg-ink/10'} disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-ink/15" aria-hidden />;

function Toolbar({ editor, onImage, uploading }: { editor: Editor; onImage: () => void; uploading: boolean }) {
  const c = () => editor.chain().focus();
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const href = window.prompt('Link URL (https://… or /page)', prev ?? 'https://');
    if (href === null) return;
    if (!href || href === 'https://') return void c().extendMarkRange('link').unsetLink().run();
    c().extendMarkRange('link').setLink({ href }).run();
  };
  const [block, setBlock] = [
    editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : editor.isActive('heading', { level: 4 }) ? 'h4' : 'p',
    (v: string) => {
      if (v === 'p') c().setParagraph().run();
      else c().setHeading({ level: Number(v[1]) as 2 | 3 | 4 }).run();
    },
  ];
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-ink/15 bg-offwhite px-2 py-1.5">
      <select value={block} onChange={(e) => setBlock(e.target.value)} aria-label="Text style" className="mr-1 h-8 rounded border border-ink/20 bg-white px-2 text-sm">
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
      <ToolButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} on={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} on={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolButton>
      <Sep />
      <ToolButton label="Bold" active={editor.isActive('bold')} on={() => c().toggleBold().run()}><Bold className="h-4 w-4" /></ToolButton>
      <ToolButton label="Italic" active={editor.isActive('italic')} on={() => c().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolButton>
      <ToolButton label="Underline" active={editor.isActive('underline')} on={() => c().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></ToolButton>
      <ToolButton label="Strikethrough" active={editor.isActive('strike')} on={() => c().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolButton>
      <Sep />
      <ToolButton label="Bulleted list" active={editor.isActive('bulletList')} on={() => c().toggleBulletList().run()}><List className="h-4 w-4" /></ToolButton>
      <ToolButton label="Numbered list" active={editor.isActive('orderedList')} on={() => c().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolButton>
      <ToolButton label="Quote" active={editor.isActive('blockquote')} on={() => c().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolButton>
      <ToolButton label="Divider" on={() => c().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolButton>
      <Sep />
      <ToolButton label="Align left" active={editor.isActive({ textAlign: 'left' })} on={() => c().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></ToolButton>
      <ToolButton label="Align center" active={editor.isActive({ textAlign: 'center' })} on={() => c().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></ToolButton>
      <ToolButton label="Align right" active={editor.isActive({ textAlign: 'right' })} on={() => c().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></ToolButton>
      <Sep />
      <ToolButton label="Add or edit link" active={editor.isActive('link')} on={setLink}><Link2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Remove link" disabled={!editor.isActive('link')} on={() => c().unsetLink().run()}><Unlink className="h-4 w-4" /></ToolButton>
      <ToolButton label="Insert image" disabled={uploading} on={onImage}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </ToolButton>
      <Sep />
      <ToolButton label="Undo" disabled={!editor.can().undo()} on={() => c().undo().run()}><Undo2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Redo" disabled={!editor.can().redo()} on={() => c().redo().run()}><Redo2 className="h-4 w-4" /></ToolButton>
    </div>
  );
}

/**
 * Classic (visual) editor and raw HTML editor for a post body. Both edit the
 * same HTML, submitted as `body_html`; the server sanitizes it before saving.
 */
export function BodyEditor({ initialHtml }: { initialHtml: string }) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [html, setHtml] = useState(initialHtml);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialHtml,
    editorProps: { attributes: { class: 'prose-dd max-w-none min-h-[24rem] px-4 py-4 focus:outline-none', 'aria-label': 'Post body' } },
    onUpdate: ({ editor: e }) => setHtml(e.getHTML()),
  });

  const switchTo = (next: 'visual' | 'html') => {
    if (next === mode) return;
    if (next === 'visual') editor?.commands.setContent(html, false);
    else if (editor) setHtml(editor.getHTML());
    setMode(next);
  };

  const insertImage = (file?: File) => {
    if (!file || !editor) return;
    const alt = window.prompt('Alt text for this image (describe what it shows):', '') ?? '';
    setError('');
    setUploading(true);
    upload(file)
      .then((src) => editor.chain().focus().setImage({ src, alt }).run())
      .catch((e: Error) => setError(e.message))
      .finally(() => {
        setUploading(false);
        if (fileInput.current) fileInput.current.value = '';
      });
  };

  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <span className="label mb-0">Body</span>
        <div role="tablist" aria-label="Editor mode" className="inline-flex rounded-md border border-ink/20 p-0.5 text-sm font-semibold">
          {(['visual', 'html'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchTo(m)}
              className={`rounded px-3 py-1 ${mode === m ? 'bg-ink text-white' : 'text-ink hover:bg-ink/5'}`}
            >
              {m === 'visual' ? 'Visual' : 'HTML'}
            </button>
          ))}
        </div>
      </div>
      <input type="hidden" name="body_html" value={html} />
      <div className="overflow-hidden rounded-md border border-ink/20 bg-white">
        {mode === 'visual' ? (
          editor ? (
            <>
              <Toolbar editor={editor} uploading={uploading} onImage={() => fileInput.current?.click()} />
              <EditorContent editor={editor} />
            </>
          ) : (
            <div className="flex min-h-[24rem] items-center justify-center text-muted">
              <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading editor" />
            </div>
          )
        ) : (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={24}
            spellCheck={false}
            aria-label="Post body HTML"
            className="block w-full resize-y border-0 bg-charcoal p-4 font-mono text-sm leading-relaxed text-offwhite focus:outline-none"
          />
        )}
      </div>
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => insertImage(e.target.files?.[0])} />
      {error ? <p className="mt-1 text-sm font-semibold text-[#B42318]">{error}</p> : null}
      <p className="mt-1 text-sm text-muted">
        {mode === 'visual'
          ? 'Format with the toolbar. Paste from Google Docs or Word keeps headings, lists and links.'
          : 'Allowed: headings, paragraphs, lists, links, images, tables, quotes, bold/italic and text-align. Scripts, iframes and other styles are removed on save. Tables only survive if you stay in HTML mode.'}
      </p>
    </div>
  );
}
