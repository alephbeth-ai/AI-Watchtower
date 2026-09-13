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
  /** Set for article pages: drives og:type=article and the article:* tags. */
  article?: { published: string; modified: string; tags: string[] };
}

/** Site-wide share image, generated from the logo (static/og-image.jpg, 1200×630). */
export const OG_IMAGE = {
  path: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Aleph Beth — Defensive AI & Security Engineering',
};

const other = (lang: Language): Language => (lang === 'en' ? 'fr' : 'en');
const locale = (lang: Language): string => (lang === 'fr' ? 'fr_FR' : 'en_US');

/** RSS feed of the articles in one language, written by scripts/postbuild.mjs. */
export function feedPath(lang: Language): string {
  return lang === 'fr' ? '/fr/rss.xml' : '/rss.xml';
}

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
        article: { published: post.date, modified: post.date, tags: post.tags },
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

/** Create or update a <meta> addressed by `property` (Open Graph) or `name` (Twitter). */
function setMeta(attr: 'property' | 'name', key: string, content: string): void {
  const el = upsert<HTMLMetaElement>(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  });
  el.content = content;
}

/** Replace every <meta> of a repeatable key (og:locale:alternate, article:tag) with the given values. */
function setMetaList(key: string, values: string[]): void {
  document.head.querySelectorAll(`meta[property="${key}"]`).forEach((el) => el.remove());
  for (const value of values) {
    const m = document.createElement('meta');
    m.setAttribute('property', key);
    m.content = value;
    document.head.appendChild(m);
  }
}

/**
 * Mirror the route in <head>: title, description, lang, canonical, hreflang
 * alternates, feed link, Open Graph and Twitter card. The pre-rendered pages
 * (scripts/postbuild.mjs) ship the same tags in the static HTML; this keeps
 * them right after client-side navigation.
 */
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

  const feed = upsert<HTMLLinkElement>('link[rel="alternate"][type="application/rss+xml"]', () => {
    const l = document.createElement('link');
    l.rel = 'alternate';
    l.type = 'application/rss+xml';
    return l;
  });
  feed.title = 'Aleph Beth — Articles (RSS)';
  feed.href = site.url + feedPath(meta.lang);

  setMeta('property', 'og:site_name', site.name);
  setMeta('property', 'og:type', meta.article ? 'article' : 'website');
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', site.url + meta.path);
  setMeta('property', 'og:locale', locale(meta.lang));
  setMetaList(
    'og:locale:alternate',
    meta.alternates.filter((a) => a.lang !== meta.lang).map((a) => locale(a.lang))
  );
  setMeta('property', 'og:image', site.url + OG_IMAGE.path);
  setMeta('property', 'og:image:width', String(OG_IMAGE.width));
  setMeta('property', 'og:image:height', String(OG_IMAGE.height));
  setMeta('property', 'og:image:alt', OG_IMAGE.alt);

  document.head.querySelectorAll('meta[property^="article:"]').forEach((el) => el.remove());
  if (meta.article) {
    setMeta('property', 'article:published_time', meta.article.published);
    setMeta('property', 'article:modified_time', meta.article.modified);
    setMetaList('article:tag', meta.article.tags);
  }

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);
  setMeta('name', 'twitter:image', site.url + OG_IMAGE.path);
}
