import type { CSSProperties } from 'react';
import { Language, Post } from '../types';

/**
 * Editorial axis of the site. Each post declares one `theme` in its front
 * matter; the home page groups articles by it. Colors are the AlephBeth
 * "Bouclier" palette (fume / flamme / braise / nuit); `darkColor` lightens the
 * darkest hue so it stays legible on the dark background.
 */
export interface Theme {
  key: string;
  label: Record<Language, string>;
  color: string;
  darkColor?: string;
}

export const THEMES: Theme[] = [
  { key: 'fundamentals', label: { en: 'Fundamentals', fr: 'Fondamentaux' }, color: '#5b7384', darkColor: '#8aa3b5' },
  { key: 'agents', label: { en: 'Agents', fr: 'Agents' }, color: '#f2a05a' },
  { key: 'poisoning', label: { en: 'Poisoning & Supply Chain', fr: 'Empoisonnement' }, color: '#d6453a', darkColor: '#e8675d' },
  { key: 'hardening', label: { en: 'Hardening', fr: 'Durcissement' }, color: '#15264d', darkColor: '#5b7fc7' },
];

export const OTHER_THEME: Theme = {
  key: 'other',
  label: { en: 'Other', fr: 'Autres' },
  color: '#5b7384',
  darkColor: '#8aa3b5',
};

export function themeFor(key?: string): Theme {
  return THEMES.find((t) => t.key === key) ?? OTHER_THEME;
}

/** CSS custom properties consumed by the theme-aware Tailwind classes. */
export function themeStyle(theme: Theme): CSSProperties {
  return {
    ['--theme' as string]: theme.color,
    ['--theme-dark' as string]: theme.darkColor ?? theme.color,
  } as CSSProperties;
}

/** Posts grouped in editorial order; empty groups are dropped. */
export function groupPostsByTheme(posts: Post[]): { theme: Theme; posts: Post[] }[] {
  return [...THEMES, OTHER_THEME]
    .map((theme) => ({ theme, posts: posts.filter((p) => themeFor(p.theme).key === theme.key) }))
    .filter((group) => group.posts.length > 0);
}
