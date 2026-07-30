import React from 'react';
import { Github } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="mt-20 border-t border-cyan-500/15 dark:border-cyan-500/20 bg-slate-100/80 dark:bg-[#060a14] transition-colors py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-cyan-950/60">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-cyber-cyan flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="AlephBeth Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Aleph Beth <span className="text-xs text-cyan-600 dark:text-cyan-400 font-normal ml-1">אב · أب</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'en'
                  ? 'AI Security Research & Hardening Guidance'
                  : 'Recherche & Durcissement Sécurité IA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a
              href="https://github.com/alephbeth-ai/AI-Watchtower"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub Repository
            </a>
            <span className="opacity-30">•</span>
            <a
              href="mailto:contact@alephbeth.ai"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              contact@alephbeth.ai
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} AlephBeth. CC BY 4.0 Open Content & Research.</p>

          <p className="flex items-center gap-1 font-mono">
            {lang === 'en'
              ? 'Defensive AI & Security Research'
              : 'Recherche en Sécurité IA Défensive'}

          </p>
        </div>
      </div>
    </footer>
  );
};
