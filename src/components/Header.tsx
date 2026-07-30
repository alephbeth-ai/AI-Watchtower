import React from 'react';
import { Sun, Moon, Search, Cpu, BookOpen, Mail, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#080d1a]/85 border-b border-cyan-500/15 dark:border-cyan-500/20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div
          onClick={() => onTabChange('articles')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo badge with cyan glow ring */}
          <div className="relative w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-cyber-cyan group-hover:scale-105 transition-transform flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="AI Watchtower Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Aleph Beth
              </span>
              <span className="text-xs font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/90 text-cyan-800 dark:text-cyan-300 border border-cyan-300/80 dark:border-cyan-700/80 font-sans dir-auto">
                אב · أب
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'en' ? 'Defensive AI & Security Engineering' : 'Sécurité & Ingénierie IA Défensive'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#0f172a] p-1 rounded-xl border border-slate-200 dark:border-cyan-900/40">
          <button
            onClick={() => onTabChange('articles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/60 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Articles' : 'Articles'}
          </button>

          <button
            onClick={() => onTabChange('interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'interactive'
                ? 'bg-white dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/60 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>{lang === 'en' ? 'Interactive Lab' : 'Labo Interactif'}</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          </button>

          <button
            onClick={() => onTabChange('contact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contact'
                ? 'bg-white dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700/60 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Contact' : 'Contact'}
          </button>
        </nav>

        {/* Search bar & Controls */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={lang === 'en' ? 'Search articles...' : 'Rechercher...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-900/40 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0f172a] p-0.5 rounded-lg border border-slate-200 dark:border-cyan-900/40">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-bold font-mono rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-white dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 text-xs font-bold font-mono rounded-md transition-all ${
                lang === 'fr'
                  ? 'bg-white dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              FR
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-900/40 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 bg-slate-50 dark:bg-[#0b1120] border-t border-slate-200 dark:border-cyan-950 text-xs">
        <button
          onClick={() => onTabChange('articles')}
          className={`flex items-center gap-1 font-medium ${
            activeTab === 'articles' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Articles
        </button>
        <button
          onClick={() => onTabChange('interactive')}
          className={`flex items-center gap-1 font-medium ${
            activeTab === 'interactive' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          {lang === 'en' ? 'Lab' : 'Labo'}
        </button>
        <button
          onClick={() => onTabChange('contact')}
          className={`flex items-center gap-1 font-medium ${
            activeTab === 'contact' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Contact
        </button>
      </div>
    </header>
  );
};
