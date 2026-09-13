// Post-build step for GitHub Pages, run by `npm run build` after `vite build`.
//
// 1. Pre-render one index.html per route. GitHub Pages serves static files
//    only: without this every deep link (/posts/<slug>/, /fr/, /lab/…) would be
//    a 404 and only the home page would carry a <title> and description. The
//    script copies the built shell into dist/<route>/index.html with the head
//    rewritten for that page, so each address answers 200 with its own
//    metadata before JavaScript runs. Unknown paths fall back to dist/404.html,
//    the same shell, where the app renders its not-found view.
// 2. Emit the discovery files: sitemap.xml, robots.txt, and one RSS feed per
//    language (rss.xml, fr/rss.xml).
//
// Route scheme and page metadata mirror src/router.ts and src/seo.ts.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const site = JSON.parse(readFileSync(join(root, 'src', 'data', 'site.json'), 'utf8'));
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const LANGS = ['en', 'fr'];
const other = (lang) => (lang === 'en' ? 'fr' : 'en');
const prefix = (lang) => (lang === 'fr' ? '/fr' : '');
const feedPath = (lang) => `${prefix(lang)}/rss.xml`;

// --- Content -----------------------------------------------------------------

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const metadata = {};
  if (!match) return metadata;
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      metadata[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      continue;
    }
    metadata[key] = value === 'true' ? true : value === 'false' ? false : value;
  }
  return metadata;
}

