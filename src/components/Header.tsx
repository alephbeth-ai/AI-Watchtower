import React from 'react';
import { Shield, Sun, Moon, Search, Cpu, BookOpen, Mail, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: 'articles' | 'interactive' | 'contact';
  onTabChange: (tab: 'articles' | 'interactive' | 'contact') => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  isDark,
  onThemeToggle,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fcfbf9]/90 dark:bg-[#121211]/90 border-b border-black/10 dark:border-white/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div
          onClick={() => onTabChange('articles')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#1a1a18] dark:text-[#ededeb]">
                AI Watchtower
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                AlephBeth
              </span>
            </div>
            <p className="hidden sm:block text-xs text-[#6b6b66] dark:text-[#a3a39d]">
              {lang === 'en' ? 'Defensive AI & Security Engineering' : 'Sécurité & Ingénierie IA Défensive'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f5f5f3] dark:bg-[#1f1f1d] p-1 rounded-xl border border-black/5 dark:border-white/5">
          <button
            onClick={() => onTabChange('articles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-[#2a2a27] text-[#1a1a18] dark:text-white shadow-sm'
                : 'text-[#6b6b66] dark:text-[#a3a39d] hover:text-[#1a1a18] dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Articles' : 'Articles'}
          </button>

          <button
            onClick={() => onTabChange('interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'interactive'
                ? 'bg-white dark:bg-[#2a2a27] text-[#1a1a18] dark:text-white shadow-sm'
                : 'text-[#6b6b66] dark:text-[#a3a39d] hover:text-[#1a1a18] dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'en' ? 'Interactive Models' : 'Schémas Interactifs'}</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
          </button>

          <button
            onClick={() => onTabChange('contact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'contact'
                ? 'bg-white dark:bg-[#2a2a27] text-[#1a1a18] dark:text-white shadow-sm'
                : 'text-[#6b6b66] dark:text-[#a3a39d] hover:text-[#1a1a18] dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Contact' : 'Contact'}
          </button>
        </nav>

        {/* Search bar & Controls */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b6b66] dark:text-[#a3a39d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={lang === 'en' ? 'Search articles...' : 'Rechercher...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f5f5f3] dark:bg-[#1f1f1d] border border-black/10 dark:border-white/10 rounded-lg text-[#1a1a18] dark:text-[#ededeb] placeholder-[#6b6b66] dark:placeholder-[#a3a39d] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-[#f5f5f3] dark:bg-[#1f1f1d] p-0.5 rounded-lg border border-black/10 dark:border-white/10">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-white dark:bg-[#2a2a27] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-[#6b6b66] dark:text-[#a3a39d]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'fr'
                  ? 'bg-white dark:bg-[#2a2a27] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-[#6b6b66] dark:text-[#a3a39d]'
              }`}
            >
              FR
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-[#6b6b66] dark:text-[#a3a39d] hover:text-[#1a1a18] dark:hover:text-white bg-[#f5f5f3] dark:bg-[#1f1f1d] border border-black/10 dark:border-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 bg-[#f5f5f3] dark:bg-[#1a1a18] border-t border-black/5 dark:border-white/5 text-xs">
        <button
          onClick={() => onTabChange('articles')}
          className={`flex items-center gap-1 font-medium ${
            activeTab === 'articles' ? 'text-blue-600 dark:text-blue-400' : 'text-[#6b6b66] dark:text-[#a3a39d]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Articles
        </button>
        <button
          onClick={() => onTabChange('interactive')}
          className={`flex items-center gap-1 font-medium ${
            activeTab === 'interactive' ? 'text-blue-600 dark:text-blue-400' : 'text-[#6b6b66] dark:text-[#a3a39d]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          {lang === 'en' ? 'Interactive' : 'Interactif'}
        </button>
        <button
          onClick={() => onTabChange('contact')}
          className={`flex items-center gap-1 font-medium ${
            activeTab === 'contact' ? 'text-blue-600 dark:text-blue-400' : 'text-[#6b6b66] dark:text-[#a3a39d]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Contact
        </button>
      </div>
    </header>
  );
};
