import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { Language, Post } from '../types';
import { Link } from './Link';
import { themeFor, themeStyle } from '../data/themes';

/** Auto-advance period. Paused on hover/focus and disabled under prefers-reduced-motion. */
const INTERVAL_MS = 7000;
/** Maximum number of slides. */
const MAX_SLIDES = 5;
/** Minimum horizontal drag (px) to count as a swipe. */
const SWIPE_PX = 40;

const LABELS = {
  en: {
    region: 'Featured articles',
    kicker: 'Featured',
    prev: 'Previous article',
    next: 'Next article',
    goTo: (n: number) => `Go to slide ${n}`,
    slide: (i: number, n: number) => `Slide ${i} of ${n}`,
    read: 'Read the article',
    minutes: 'min',
  },
  fr: {
    region: 'Articles à la une',
    kicker: 'À la une',
    prev: 'Article précédent',
    next: 'Article suivant',
    goTo: (n: number) => `Aller à la diapositive ${n}`,
    slide: (i: number, n: number) => `Diapositive ${i} sur ${n}`,
    read: "Lire l'article",
    minutes: 'min',
  },
} satisfies Record<Language, unknown>;

/**
 * Posts pinned with `featured: true` come first (newest first, as `posts` is
 * already sorted by date); the most recent other posts fill the remaining
 * slots so the carousel is never thin.
 */
export function selectSlides(posts: Post[], max = MAX_SLIDES): Post[] {
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, max);
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

interface FeaturedCarouselProps {
  posts: Post[];
  lang: Language;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ posts, lang }) => {
  const t = LABELS[lang];
  const slides = selectSlides(posts);
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const dragStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  // Keep the index valid if the slide set shrinks (language switch).
  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [index, count]);

  // Auto-advance.
  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, count]);

  if (count === 0) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) >= SWIPE_PX) goTo(index + (dx < 0 ? 1 : -1));
  };

  const current = slides[index];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={t.region}
      className="relative mb-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
    >
      {/* Screen-reader announcement of the active slide */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t.slide(index + 1, count)}: {current.title}
      </div>

      <div
        className="overflow-hidden rounded-3xl border border-slate-200 dark:border-cyan-900/50 bg-white dark:bg-[#0f172a] shadow-sm"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStartX.current = null)}
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((post, i) => {
            const theme = themeFor(post.theme);
            const active = i === index;
            return (
              <article
                key={post.id}
                role="group"
                aria-roledescription="slide"
                aria-label={t.slide(i + 1, count)}
                aria-hidden={!active}
                style={themeStyle(theme)}
                className="relative w-full shrink-0 p-8 sm:p-10 lg:p-12 border-l-[6px] border-l-[color:var(--theme)] dark:border-l-[color:var(--theme-dark)] select-none"
              >
                {/* Theme-tinted glow */}
                <div
                  aria-hidden="true"
                  className="absolute -right-24 -top-24 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-25 pointer-events-none bg-[color:var(--theme)] dark:bg-[color:var(--theme-dark)]"
                />

                <div className="relative z-10 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-cyan-50 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300/80 dark:border-cyan-700/80">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.kicker}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full bg-[color:var(--theme)] dark:bg-[color:var(--theme-dark)]"
                      />
                      {theme.label[lang]}
                    </span>
                    {post.categories[0] && post.categories[0].toLowerCase() !== theme.label[lang].toLowerCase() && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-cyan-950">
                        {post.categories[0]}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-slate-100 mb-4">
                    <Link
                      to={{ kind: 'post', lang: post.lang, slug: post.slug }}
                      tabIndex={active ? 0 : -1}
                      className="no-underline hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    {post.readingTime && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} {t.minutes}
                      </span>
                    )}
                    <Link
                      to={{ kind: 'post', lang: post.lang, slug: post.slug }}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white no-underline shadow-cyber-cyan transition-colors"
                    >
                      {t.read} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-2" role="tablist" aria-label={t.region}>
            {slides.map((post, i) => (
              <button
                key={post.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={t.goTo(i + 1)}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index
                    ? 'w-8 bg-cyan-500'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-cyan-400 dark:hover:bg-cyan-500'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t.prev}
              onClick={() => goTo(index - 1)}
              className="p-2 rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 text-slate-600 dark:text-slate-300 hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={t.next}
              onClick={() => goTo(index + 1)}
              className="p-2 rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 text-slate-600 dark:text-slate-300 hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
