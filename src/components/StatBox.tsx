import React, { useEffect, useState } from 'react';

interface StatBoxProps {
  value: string;
  prefix?: string;
  suffix?: string;
  sep?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  value,
  prefix = '',
  suffix = '',
  sep = '',
}) => {
  const targetNum = parseFloat(value.replace(/,/g, '')) || 0;
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const val = Math.round(start + (targetNum - start) * eased);
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [targetNum]);

  const formattedNum = sep
    ? current.toLocaleString()
    : current.toString();

  return (
    <span className="inline-flex items-center font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
      {prefix}
      {formattedNum}
      {suffix}
    </span>
  );
};
