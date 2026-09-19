import React from 'react';
import { motion } from 'framer-motion';
import { ViabilityMetrics } from '@/lib/types';

interface ViabilityRadarProps {
  metrics: ViabilityMetrics;
}

export const ViabilityRadar: React.FC<ViabilityRadarProps> = ({ metrics }) => {
  const axes = [
    { label: 'Инновации', value: metrics.innovation, key: 'innovation', desc: 'Технологическая и продуктовая новизна' },
    { label: 'Защита (Moat)', value: metrics.moat, key: 'moat', desc: 'Сложность прямого клонирования' },
    { label: 'Retention', value: metrics.retentionPotential, key: 'retention', desc: 'Органический стимул возвращаться' },
    { label: 'Доступный CAC', value: Math.max(10, 100 - metrics.cacDifficulty), key: 'cac', desc: 'Экономика привлечения клиентов' },
    { label: 'Свобода ниши', value: Math.max(10, 100 - metrics.saturation), key: 'saturation', desc: 'Отсутствие монополистов и ценовых войн' },
  ];

  const size = 240;
  const center = size / 2;
  const radius = 80;
  const totalAxes = axes.length;

  const getCoordinates = (value: number, index: number, maxRadius: number = radius) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map(level => {
    return axes.map((_, i) => {
      const { x, y } = getCoordinates(100 * level, i);
      return `${x},${y}`;
    }).join(' ');
  });

  const activePolygon = axes.map((axis, i) => {
    const { x, y } = getCoordinates(axis.value, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-1">
      {/* Precision Polygon Plot */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Radial Grid lines */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
              strokeDasharray={idx < 3 ? "2 2" : undefined}
            />
          ))}

          {/* Spokes */}
          {axes.map((_, i) => {
            const end = getCoordinates(100, i);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Active Polygon with subtle white fill */}
          <motion.polygon
            points={activePolygon}
            fill="rgba(255, 255, 255, 0.04)"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          {/* Precision Nodes */}
          {axes.map((axis, i) => {
            const point = getCoordinates(axis.value, i);
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#ffffff"
                stroke="#07080b"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Structured Clean Metrics Readout */}
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {axes.map((axis) => (
          <div
            key={axis.key}
            className="p-3 rounded-lg bg-[#11141c] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-neutral-300">
                {axis.label}
              </span>
              <span className="text-xs font-mono font-semibold text-white">
                {axis.value}%
              </span>
            </div>

            {/* Precision Micro Progress Bar */}
            <div className="w-full h-1 rounded-full bg-neutral-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/70"
                style={{ width: `${axis.value}%` }}
              />
            </div>

            <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
              {axis.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
