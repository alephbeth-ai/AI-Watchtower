// Post-build step for GitHub Pages: pre-render one index.html per route.
//
// GitHub Pages serves static files only. Without this step every deep link
// (/posts/<slug>/, /fr/, /lab/…) would be a 404 and only the home page would
// carry a <title> and <meta name="description">. The script copies the built
// shell into dist/<route>/index.html with the head rewritten for that page, so
// each address answers 200 with its own metadata even before JavaScript runs.
// Unknown paths fall back to dist/404.html, the same shell, where the app
// renders its not-found view.
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
      posts.push({
        lang,
        slug: file.replace(/\.md$/, ''),
        title: meta.title || file,
        description: meta.summary || meta.description || site[lang].description,
        translationKey: meta.translationKey,
      });
    }
  }
  return posts;
}

function widgetIds() {
  const source = readFileSync(join(root, 'src', 'data', 'widgets.ts'), 'utf8');
  return [...new Set([...source.matchAll(/^\s*id:\s*'([^']+)'/gm)].map((m) => m[1]))];
}

// --- Rendering ---------------------------------------------------------------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render({ title, description, lang, path, alternates }) {
  const head = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${site.url}${path}" />`,
    ...alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${site.url}${a.path}" />`),
  ]
    .map((line) => `    ${line}`)
    .join('\n');

  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace('</head>', `${head}\n  </head>`);
}

function write(path, html) {
  const dir = join(dist, ...path.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// --- Routes ------------------------------------------------------------------

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
for (const post of posts) {
  const path = `${prefix(post.lang)}/posts/${encodeURIComponent(post.slug)}/`;
  const translation = post.translationKey
    ? posts.find((p) => p.lang === other(post.lang) && p.translationKey === post.translationKey)
    : undefined;
  pages.push({
    title: `${post.title} — ${site.name}`,
    description: post.description,
    lang: post.lang,
    path,
    alternates: translation
      ? pair(post.lang, path, `${prefix(translation.lang)}/posts/${encodeURIComponent(translation.slug)}/`)
      : [{ lang: post.lang, path }],
  });
}

for (const page of pages) {
  write(page.path, render(page));
}

// Fallback shell for any other address (served by GitHub Pages with a 404 status).
writeFileSync(
  join(dist, '404.html'),
  render({ title: `${site.en.notFound} — ${site.name}`, description: site.en.description, lang: 'en', path: '/', alternates: [] })
);

console.log(`[postbuild] pre-rendered ${pages.length} pages (${posts.length} posts) + 404.html`);