function loadPosts() {
  const posts = [];
  for (const lang of LANGS) {
    const dir = join(root, 'content', lang, 'posts');
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.md') || file.startsWith('_')) continue;
      const meta = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
      if (meta.draft === true) continue;
      const slug = file.replace(/\.md$/, '');
      posts.push({
        lang,
        slug,
        path: `${prefix(lang)}/posts/${encodeURIComponent(slug)}/`,
        title: meta.title || file,
        description: meta.summary || meta.description || site[lang].description,
        date: meta.date || '2026-06-01',
        lastmod: meta.lastmod || meta.date || '2026-06-01',
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        translationKey: meta.translationKey,
      });
    }
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

function widgetIds() {
  const source = readFileSync(join(root, 'src', 'data', 'widgets.ts'), 'utf8');
  return [...new Set([...source.matchAll(/^\s*id:\s*'([^']+)'/gm)].map((m) => m[1]))];
}

// --- Helpers -----------------------------------------------------------------

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const absolute = (path) => `${site.url}${path}`;

function writeFile(relativePath, content) {
  const target = join(dist, ...relativePath.split('/').filter(Boolean));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

// --- HTML pages --------------------------------------------------------------

const OG_IMAGE = { path: '/og-image.jpg', width: 1200, height: 630, alt: 'Aleph Beth — Defensive AI & Security Engineering' };
const locale = (lang) => (lang === 'fr' ? 'fr_FR' : 'en_US');

function render({ title, description, lang, path, alternates, article }) {
  const feedTitle = 'Aleph Beth — Articles (RSS)';
  const meta = (attr, value) => `<meta ${attr} content="${escapeXml(value)}" />`;
  const head = [
    `<meta name="description" content="${escapeXml(description)}" />`,
    `<link rel="canonical" href="${absolute(path)}" />`,
    ...alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${absolute(a.path)}" />`),
    `<link rel="alternate" type="application/rss+xml" title="${escapeXml(feedTitle)}" href="${absolute(feedPath(lang))}" />`,
    // Open Graph: what LinkedIn, Slack, Discord, Mastodon, WhatsApp… show for a pasted link.
    meta('property="og:site_name"', site.name),
    meta('property="og:type"', article ? 'article' : 'website'),
    meta('property="og:title"', title),
    meta('property="og:description"', description),
    meta('property="og:url"', absolute(path)),
    meta('property="og:locale"', locale(lang)),
    ...alternates.filter((a) => a.lang !== lang).map((a) => meta('property="og:locale:alternate"', locale(a.lang))),
    meta('property="og:image"', absolute(OG_IMAGE.path)),
    meta('property="og:image:width"', String(OG_IMAGE.width)),
    meta('property="og:image:height"', String(OG_IMAGE.height)),
    meta('property="og:image:alt"', OG_IMAGE.alt),
    ...(article
      ? [
          meta('property="article:published_time"', article.date),
          meta('property="article:modified_time"', article.lastmod),
          ...article.tags.map((tag) => meta('property="article:tag"', tag)),
        ]
      : []),
    // Twitter / X card
    meta('name="twitter:card"', 'summary_large_image'),
    meta('name="twitter:title"', title),
    meta('name="twitter:description"', description),
    meta('name="twitter:image"', absolute(OG_IMAGE.path)),
  ]
    .map((line) => `    ${line}`)
    .join('\n');

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeXml(title)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/g, '')
    .replace(/\s*<meta (property="og:|name="twitter:)[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace('</head>', `${head}\n  </head>`);
}

const pages = [];
const pair = (lang, path, otherPath) => [
  { lang, path },
  { lang: other(lang), path: otherPath },
];

for (const lang of LANGS) {
  const t = site[lang];
  const home = `${prefix(lang)}/`;
  const lab = `${prefix(lang)}/lab/`;
  const contact = `${prefix(lang)}/contact/`;

  pages.push({ title: t.title, description: t.description, lang, path: home, alternates: pair(lang, home, `${prefix(other(lang))}/`) });
  pages.push({ title: `${t.lab} — ${site.name}`, description: t.description, lang, path: lab, alternates: pair(lang, lab, `${prefix(other(lang))}/lab/`) });
  for (const id of widgetIds()) {
    const path = `${lab}${id}/`;
    pages.push({ title: `${t.lab} — ${site.name}`, description: t.description, lang, path, alternates: pair(lang, path, `${prefix(other(lang))}/lab/${id}/`) });
  }
  pages.push({ title: `${t.contact} — ${site.name}`, description: t.description, lang, path: contact, alternates: pair(lang, contact, `${prefix(other(lang))}/contact/`) });
}

const posts = loadPosts();
const translationOf = (post) =>
  post.translationKey
    ? posts.find((p) => p.lang === other(post.lang) && p.translationKey === post.translationKey)
    : undefined;

for (const post of posts) {
  const translation = translationOf(post);
  pages.push({
    title: `${post.title} — ${site.name}`,
    description: post.description,
    lang: post.lang,
    path: post.path,
    lastmod: post.lastmod,
    alternates: translation ? pair(post.lang, post.path, translation.path) : [{ lang: post.lang, path: post.path }],
    article: { date: post.date, lastmod: post.lastmod, tags: post.tags },
  });
}

for (const page of pages) {
  writeFile(`${page.path}index.html`, render(page));
}

// Fallback shell for any other address (served by GitHub Pages with a 404 status).
writeFile(
  '404.html',
  render({ title: `${site.en.notFound} — ${site.name}`, description: site.en.description, lang: 'en', path: '/', alternates: [] })
);

// --- Discovery files ---------------------------------------------------------

const newestPostDate = posts[0]?.lastmod ?? new Date().toISOString().slice(0, 10);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...pages.map((page) =>
    [
      '  <url>',
      `    <loc>${absolute(page.path)}</loc>`,
      `    <lastmod>${page.lastmod ?? newestPostDate}</lastmod>`,
      ...page.alternates
        .filter((a) => a.path !== page.path)
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${absolute(a.path)}" />`),
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');
writeFile('sitemap.xml', sitemap);

writeFile('robots.txt', ['User-agent: *', 'Allow: /', '', `Sitemap: ${absolute('/sitemap.xml')}`, ''].join('\n'));

function rss(lang) {
  const t = site[lang];
  const items = posts.filter((p) => p.lang === lang);
  const rfc822 = (date) => new Date(`${date}T08:00:00Z`).toUTCString();
  const latest = items[0] ? rfc822(items[0].date) : new Date().toUTCString();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(t.title)}</title>`,
    `    <link>${absolute(`${prefix(lang)}/`)}</link>`,
    `    <description>${escapeXml(t.description)}</description>`,
    `    <language>${lang === 'fr' ? 'fr-fr' : 'en-us'}</language>`,
    `    <lastBuildDate>${latest}</lastBuildDate>`,
    `    <atom:link href="${absolute(feedPath(lang))}" rel="self" type="application/rss+xml" />`,
    ...items.map((post) =>
      [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${absolute(post.path)}</link>`,
        `      <guid isPermaLink="true">${absolute(post.path)}</guid>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n')
    ),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

for (const lang of LANGS) {
  writeFile(feedPath(lang), rss(lang));
}

console.log(
  `[postbuild] pre-rendered ${pages.length} pages (${posts.length} posts) + 404.html; wrote sitemap.xml, robots.txt, ${LANGS.map(feedPath).join(', ')}`
);
