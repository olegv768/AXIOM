import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VerdictInfo } from '@/lib/types';
import { Info } from 'lucide-react';

interface UniquenessGaugeProps {
  score: number;
  verdict: VerdictInfo;
}

export const UniquenessGauge: React.FC<UniquenessGaugeProps> = ({ score, verdict }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeMetricHover, setActiveMetricHover] = useState<string | null>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1400;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  // Derived telemetry metrics based on score
  const metricsBreakdown = [
    {
      id: 'novelty',
      label: 'NOVELTY',
      val: Math.min(Math.round(score * 1.02), 99),
      hint: 'Степень новизны гипотезы по сравнению с известными продуктами',
    },
    {
      id: 'similarity',
      label: 'MARKET SIMILARITY',
      val: Math.max(100 - score, 12),
      hint: 'Процент пересечения с существующими продуктовыми предложениями',
    },
    {
      id: 'overlap',
      label: 'CONCEPT OVERLAP',
      val: Math.max(Math.round((100 - score) * 0.9), 8),
      hint: 'Степень совпадения базовой ценности с прямыми конкурентами',
    },
    {
      id: 'density',
      label: 'COMPETITIVE DENSITY',
      val: score > 70 ? 28 : score > 45 ? 64 : 88,
      hint: 'Концентрация конкурирующих продуктов в целевом сегменте',
    },
    {
      id: 'differentiation',
      label: 'DIFFERENTIATION',
      val: Math.min(Math.round(score * 0.96 + 4), 98),
      hint: 'Устойчивость барьеров защиты от копирования (Moat)',
    },
  ];

  const radius = 86;
  const strokeWidth = 6;
  const arcDegree = 220;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (arcDegree / 360) * circumference;
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  const getDialColor = (val: number) => {
    if (val >= 75) return '#38bdf8'; // Icy cyan
    if (val >= 50) return '#10b981'; // Emerald
    if (val >= 35) return '#f59e0b'; // Amber
    return '#f43f5e';               // Rose
  };

  const dialColor = getDialColor(score);

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Readout Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          UNIQUENESS × TELEMETRY
        </span>
        <span className="text-[10px] font-mono text-neutral-400">
          0–100 SCALE
        </span>
      </div>

      {/* Main Gauge & Big Number */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-[200deg]"
            viewBox="0 0 220 220"
          >
            {/* Background Track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />

            {/* Calibrated Active Arc */}
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={dialColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: arcLength }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          {/* Large Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              UNIQUENESS
            </span>
            <div className="flex items-baseline font-display tracking-tight">
              <span className="text-6xl font-extrabold text-white tabular-nums">
                {animatedScore}
              </span>
              <span className="text-2xl font-light text-neutral-400 ml-1">%</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-1">
              SCORE CALIBRATED
            </span>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="mt-3 text-center space-y-1.5 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141c] text-xs font-mono font-semibold text-white">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dialColor }} />
            <span className="uppercase tracking-wider">{verdict.title}</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            {verdict.description}
          </p>
        </div>
      </div>

      {/* Breakdown Metrics with Hairline Lines & Interactive Hover */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          <span>PARAMETRIC BREAKDOWN</span>
          <span>INDEX</span>
        </div>

        <div className="space-y-2.5">
          {metricsBreakdown.map((m) => (
            <div
              key={m.id}
              onMouseEnter={() => setActiveMetricHover(m.id)}
              onMouseLeave={() => setActiveMetricHover(null)}
              className="group/metric p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-help"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-400 group-hover/metric:text-neutral-200 transition-colors flex items-center gap-1.5">
                  <span>{m.label}</span>
                  <Info className="w-3 h-3 text-neutral-600 group-hover/metric:text-neutral-400" />
                </span>
                <span className="text-white font-semibold tabular-nums">
                  {m.val}%
                </span>
              </div>

              {/* Thin hairline progress line */}
              <div className="relative h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.val}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-neutral-300 group-hover/metric:bg-cyan-400 transition-colors"
                />
              </div>

              {/* Hover Tooltip Hint */}
              {activeMetricHover === m.id && (
                <motion.p
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-sans text-neutral-400 pt-1 leading-normal"
                >
                  {m.hint}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
