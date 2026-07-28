export type Language = 'en' | 'fr';

export interface Post {
  id: string;
  slug: string;
  lang: Language;
  title: string;
  date: string;
  description: string;
  tags: string[];
  categories: string[];
  content: string;
  readingTime?: number;
  featured?: boolean;
}

export interface SiteMeta {
  title: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  desc?: string;
  level?: string;
}

export interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}
