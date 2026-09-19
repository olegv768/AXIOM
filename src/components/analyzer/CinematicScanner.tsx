import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface CinematicScannerProps {
  onComplete: () => void;
}

const SCAN_STEPS = [
  {
    id: 1,
    title: 'Семантический разбор ценностного предложения',
    subtitle: 'Анализ формулировки гипотезы, целевой роли и истинной боли клиента',
    duration: 700,
  },
  {
    id: 2,
    title: 'Сверка по базам ProductHunt, Crunchbase и открытым реестрам',
    subtitle: 'Поиск прямых аналогов в батчах акселераторов и венчурных раундах',
    duration: 800,
  },
  {
    id: 3,
    title: 'Стресс-тест юнит-экономики и барьеров перехода',
    subtitle: 'Моделирование CAC/LTV, уязвимости перед платформами и Switching Cost',
    duration: 750,
  },
  {
    id: 4,
    title: 'Синтез Blue Ocean векторов и расчет индекса уникальности',
    subtitle: 'Выявление скрытых точек отказа и стратегий переупаковки',
    duration: 650,
  },
];

export const CinematicScanner: React.FC<CinematicScannerProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = SCAN_STEPS.reduce((acc, s) => acc + s.duration, 0);
    const intervalTime = 25;
    const progressIncrement = 100 / (totalDuration / intervalTime);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const timeouts: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    SCAN_STEPS.forEach((step, index) => {
      accumulatedTime += step.duration;
      const t = setTimeout(() => {
        setCurrentStepIndex(index + 1);
        if (index === SCAN_STEPS.length - 1) {
          setTimeout(onComplete, 350);
        }
      }, accumulatedTime);
      timeouts.push(t);
    });

    return () => {
      clearInterval(progressTimer);
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-14 px-4 sm:px-6 flex flex-col items-center">
      {/* Precision Diagnostic Dial */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-10 flex items-center justify-center">
        {/* Hairline concentric rings */}
        <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
        <div className="absolute inset-4 rounded-full border border-white/[0.05]" />
        <div className="absolute inset-10 rounded-full border border-white/[0.04]" />
        <div className="absolute inset-16 rounded-full border border-white/[0.06]" />

        {/* Crosshair lines */}
        <div className="absolute w-full h-[1px] bg-white/[0.06]" />
        <div className="absolute h-full w-[1px] bg-white/[0.06]" />

        {/* Technical sweep */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="w-full h-full radar-sweep-technical animate-radar-sweep origin-center rounded-full" />
        </div>

        {/* Center Readout */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-[#090b10] border border-white/[0.14] flex flex-col items-center justify-center shadow-hardware">
          <span className="text-xl font-semibold font-mono text-white">
            {Math.min(100, Math.round(progress))}%
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">
            AUDIT
          </span>
        </div>
      </div>

      {/* Structured Technical Logs */}
      <div className="w-full space-y-2 font-mono">
        {SCAN_STEPS.map((step, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-colors flex items-center justify-between text-xs ${
                isCurrent
                  ? 'bg-[#12151e] border-white/20 text-white'
                  : isDone
                  ? 'bg-[#0d0f15] border-white/[0.06] text-neutral-400'
                  : 'bg-transparent border-transparent text-neutral-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-500">
                  0{step.id}
                </span>
                <div>
                  <div className="font-sans font-medium text-neutral-200">
                    {step.title}
                  </div>
                  <div className="font-sans text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {step.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 ml-4 font-mono text-[11px]">
                {isDone ? (
                  <span className="text-emerald-400">DONE</span>
                ) : isCurrent ? (
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-neutral-400" />
                    RUNNING
                  </span>
                ) : (
                  <span className="text-neutral-600">PENDING</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
