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
                    onClick={() => selectWidget(w.id)}
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
      <div
        ref={embedRef}
        className="bg-white dark:bg-[#1a1a18] rounded-2xl p-6 border border-black/10 dark:border-white/10 shadow-sm scroll-mt-20"
      >
        <div className="mb-4 pb-4 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a18] dark:text-[#ededeb]">
              {current.title}
            </h2>
            <p className="text-xs font-mono text-[#6b6b66] dark:text-[#a3a39d]">{current.paper}</p>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
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
