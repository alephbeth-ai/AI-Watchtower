import React, { useState, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { marked } from 'marked';

interface ChecklistProps {
  checklistKey: string;
  resetLabel?: string;
  itemsText: string;
}

export const Checklist: React.FC<ChecklistProps> = ({
  checklistKey,
  resetLabel = 'Reset',
  itemsText,
}) => {
  // Parse bullet items from text (- item or * item)
  const items = itemsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') || line.startsWith('* '))
    .map((line) => line.slice(2).trim());

  const storageKey = `ab_chk_${checklistKey}`;

  const [checkedState, setCheckedState] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === items.length) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return new Array(items.length).fill(false);
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedState));
    } catch (e) {
      // ignore
    }
  }, [checkedState, storageKey]);

  const toggleItem = (index: number) => {
    setCheckedState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleReset = () => {
    setCheckedState(new Array(items.length).fill(false));
  };

  const checkedCount = checkedState.filter(Boolean).length;
  const progressPercent = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <div className="my-8 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[#1f1f1d] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between text-xs text-[#6b6b66] dark:text-[#a3a39d] font-mono mb-1.5">
            <span>Progress</span>
            <span>
              {checkedCount} / {items.length} ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full bg-[#f5f5f3] dark:bg-[#2a2a27] rounded-full overflow-hidden border border-black/5 dark:border-white/5">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6b6b66] dark:text-[#a3a39d] hover:text-[#1a1a18] dark:hover:text-white bg-[#f5f5f3] dark:bg-[#2a2a27] hover:bg-[#e8e8e5] dark:hover:bg-[#333330] rounded-md transition-colors border border-black/10 dark:border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {resetLabel}
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isChecked = checkedState[idx];
          const htmlContent = marked.parseInline(item);

          return (
            <label
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                isChecked
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30 text-[#1a1a18] dark:text-[#ededeb]'
                  : 'bg-transparent border-black/5 dark:border-white/5 hover:bg-[#f5f5f3] dark:hover:bg-[#2a2a27] text-[#1a1a18] dark:text-[#ededeb]'
              }`}
            >
              <div
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isChecked
                    ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white'
                    : 'border-black/30 dark:border-white/30 bg-white dark:bg-[#2a2a27]'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(idx);
                }}
              >
                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(idx)}
                className="sr-only"
              />
              <span
                className={`text-sm leading-relaxed ${isChecked ? 'line-through opacity-75' : ''}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};
