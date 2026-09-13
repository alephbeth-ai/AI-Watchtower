import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import { WidgetEmbed } from './WidgetEmbed';
import { Checklist } from './Checklist';
import { DetailsAccordion } from './DetailsAccordion';
import { StatBox } from './StatBox';

interface PostContentProps {
  content: string;
}

// Mermaid is loaded on demand from the CDN, only on pages that contain a
// ```mermaid fence, mirroring the Hugo render hook used on the github.io
// build. Typed as `string` (not a literal) so TypeScript does not try to
// resolve the URL as a module; Vite leaves the import to the browser.
const MERMAID_CDN: string = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Render ```mermaid fences as <pre class="mermaid"> holding the diagram
// source; every other fence falls through (return false) to marked's default
// code renderer.
marked.use({
  renderer: {
    code(token) {
      if ((token.lang || '').trim().toLowerCase() === 'mermaid') {
        return `<pre class="mermaid" aria-label="diagram">${escapeHtml(token.text)}</pre>\n`;
      }
      return false;
    },
  },
});

const isDark = (): boolean => document.documentElement.classList.contains('dark');

async function renderMermaid(root: HTMLElement): Promise<void> {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('pre.mermaid'));
  if (nodes.length === 0) return;

  const mod = await import(/* @vite-ignore */ MERMAID_CDN);
  const mermaid = mod.default;

  // Keep the original source on the element so the diagram can be rendered
  // again with the other palette when the theme toggles (mermaid.run replaces
  // the element's content with the SVG).
  for (const el of nodes) {
    if (el.dataset.source === undefined) {
      el.dataset.source = el.textContent ?? '';
    }
    el.textContent = el.dataset.source;
    el.removeAttribute('data-processed');
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark() ? 'dark' : 'neutral',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  });
  await mermaid.run({ nodes });
}

export const PostContent: React.FC<PostContentProps> = ({ content }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  // Render diagrams after the HTML is in the DOM, and again whenever the
  // theme class on <html> changes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      renderMermaid(root).catch((err) => {
        console.error('Mermaid rendering failed', err);
      });
    };

    run();
    const observer = new MutationObserver(run);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [content]);

  // Parse shortcodes into structured placeholders or JSX blocks
  // Shortcodes to process:
  // 1. {{< widget src="..." title="..." >}}
  // 2. {{< checklist key="..." reset="..." >}} ... {{< /checklist >}}
  // 3. {{< details summary="..." open="..." >}} ... {{< /details >}}
  // 4. {{< stat value="..." prefix="..." suffix="..." sep="..." >}}

  const elements: React.ReactNode[] = [];

  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Regular expressions for Hugo shortcodes
  // The body and its closing tag are optional *as a pair*: widget/stat are
  // self-closing, checklist/details wrap content. Making only the closing tag
  // optional would let the lazy body match empty and leak the items into the
  // surrounding markdown.
  const shortcodeRegex =
    /\{\{<\s*(widget|checklist|details|stat)\s*([\s\S]*?)\s*>\}\}(?:([\s\S]*?)\{\{<\s*\/\1\s*>\}\})?/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = shortcodeRegex.exec(content)) !== null) {
    const matchIndex = match.index;
    const matchLength = match[0].length;

    // Render markdown text before shortcode
    if (matchIndex > lastIndex) {
      const markdownBefore = content.slice(lastIndex, matchIndex);
      const htmlBefore = marked.parse(markdownBefore) as string;
      elements.push(
        <div
          key={`md-${lastIndex}`}
          className="prose dark:prose-invert max-w-none text-[#1a1a18] dark:text-[#ededeb] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlBefore }}
        />
      );
    }

    const type = match[1];
    const attrString = match[2];
    const innerContent = match[3] || '';

    // Parse attributes key="value"
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const key = attrMatch[1];
      const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
      attrs[key] = val;
    }

    if (type === 'widget') {
      elements.push(
        <WidgetEmbed
          key={`widget-${matchIndex}`}
          src={attrs.src || ''}
          title={attrs.title}
        />
      );
    } else if (type === 'checklist') {
      elements.push(
        <Checklist
          key={`checklist-${matchIndex}`}
          checklistKey={attrs.key || `check-${matchIndex}`}
          resetLabel={attrs.reset || 'Reset'}
          itemsText={innerContent}
        />
      );
    } else if (type === 'details') {
      elements.push(
        <DetailsAccordion
          key={`details-${matchIndex}`}
          summary={attrs.summary || 'Details'}
          isOpenDefault={attrs.open === 'true'}
          content={innerContent}
        />
      );
    } else if (type === 'stat') {
      elements.push(
        <StatBox
          key={`stat-${matchIndex}`}
          value={attrs.value || attrs.target || '0'}
          prefix={attrs.prefix}
          suffix={attrs.suffix}
          sep={attrs.sep}
        />
      );
    }

    lastIndex = matchIndex + matchLength;
  }

  // Render remaining markdown after last shortcode
  if (lastIndex < content.length) {
    const markdownRemaining = content.slice(lastIndex);
    const htmlRemaining = marked.parse(markdownRemaining) as string;
    elements.push(
      <div
        key={`md-${lastIndex}`}
        className="prose dark:prose-invert max-w-none text-[#1a1a18] dark:text-[#ededeb] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlRemaining }}
      />
    );
  }

  return (
    <div ref={rootRef} className="space-y-6 post-content-area">
      {elements}
    </div>
  );
};
