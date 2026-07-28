import React from 'react';
import { Mail, Shield, CheckCircle2, MessageSquare, Lock, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface ContactViewProps {
  lang: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#1a1a18] rounded-3xl p-8 sm:p-12 border border-black/10 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Mail className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {lang === 'en' ? 'Get In Touch' : 'Contactez-nous'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a18] dark:text-[#ededeb]">
              {lang === 'en' ? 'AlephBeth AI Watchtower' : 'Watchtower AlephBeth'}
            </h1>
          </div>
        </div>

        <p className="text-base text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed mb-8">
          {lang === 'en' ? (
            <>
              We turn ongoing AI-security research — <strong>direct and indirect prompt injection, MCP server vulnerabilities, agent threat models, data-poisoning and supply-chain risks</strong> — into guidance that builders and operators of LLM-based systems can apply the same day.
            </>
          ) : (
            <>
              Nous transformons la recherche en sécurité IA — <strong>injections de prompts directes et indirectes, vulnérabilités des serveurs MCP, modèles de menaces pour agents, empoisonnement de données</strong> — en recommandations directement applicables par les concepteurs et opérateurs de systèmes LLM.
            </>
          )}
        </p>

        {/* Email Card */}
        <div className="p-6 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-500 border-y border-r border-blue-200/60 dark:border-blue-900/60 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
            {lang === 'en' ? 'Direct Email' : 'Email Direct'}
          </span>
          <a
            href="mailto:contact@alephbeth.ai"
            className="text-xl sm:text-2xl font-mono font-bold text-blue-700 dark:text-blue-300 hover:underline break-all"
          >
            contact@alephbeth.ai
          </a>
        </div>

        {/* Topics List */}
        <h2 className="text-lg font-bold text-[#1a1a18] dark:text-[#ededeb] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          {lang === 'en' ? 'Reach out about:' : 'Sujets d\'échange :'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#f5f5f3] dark:bg-[#242422] border border-black/5 dark:border-white/5 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs text-[#1a1a18] dark:text-[#ededeb] mb-1">
                {lang === 'en' ? 'Hardening Reviews' : 'Audits de Durcissement'}
              </h3>
              <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed">
                {lang === 'en'
                  ? 'Agentic pipelines, MCP integrations, and LLM assistants.'
                  : 'Pipelines agentiques, intégrations MCP et assistants LLM.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f3] dark:bg-[#242422] border border-black/5 dark:border-white/5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs text-[#1a1a18] dark:text-[#ededeb] mb-1">
                {lang === 'en' ? 'Research Collaboration' : 'Collaboration Recherche'}
              </h3>
              <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed">
                {lang === 'en'
                  ? 'AI security research & responsible vulnerability disclosure.'
                  : 'Recherche en sécurité IA et divulgation responsable de failles.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f3] dark:bg-[#242422] border border-black/5 dark:border-white/5 flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs text-[#1a1a18] dark:text-[#ededeb] mb-1">
                {lang === 'en' ? 'Talks & Workshops' : 'Conférences & Ateliers'}
              </h3>
              <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed">
                {lang === 'en'
                  ? 'Technical workshops and threat-modeling sessions.'
                  : 'Ateliers techniques et sessions de modélisation des menaces.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f3] dark:bg-[#242422] border border-black/5 dark:border-white/5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs text-[#1a1a18] dark:text-[#ededeb] mb-1">
                {lang === 'en' ? 'Feedback & Coverage' : 'Retours & Suggestions'}
              </h3>
              <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed">
                {lang === 'en'
                  ? 'Corrections, feedback, or topics you want the Watchtower to cover.'
                  : 'Remarques, suggestions et sujets à traiter par le Watchtower.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
