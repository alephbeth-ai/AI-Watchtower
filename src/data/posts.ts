import { Post, Language } from '../types';

// Dynamically import all markdown post files as raw text using Vite's import.meta.glob
const rawPosts = import.meta.glob('/content/*/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content: raw };
  }

  const [, frontmatterStr, content] = match;
  const metadata: Record<string, any> = {};

  frontmatterStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let valueStr = line.slice(colonIndex + 1).trim();

    // Parse string quotes
    if (
      (valueStr.startsWith('"') && valueStr.endsWith('"')) ||
      (valueStr.startsWith("'") && valueStr.endsWith("'"))
    ) {
      valueStr = valueStr.slice(1, -1);
    }

    // Parse array []
    if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      const items = valueStr
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      metadata[key] = items;
    } else if (valueStr === 'true') {
      metadata[key] = true;
    } else if (valueStr === 'false') {
      metadata[key] = false;
    } else {
      metadata[key] = valueStr;
    }
  });

  return { metadata, content: content.trim() };
}

function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const postsList: Post[] = [];

for (const [path, raw] of Object.entries(rawPosts)) {
  if (path.includes('_index.md') || path.includes('contact.md') || path.includes('search.md')) {
    continue;
  }

  const isFr = path.includes('/fr/');
  const lang: Language = isFr ? 'fr' : 'en';

  const filename = path.split('/').pop() || '';
  const slug = filename.replace(/\.md$/, '');

  const { metadata, content } = parseFrontmatter(raw);

  if (metadata.draft === true) continue;

  postsList.push({
    id: `${lang}-${slug}`,
    slug,
    lang,
    title: metadata.title || slug,
    date: metadata.date || '2026-06-01',
    description: metadata.summary || metadata.description || '',
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    categories: Array.isArray(metadata.categories) ? metadata.categories : [metadata.theme || 'General'],
    content,
    readingTime: calculateReadingTime(content),
    featured: slug.includes('how-llms-work') || slug.includes('comprendre-llm') || slug.includes('claude-desktop'),
    translationKey: typeof metadata.translationKey === 'string' ? metadata.translationKey : undefined,
  });
}

// Sort posts by date descending
postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const allPosts = postsList;

export function getPostsByLang(lang: Language): Post[] {
  return allPosts.filter((p) => p.lang === lang);
}

export function getPostBySlug(slug: string, lang: Language): Post | undefined {
  return allPosts.find((p) => p.slug === slug && p.lang === lang) || allPosts.find((p) => p.slug === slug);
}

/**
 * Resolve the counterpart of a post in another language. FR and EN files have
 * different slugs, so the pairing goes through the shared `translationKey`
 * frontmatter field. Returns undefined when no translation exists.
 */
export function getTranslation(post: Post, lang: Language): Post | undefined {
  if (post.lang === lang) return post;
  if (!post.translationKey) return undefined;

  return allPosts.find((p) => p.lang === lang && p.translationKey === post.translationKey);
}

/** Posts that exist in only one language — every article is meant to ship FR + EN. */
export function getUntranslatedPosts(): Post[] {
  return allPosts.filter((post) => {
    const counterpart: Language = post.lang === 'en' ? 'fr' : 'en';
    return !getTranslation(post, counterpart);
  });
}

// Bilingual coverage guard: warn while developing if a post lost its pair.
if (import.meta.env.DEV) {
  const orphans = getUntranslatedPosts();
  if (orphans.length > 0) {
    console.warn(
      '[posts] Articles missing a translation (check `translationKey` in the frontmatter):',
      orphans.map((p) => `${p.lang}/${p.slug}`)
    );
  }
}
