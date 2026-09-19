import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VerdictInfo } from '@/lib/types';
import { ArrowUpRight, Compass, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface UniquenessGaugeProps {
  score: number;
  verdict: VerdictInfo;
}

export const UniquenessGauge: React.FC<UniquenessGaugeProps> = ({ score, verdict }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

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

  // Telemetry dial geometry
  const radius = 86;
  const strokeWidth = 7;
  const arcDegree = 220; // total arc span
  const circumference = 2 * Math.PI * radius;
  const arcLength = (arcDegree / 360) * circumference;
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  // Calibrated ticks (24 ticks around the perimeter)
  const totalTicks = 24;
  const tickAngles = Array.from({ length: totalTicks }).map((_, i) => {
    const angleStart = 160; // deg
    const span = 220;
    return angleStart + (i / (totalTicks - 1)) * span;
  });

  const getDialColor = (val: number) => {
    if (val >= 75) return '#10b981'; // Precision emerald
    if (val >= 50) return '#38bdf8'; // Precision sky
    if (val >= 35) return '#f59e0b'; // Precision amber
    return '#f43f5e';               // Precision rose
  };

  const dialColor = getDialColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Precision Telemetry Dial */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg
          className="w-full h-full transform -rotate-[200deg]"
          viewBox="0 0 220 220"
        >
          {/* Subtle Outer Ticks Ring */}
          {tickAngles.map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const rInner = 98;
            const rOuter = idx % 4 === 0 ? 104 : 101;
            const cx = 110;
            const cy = 110;
            const x1 = cx + rInner * Math.cos(rad);
            const y1 = cy + rInner * Math.sin(rad);
            const x2 = cx + rOuter * Math.cos(rad);
            const y2 = cy + rOuter * Math.sin(rad);

            const isPassed = (idx / (totalTicks - 1)) <= (score / 100);

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isPassed ? dialColor : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={idx % 4 === 0 ? "1.5" : "1"}
                strokeOpacity={isPassed ? 0.8 : 0.4}
              />
            );
          })}

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

        {/* Center Readout with Tabular Figures */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline font-mono tracking-tighter">
            <span className="text-5xl font-semibold text-white">
              {animatedScore}
            </span>
            <span className="text-xl font-normal text-neutral-500 ml-1">/100</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mt-1">
            Uniqueness Index
          </span>
        </div>
      </div>

      {/* Structured Verdict Pill */}
      <div className="mt-2 flex flex-col items-center max-w-xs text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-[#12141c] text-xs font-medium text-neutral-200">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dialColor }} />
          <span>{verdict.title}</span>
        </div>
        <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">
          {verdict.description}
        </p>
      </div>
    </div>
  );
};
