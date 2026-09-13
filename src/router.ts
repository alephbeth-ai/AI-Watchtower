import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Language } from './types';

/**
 * Client-side routing on the History API, no dependency.
 *
 * URL scheme (identical to the Hugo build, so links stay valid across both):
 *   /                      EN home            /fr/                 FR home
 *   /posts/<slug>/         EN article         /fr/posts/<slug>/    FR article
 *   /lab/  /lab/<widget>/  interactive lab    /fr/lab/...
 *   /contact/              contact            /fr/contact/
 *
 * `scripts/postbuild.mjs` pre-renders one index.html per route so every
 * address is served with a 200 and its own <title>/<meta>; unknown paths hit
 * 404.html, which is the same shell and renders the not-found view.
 */
export type Route =
  | { kind: 'home'; lang: Language }
  | { kind: 'post'; lang: Language; slug: string }
  | { kind: 'lab'; lang: Language; widgetId?: string }
  | { kind: 'contact'; lang: Language }
  | { kind: 'notfound'; lang: Language; path: string };

const NAV_EVENT = 'alephbeth:navigate';

function decode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function parsePath(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean).map(decode);

  let lang: Language = 'en';
  if (parts[0] === 'fr' || parts[0] === 'en') {
    lang = parts[0] === 'fr' ? 'fr' : 'en';
    parts.shift();
  }

  if (parts.length === 0) return { kind: 'home', lang };

  const [section, rest, ...more] = parts;
  if (more.length === 0) {
    if (section === 'posts') {
      return rest ? { kind: 'post', lang, slug: rest } : { kind: 'home', lang };
    }
    if (section === 'lab') return { kind: 'lab', lang, widgetId: rest };
    if (section === 'contact' && !rest) return { kind: 'contact', lang };
  }

  return { kind: 'notfound', lang, path: pathname };
}

export function buildPath(route: Route): string {
  const prefix = route.lang === 'fr' ? '/fr' : '';
  switch (route.kind) {
    case 'home':
      return `${prefix}/`;
    case 'post':
      return `${prefix}/posts/${encodeURIComponent(route.slug)}/`;
    case 'lab':
      return `${prefix}/lab/${route.widgetId ? `${encodeURIComponent(route.widgetId)}/` : ''}`;
    case 'contact':
      return `${prefix}/contact/`;
    case 'notfound':
      return route.path;
  }
}

export function currentRoute(): Route {
  return parsePath(window.location.pathname);
}

/** Push (or replace) the URL and notify every `useRoute` subscriber. */
export function navigate(route: Route, options: { replace?: boolean } = {}): void {
  const path = buildPath(route);
  if (options.replace) {
    window.history.replaceState(null, '', path);
  } else if (path !== window.location.pathname) {
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0 });
  }
  window.dispatchEvent(new Event(NAV_EVENT));
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    const update = () => setRoute(currentRoute());
    window.addEventListener('popstate', update);
    window.addEventListener(NAV_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(NAV_EVENT, update);
    };
  }, []);

  return route;
}

/** True for a plain left click: modifier clicks keep the browser's open-in-new-tab behaviour. */
export function isPlainLeftClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
