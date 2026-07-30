import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, ExternalLink } from 'lucide-react';

interface WidgetEmbedProps {
  src: string;
  title?: string;
  /**
   * 'flow' (default) lets the widget report its own content height.
   * 'app' frames a fixed-viewport widget (slide decks, dashboards) in a window
   * sized to the reader's screen, with fullscreen and open-in-new-tab controls.
   */
  variant?: 'flow' | 'app';
}

function appHeight(): number {
  if (typeof window === 'undefined') return 720;
  return Math.round(Math.min(900, Math.max(560, window.innerHeight * 0.82)));
}

export const WidgetEmbed: React.FC<WidgetEmbedProps> = ({
  src,
  title = 'Interactive diagram',
  variant = 'flow',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(variant === 'app' ? appHeight() : 380);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Flow widgets size themselves via postMessage; app widgets track the viewport.
  useEffect(() => {
    if (variant === 'app') return;

    const handleMessage = (e: MessageEvent) => {
      if (!e.data || e.data.wtWidget !== 1 || typeof e.data.h !== 'number') return;

      if (iframeRef.current && iframeRef.current.contentWindow === e.source) {
        setHeight(e.data.h + 10);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [variant]);

  useEffect(() => {
    if (variant !== 'app') return;

    const onResize = () => setHeight(appHeight());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [variant]);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen?.();
    }
  }, []);

  // Normalize src to ensure it starts with /
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  const isApp = variant === 'app';

  return (
    <div
      ref={containerRef}
      className={`my-8 rounded-xl border border-black/10 dark:border-white/15 overflow-hidden bg-white dark:bg-[#1a1a18] shadow-sm ${
        isFullscreen ? 'my-0 rounded-none flex flex-col h-full' : ''
      }`}
    >
      <div className="px-4 py-2 bg-[#f5f5f3] dark:bg-[#242422] border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3 text-xs text-[#6b6b66] dark:text-[#a3a39d] font-mono">
        <span className="flex items-center gap-2 font-medium min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></span>
          <span className="truncate">{title}</span>
        </span>
        {isApp ? (
          <span className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <a
              href={normalizedSrc}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in a new tab"
              aria-label="Open in a new tab"
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </span>
        ) : (
          <span className="flex-shrink-0">Interactive Component</span>
        )}
      </div>
      <iframe
        ref={iframeRef}
        src={normalizedSrc}
        title={title}
        loading="lazy"
        scrolling="no"
        className={`w-full transition-all duration-200 border-none block ${isFullscreen ? 'flex-1' : ''}`}
        style={isFullscreen ? undefined : { height: `${height}px` }}
      />
    </div>
  );
};
