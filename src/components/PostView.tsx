import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Check,
  Globe,
  BookOpen,
  List,
} from 'lucide-react';
import { Post, Language } from '../types';
import { PostContent } from './PostContent';
import { getTranslation } from '../data/posts';

interface PostViewProps {
  post: Post;
  lang: Language;
  onBack: () => void;
  onSelectPost: (post: Post) => void;
  onLanguageChange: (lang: Language) => void;
}

export const PostView: React.FC<PostViewProps> = ({
  post,
  lang,
  onBack,
  onSelectPost,
  onLanguageChange,
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract headings for Table of Contents
  useEffect(() => {
    const headingMatches = Array.from(
      post.content.matchAll(/^(#{2,3})\s+(.+)$/gm)
    );
    const extracted = headingMatches.map((match, idx) => {
      const level = match[1].length;
      const text = match[2].replace(/\*+/g, '').replace(/`+/g, '');
      const id = `heading-${idx}`;
      return { id, text, level };
    });
    setHeadings(extracted);
  }, [post.content]);

  // Find the counterpart of this article in the other language (paired by translationKey)
  const counterpartLang: Language = lang === 'en' ? 'fr' : 'en';
  const translatedPost = getTranslation(post, counterpartLang);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#121211] transition-colors pb-16">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 z-50">
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Top bar controls */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#1a1a18] dark:text-[#ededeb] bg-white dark:bg-[#1f1f1d] hover:bg-[#f5f5f3] dark:hover:bg-[#2a2a27] border border-black/10 dark:border-white/10 rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'en' ? 'Back to articles' : 'Retour aux articles'}
          </button>

          <div className="flex items-center gap-2">
            {translatedPost ? (
              <button
                onClick={() => {
                  onLanguageChange(counterpartLang);
                  onSelectPost(translatedPost);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Read in French' : 'Lire en anglais'}</span>
              </button>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6b6b66] dark:text-[#a3a39d] bg-[#f5f5f3] dark:bg-[#1f1f1d] border border-black/10 dark:border-white/10 rounded-xl"
                title={lang === 'en' ? 'No French version yet' : 'Pas encore de version anglaise'}
              >
                <Globe className="w-3.5 h-3.5 opacity-60" />
                <span>{lang === 'en' ? 'English only' : 'Français uniquement'}</span>
              </span>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6b6b66] dark:text-[#a3a39d] hover:text-[#1a1a18] dark:hover:text-white bg-white dark:bg-[#1f1f1d] border border-black/10 dark:border-white/10 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'en' ? 'Copied' : 'Copié') : lang === 'en' ? 'Share' : 'Partager'}</span>
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
              {post.categories[0] || 'Security'}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#6b6b66] dark:text-[#a3a39d]">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1 text-xs text-[#6b6b66] dark:text-[#a3a39d]">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} {lang === 'en' ? 'min read' : 'min de lecture'}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1a1a18] dark:text-[#ededeb] leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed border-l-2 border-blue-500 pl-4 py-1 italic bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md bg-[#f5f5f3] dark:bg-[#1f1f1d] text-[#6b6b66] dark:text-[#a3a39d]"
                >
                  <Tag className="w-3 h-3 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Table of Contents Header if headings exist */}
        {headings.length > 0 && (
          <details className="mb-8 p-4 rounded-xl bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 shadow-sm">
            <summary className="font-semibold text-xs uppercase tracking-wider text-[#6b6b66] dark:text-[#a3a39d] cursor-pointer flex items-center gap-2 select-none">
              <List className="w-4 h-4 text-blue-500" />
              <span>{lang === 'en' ? 'Table of Contents' : 'Sommaire'}</span>
            </summary>
            <ul className="mt-3 space-y-1.5 text-xs text-[#6b6b66] dark:text-[#a3a39d]">
              {headings.map((h, i) => (
                <li
                  key={i}
                  style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  • {h.text}
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Article Body */}
        <main className="bg-white dark:bg-[#1a1a18] p-6 sm:p-10 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm mb-12">
          <PostContent content={post.content} />
        </main>

        {/* Author & Footer Note */}
        <div className="p-6 rounded-2xl bg-[#f5f5f3] dark:bg-[#1f1f1d] border border-black/10 dark:border-white/10 text-xs text-[#6b6b66] dark:text-[#a3a39d] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              AB
            </div>
            <div>
              <p className="font-bold text-[#1a1a18] dark:text-[#ededeb]">AlephBeth / AI Watchtower</p>
              <p>{lang === 'en' ? 'Independent AI Security Research & Analysis' : 'Recherche & Analyse Indépendante en Sécurité IA'}</p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            {lang === 'en' ? 'Back to top ↑' : 'Haut de page ↑'}
          </button>
        </div>
      </div>
    </div>
  );
};
