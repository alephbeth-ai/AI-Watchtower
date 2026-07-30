import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Sparkles, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { WidgetEmbed } from './WidgetEmbed';
import { DEFAULT_WIDGET_ID, getWidgetCategories, getWidgets } from '../data/widgets';

interface InteractiveShowcaseProps {
  lang: Language;
  /** Widget to open on mount — set when arriving from the homepage hero. */
  initialWidgetId?: string;
  /** True when the reader picked a specific tool, so scroll it into view. */
  focusWidget?: boolean;
  /** Reports the active widget back so the selection survives a tab round-trip. */
  onWidgetChange?: (widgetId: string) => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  lang,
  initialWidgetId,
  focusWidget = false,
  onWidgetChange,
}) => {
  const [selectedWidget, setSelectedWidget] = useState<string>(
    initialWidgetId || DEFAULT_WIDGET_ID
  );
  const embedRef = useRef<HTMLDivElement>(null);

  const widgets = getWidgets(lang);
  const categories = getWidgetCategories(lang);

  // Deep link from the homepage hero: select the requested tool and scroll to it.
  // Entering the tab from the nav bar leaves the reader at the top of the lab.
  useEffect(() => {
    if (!initialWidgetId) return;
    setSelectedWidget(initialWidgetId);
    if (focusWidget) {
      embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [initialWidgetId, focusWidget]);

  const selectWidget = (widgetId: string) => {
    setSelectedWidget(widgetId);
    onWidgetChange?.(widgetId);
  };

  const current = widgets.find((w) => w.id === selectedWidget) || widgets[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#080d1a] via-[#0f172a] to-[#111827] text-white shadow-xl mb-8 relative overflow-hidden border border-cyan-500/20">
        <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none w-80 h-80 rounded-full overflow-hidden">
          <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
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
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide font-mono text-slate-500 dark:text-slate-400 mb-3">
              <CatIcon className="w-4 h-4 text-cyan-500" />
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {catWidgets.map((w) => {
                const Icon = w.icon;
                const isSelected = w.id === selectedWidget;

                return (
                  <button
                    key={w.id}
                    onClick={() => selectWidget(w.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 dark:border-cyan-500 shadow-cyber-cyan'
                        : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-cyan-950 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`p-2 rounded-xl ${
                          isSelected
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {w.badge}
                      </span>
                    </div>
                    <h3
                      className={`font-bold text-sm mb-1 ${
                        isSelected ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {w.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
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
      <div
        ref={embedRef}
        className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-slate-200 dark:border-cyan-950 shadow-sm scroll-mt-20"
      >
        <div className="mb-4 pb-4 border-b border-slate-200 dark:border-cyan-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {current.title}
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{current.paper}</p>
          </div>
          <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold font-mono">
            {current.hint ||
              (lang === 'en'
                ? 'Click steps or tokens to step through'
                : 'Cliquez sur les étapes ou mots')}
          </span>
        </div>

        <WidgetEmbed
          key={`${current.id}-${lang}`}
          src={current.src}
          title={current.title}
          variant={current.variant}
        />

        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#162032] text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3 border border-slate-200/60 dark:border-cyan-950">
          <HelpCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
};
