import site from './data/site.json';
import { Language } from './types';
import { Route, buildPath } from './router';
import { getPostBySlug, getTranslation } from './data/posts';

export interface PageMeta {
  title: string;
  description: string;
  lang: Language;
  path: string;
  /** Same page in each language, for <link rel="alternate" hreflang>. */
  alternates: { lang: Language; path: string }[];
}

const other = (lang: Language): Language => (lang === 'en' ? 'fr' : 'en');

export function pageMetaFor(route: Route): PageMeta {
  const lang = route.lang;
  const t = site[lang];
  const path = buildPath(route);
  const pair = (otherPath: string) => [
    { lang, path },
    { lang: other(lang), path: otherPath },
  ];

  switch (route.kind) {
    case 'home':
      return {
        title: t.title,
        description: t.description,
        lang,
        path,
        alternates: pair(buildPath({ kind: 'home', lang: other(lang) })),
      };
    case 'post': {
      const post = getPostBySlug(route.slug, lang);
      if (!post) {
        return { title: `${t.notFound} — ${site.name}`, description: t.description, lang, path, alternates: [] };
      }
      const translation = getTranslation(post, other(lang));
      return {
        title: `${post.title} — ${site.name}`,
        description: post.description || t.description,
        lang,
        path,
        alternates: translation
          ? pair(buildPath({ kind: 'post', lang: other(lang), slug: translation.slug }))
          : [{ lang, path }],
      };
    }
    case 'lab':
      return {
        title: `${t.lab} — ${site.name}`,
        description: t.description,
        lang,
        path,
        alternates: pair(buildPath({ kind: 'lab', lang: other(lang), widgetId: route.widgetId })),
      };
    case 'contact':
      return {
        title: `${t.contact} — ${site.name}`,
        description: t.description,
        lang,
        path,
        alternates: pair(buildPath({ kind: 'contact', lang: other(lang) })),
      };
    case 'notfound':
      return { title: `${t.notFound} — ${site.name}`, description: t.description, lang, path, alternates: [] };
  }
}

function upsert<T extends HTMLElement>(selector: string, create: () => T): T {
  const existing = document.head.querySelector<T>(selector);
  if (existing) return existing;
  const el = create();
  document.head.appendChild(el);
  return el;
}

/** Mirror the route in <head>: title, description, lang, canonical, hreflang alternates. */
export function applyPageMeta(meta: PageMeta): void {
  document.title = meta.title;
  document.documentElement.lang = meta.lang;

  const description = upsert<HTMLMetaElement>('meta[name="description"]', () => {
    const m = document.createElement('meta');
    m.name = 'description';
    return m;
  });
  description.content = meta.description;

  const canonical = upsert<HTMLLinkElement>('link[rel="canonical"]', () => {
    const l = document.createElement('link');
    l.rel = 'canonical';
    return l;
  });
  canonical.href = site.url + meta.path;

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  for (const alt of meta.alternates) {
    const l = document.createElement('link');
    l.rel = 'alternate';
    l.hreflang = alt.lang;
    l.href = site.url + alt.path;
    document.head.appendChild(l);
  }
}
