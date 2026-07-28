import React, { useState } from 'react';
import { Cpu, Sparkles, Layers, Activity, HelpCircle, Binary, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { WidgetEmbed } from './WidgetEmbed';

interface InteractiveShowcaseProps {
  lang: Language;
}

interface WidgetDef {
  id: string;
  category: 'architectures' | 'security';
  title: string;
  paper: string;
  src: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  frenchOnly?: boolean;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({ lang }) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('transformer');

  const widgets: WidgetDef[] = [
    {
      id: 'transformer',
      category: 'architectures',
      title: lang === 'en' ? 'The Transformer (Self-Attention)' : 'Le Transformer (Auto-Attention)',
      paper: 'Vaswani et al., 2017 — "Attention Is All You Need"',
      src: lang === 'en' ? '/widgets/transformer-en.html' : '/widgets/transformer-fr.html',
      description:
        lang === 'en'
          ? 'Step through Query, Key, Value projections, attention weights, residual connections, and token prediction. Every word looks directly at every other word in parallel.'
          : 'Suivez étape par étape les projections Requête/Clé/Valeur, les poids d\'attention, les connexions résiduelles et la prédiction. Chaque mot interagit directement avec tous les autres.',
      badge: 'Modern LLM Standard',
      icon: Sparkles,
    },
    {
      id: 'lstm',
      category: 'architectures',
      title: lang === 'en' ? 'The LSTM (Gated Recurrent Network)' : 'Le LSTM (Réseau Récurrent à Portes)',
      paper: 'Hochreiter & Schmidhuber, 1997',
      src: lang === 'en' ? '/widgets/lstm-en.html' : '/widgets/lstm-fr.html',
      description:
        lang === 'en'
          ? 'Step through Forget, Input, and Output gates regulating the memory conveyor belt cell state C across time steps.'
          : 'Explorez les portes d\'oubli, d\'entrée et de sortie régulant le tapis roulant de mémoire (état de cellule C) au fil des mots.',
      badge: 'Sequential Recurrence',
      icon: Activity,
    },
    {
      id: 'cnn',
      category: 'architectures',
      title: lang === 'en' ? 'The 1D CNN (Sliding Convolutions)' : 'Le CNN 1D (Fenêtre Convolutive Glissante)',
      paper: 'Kim, 2014 / WaveNet, 2016',
      src: lang === 'en' ? '/widgets/cnn-en.html' : '/widgets/cnn-fr.html',
      description:
        lang === 'en'
          ? 'Slide a kernel filter across neighboring tokens to extract local receptive field features in full parallel.'
          : 'Faites glisser un filtre convolutif sur les jetons voisins pour extraire des motifs locaux en parallèle.',
      badge: 'Parallel Local Filter',
      icon: Layers,
    },
    {
      id: 'tokens',
      category: 'security',
      title:
        lang === 'en'
          ? 'Tokens & Tokenization: the Hidden Attack Surface'
          : 'Les Tokens : la matière première invisible des LLM',
      paper: 'Sennrich et al. (BPE) · Kudo (Unigram) · "Fishing for Magikarp" · TokenBreak (2025)',
      src: '/widgets/tokens-fr.html',
      description:
        lang === 'en'
          ? '24-screen interactive deck (in French): BPE, WordPiece and Unigram tokenizers trained live in your browser, plus five families of tokenizer-level attacks — glitch tokens, homoglyphs, TokenBreak, token smuggling, token bombs — and nine hardening measures.'
          : 'Présentation interactive en 24 écrans : tokeniseurs BPE, WordPiece et Unigram entraînés en direct dans votre navigateur, puis cinq familles d\'attaques au niveau du tokeniseur — glitch tokens, homoglyphes, TokenBreak, contrebande et bombes de tokens — et neuf mesures de durcissement.',
      badge: 'Security Deep Dive',
      icon: Binary,
      frenchOnly: true,
    },
  ];

  const categories: { key: WidgetDef['category']; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      key: 'architectures',
      label: lang === 'en' ? 'Model Architectures' : 'Architectures des modèles',
      icon: Cpu,
    },
    {
      key: 'security',
      label: lang === 'en' ? 'Tokens & Security' : 'Tokens & Sécurité',
      icon: ShieldAlert,
    },
  ];

  const current = widgets.find((w) => w.id === selectedWidget) || widgets[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Cpu className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Interactive Visual Lab' : 'Laboratoire Visuel Interactif'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            {lang === 'en'
              ? 'Understanding LLMs & AI Agents — and How to Secure Them'
              : 'Comprendre les LLM et agents IA — et comment les sécuriser'}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {lang === 'en'
              ? 'A growing collection of hands-on tools: step-by-step architecture diagrams (LSTM, CNN, Transformer) and live security explorations of the layers attackers actually target.'
              : 'Une collection d\'outils pratiques : schémas d\'architectures pas à pas (LSTM, CNN, Transformer) et explorations en direct des couches que les attaquants ciblent réellement.'}
          </p>
        </div>
      </div>

      {/* Widget selector, grouped by category */}
      {categories.map((cat) => {
        const CatIcon = cat.icon;
        const catWidgets = widgets.filter((w) => w.category === cat.key);
        return (
          <div key={cat.key} className="mb-8">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#6b6b66] dark:text-[#a3a39d] mb-3">
              <CatIcon className="w-4 h-4" />
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {catWidgets.map((w) => {
                const Icon = w.icon;
                const isSelected = w.id === selectedWidget;

                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWidget(w.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-sm'
                        : 'bg-white dark:bg-[#1a1a18] border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`p-2 rounded-xl ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#f5f5f3] dark:bg-[#2a2a27] text-[#6b6b66] dark:text-[#a3a39d]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[#6b6b66] dark:text-[#a3a39d]">
                        {w.badge}
                      </span>
                    </div>
                    <h3
                      className={`font-bold text-sm mb-1 ${
                        isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-[#1a1a18] dark:text-[#ededeb]'
                      }`}
                    >
                      {w.title}
                    </h3>
                    <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d] line-clamp-2">
                      {w.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Embedded Active Widget */}
      <div className="bg-white dark:bg-[#1a1a18] rounded-2xl p-6 border border-black/10 dark:border-white/10 shadow-sm">
        <div className="mb-4 pb-4 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a18] dark:text-[#ededeb]">
              {current.title}
            </h2>
            <p className="text-xs font-mono text-[#6b6b66] dark:text-[#a3a39d]">{current.paper}</p>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {current.frenchOnly && lang === 'en'
              ? 'Currently available in French'
              : lang === 'en'
                ? 'Click steps or tokens to step through'
                : 'Cliquez sur les étapes ou mots'}
          </span>
        </div>

        <WidgetEmbed key={`${current.id}-${lang}`} src={current.src} title={current.title} />

        <div className="mt-4 p-4 rounded-xl bg-[#f5f5f3] dark:bg-[#242422] text-xs text-[#6b6b66] dark:text-[#a3a39d] flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
};
