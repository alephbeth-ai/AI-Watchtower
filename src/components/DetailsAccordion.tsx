import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { marked } from 'marked';

interface DetailsAccordionProps {
  summary: string;
  isOpenDefault?: boolean;
  content: string;
}

export const DetailsAccordion: React.FC<DetailsAccordionProps> = ({
  summary,
  isOpenDefault = false,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const htmlContent = marked.parse(content) as string;

  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
      className="my-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1a1a18] overflow-hidden shadow-sm transition-all"
    >
      <summary className="flex items-center justify-between gap-3 px-4 py-3 bg-[#f5f5f3] dark:bg-[#242422] hover:bg-[#eaeae7] dark:hover:bg-[#2a2a27] cursor-pointer font-medium text-sm text-[#1a1a18] dark:text-[#ededeb] select-none transition-colors">
        <span>{summary}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#6b6b66] dark:text-[#a3a39d] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </summary>
      <div
        className="p-4 text-sm leading-relaxed prose dark:prose-invert max-w-none border-t border-black/5 dark:border-white/5"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </details>
  );
};
