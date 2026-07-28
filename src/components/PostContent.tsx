import React from 'react';
import { marked } from 'marked';
import { WidgetEmbed } from './WidgetEmbed';
import { Checklist } from './Checklist';
import { DetailsAccordion } from './DetailsAccordion';
import { StatBox } from './StatBox';

interface PostContentProps {
  content: string;
}

export const PostContent: React.FC<PostContentProps> = ({ content }) => {
  // Parse shortcodes into structured placeholders or JSX blocks
  // Shortcodes to process:
  // 1. {{< widget src="..." title="..." >}}
  // 2. {{< checklist key="..." reset="..." >}} ... {{< /checklist >}}
  // 3. {{< details summary="..." open="..." >}} ... {{< /details >}}
  // 4. {{< stat value="..." prefix="..." suffix="..." sep="..." >}}

  const elements: React.ReactNode[] = [];
  let remainingText = content;

  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Regular expressions for Hugo shortcodes
  const shortcodeRegex =
    /\{\{<\s*(widget|checklist|details|stat)\s*([\s\S]*?)\s*>\}\}([\s\S]*?)(?:\{\{<\s*\/\1\s*>\}\})?/g;

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

  return <div className="space-y-6 post-content-area">{elements}</div>;
};
