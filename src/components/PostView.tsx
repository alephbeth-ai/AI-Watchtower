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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080d1a] transition-colors pb-16">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-cyan-500 transition-all duration-150 shadow-cyber-cyan"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Top bar controls */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0f172a] hover:bg-slate-100 dark:hover:bg-[#162032] border border-slate-200 dark:border-cyan-950 rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500" />
            {lang === 'en' ? 'Back to articles' : 'Retour aux articles'}
          </button>

          <div className="flex items-center gap-2">
            {translatedPost ? (
              <button
                onClick={() => {
                  onLanguageChange(counterpartLang);
                  onSelectPost(translatedPost);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200 dark:border-cyan-800 rounded-xl transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Read in French' : 'Lire en anglais'}</span>
              </button>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 rounded-xl"
                title={lang === 'en' ? 'No French version yet' : 'Pas encore de version anglaise'}
              >
                <Globe className="w-3.5 h-3.5 opacity-60" />
                <span>{lang === 'en' ? 'English only' : 'Français uniquement'}</span>
              </span>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'en' ? 'Copied' : 'Copié') : lang === 'en' ? 'Share' : 'Partager'}</span>
            </button>
          </div>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 rounded-full border border-cyan-300 dark:border-cyan-800">
              {post.categories[0] || 'Security'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} {lang === 'en' ? 'min read' : 'min de lecture'}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-cyan-500 pl-4 py-1 italic bg-cyan-50/50 dark:bg-cyan-950/20 rounded-r-lg">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200/60 dark:border-cyan-950">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md bg-slate-100 dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-cyan-950"
                >
                  <Tag className="w-3 h-3 text-cyan-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Table of Contents Header if headings exist */}
        {headings.length > 0 && (
          <details className="mb-8 p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 shadow-sm">
            <summary className="font-semibold text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer flex items-center gap-2 select-none">
              <List className="w-4 h-4 text-cyan-500" />
              <span>{lang === 'en' ? 'Table of Contents' : 'Sommaire'}</span>
            </summary>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {headings.map((h, i) => (
                <li
                  key={i}
                  style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                >
                  • {h.text}
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Article Body */}
        <main className="bg-white dark:bg-[#0f172a] p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-cyan-950 shadow-sm mb-12">
          <PostContent content={post.content} />
        </main>

        {/* Author & Footer Note */}
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-cyber-cyan flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="AlephBeth Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">Aleph Beth (אב · أب)</p>
              <p>{lang === 'en' ? 'Independent AI Security Research & Analysis' : 'Recherche & Analyse Indépendante en Sécurité IA'}</p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            {lang === 'en' ? 'Back to top ↑' : 'Haut de page ↑'}
          </button>
        </div>
      </div>
    </div>
  );
};
