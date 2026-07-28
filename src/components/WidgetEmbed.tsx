import React, { useEffect, useRef, useState } from 'react';

interface WidgetEmbedProps {
  src: string;
  title?: string;
}

export const WidgetEmbed: React.FC<WidgetEmbedProps> = ({ src, title = 'Interactive diagram' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(380);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || e.data.wtWidget !== 1 || typeof e.data.h !== 'number') return;

      if (iframeRef.current && iframeRef.current.contentWindow === e.source) {
        setHeight(e.data.h + 10);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Normalize src to ensure it starts with /
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  return (
    <div className="my-8 rounded-xl border border-black/10 dark:border-white/15 overflow-hidden bg-white dark:bg-[#1a1a18] shadow-sm">
      <div className="px-4 py-2 bg-[#f5f5f3] dark:bg-[#242422] border-b border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-[#6b6b66] dark:text-[#a3a39d] font-mono">
        <span className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {title}
        </span>
        <span>Interactive Component</span>
      </div>
      <iframe
        ref={iframeRef}
        src={normalizedSrc}
        title={title}
        loading="lazy"
        scrolling="no"
        className="w-full transition-all duration-200 border-none block"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};
