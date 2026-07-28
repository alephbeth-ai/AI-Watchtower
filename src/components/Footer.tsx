import React from 'react';
import { Shield, Github, Rss, Heart } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="mt-20 border-t border-black/10 dark:border-white/10 bg-[#f5f5f3] dark:bg-[#181816] transition-colors py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base text-[#1a1a18] dark:text-[#ededeb]">
                AlephBeth Watchtower
              </span>
              <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d]">
                {lang === 'en'
                  ? 'AI Security Research & Hardening Guidance'
                  : 'Recherche & Durcissement Sécurité IA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-[#6b6b66] dark:text-[#a3a39d]">
            <a
              href="https://github.com/alephbeth-ai/AI-Watchtower"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub Repository
            </a>
            <span className="opacity-30">•</span>
            <a
              href="mailto:contact@alephbeth.ai"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              contact@alephbeth.ai
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b6b66] dark:text-[#a3a39d]">
          <p>© {new Date().getFullYear()} AlephBeth. CC BY 4.0 Open Content & Research.</p>
          <p className="flex items-center gap-1">
            {lang === 'en'
              ? 'Built with React, Vite & Tailwind CSS'
              : 'Construit avec React, Vite & Tailwind CSS'}
          </p>
        </div>
      </div>
    </footer>
  );
};
