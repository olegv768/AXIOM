import React from 'react';
import { ValidationReport } from '@/lib/types';
import {
  Trophy,
  Medal,
  Crosshair,
  CheckCircle2,
  Terminal,
  Layers,
  Zap
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

interface MyHistoryPageProps {
  history?: ValidationReport[];
  starredIds?: string[];
  onSelectReport?: (report: ValidationReport) => void;
  onToggleStar?: (id: string) => void;
  onDeleteOne?: (id: string) => void;
  onClearAll?: () => void;
  onNewAnalysis: () => void;
}

const DEFAULT_BIO_RU = {
  name: 'Volosov Oleg',
  tagline: '2 место Infomatrix (Silver Medal) • 3 место Alem AI Hackathon • React, Three.js, D3.js, TypeScript, Tailwind, Vite, SEO',
  about: `Я занимаюсь разработкой высокопроизводительных веб-интерфейсов, интерактивных 3D/графических визуализаций и масштабируемых продуктов на стыке искусственного интеллекта.

Мой бэкграунд сформирован победами и призовыми местами в престижных соревнованиях:
• 🥈 2 место на международном конкурсе Infomatrix (Silver Medal) среди участников со всего мира за системный дизайн, интерфейс и архитектуру.
• 🥉 3 место на хакатоне Alem AI за разработку и запуск прикладных решений с использованием ИИ на базе Alem AI за 10-дневный хакатон-интенсив.

Ключевой технологический арсенал:
React, Three.js (3D в вебе, шейдеры), D3.js (сложная визуализация данных и аналитических графов), TypeScript, TailwindCSS, Vite (мгновенный билд) и комплексная техническая SEO-оптимизация (Core Web Vitals 95+, семантическая разметка и перформанс).`,
};

const DEFAULT_BIO_EN = {
  name: 'Volosov Oleg',
  tagline: '2nd Place Infomatrix (Silver Medal) • 3rd Place Alem AI Hackathon • React, Three.js, D3.js, TypeScript, Tailwind, Vite, SEO',
  about: `I engineer high-performance web applications, immersive 3D/data visualizations, and scalable interfaces at the intersection of modern AI.

My background is anchored by top podium finishes in international technical competitions:
• 🥈 2nd Place at Infomatrix (Silver Medal) among worldwide participants for system design, UX interface, and software architecture.
• 🥉 3rd Place at Alem AI Hackathon for architecting and shipping production AI solutions in an intensive 10-day sprint.

Core Tech Stack & Competencies:
React, Three.js (spatial 3D web, custom shaders), D3.js (complex data viz and competitor radar graphs), TypeScript, TailwindCSS, Vite (sub-second HMR), and technical SEO optimization (Core Web Vitals 95+, semantic HTML, sub-second latency).`,
};

export const MyHistoryPage: React.FC<MyHistoryPageProps> = ({
  onNewAnalysis,
}) => {
  const { lang, t } = useLanguage();
  const bioData = lang === 'en' ? DEFAULT_BIO_EN : DEFAULT_BIO_RU;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Main Narrative Card with Face Photo */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>{t('about_manifesto')}</span>
          </div>

          <button
            onClick={onNewAnalysis}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t('about_check_idea')}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
          {/* Founder Face Photo Card (Only here) */}
          <div className="relative shrink-0 w-36 sm:w-44 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#080a0f] group">
            <div className="aspect-[4/5] w-full relative overflow-hidden">
              <img
                src="/avatar-face.jpg"
                alt={bioData.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left pointer-events-none">
                <div className="text-xs font-display font-bold text-white tracking-tight leading-tight truncate">
                  {bioData.name}
                </div>
                <div className="text-[10px] font-mono text-sky-400">
                  SYSTEM ARCHITECT
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Description */}
          <div className="flex-1 text-neutral-300 text-sm leading-relaxed whitespace-pre-line font-sans">
            {bioData.about}
          </div>
        </div>
      </div>

      {/* 3. Key Achievements Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wider px-1">
          {t('about_achievements')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Infomatrix 2nd Place */}
          <div className="p-5 rounded-xl bg-[#0c0e14] border border-sky-500/20 relative overflow-hidden space-y-3 group hover:border-sky-500/40 transition-all">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Medal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-white">
                  {t('achieve_1_title')}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                  {t('achieve_1_badge')}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {t('achieve_1_desc')}
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2 text-[10px] font-mono text-neutral-500">
              <span>International Stage</span> • <span>Silver Medal</span> • <span>System Design</span>
            </div>
          </div>

          {/* Card 2: Alem AI Hackathon 3rd Place */}
          <div className="p-5 rounded-xl bg-[#0c0e14] border border-amber-500/20 relative overflow-hidden space-y-3 group hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-white">
                  {t('achieve_2_title')}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {t('achieve_2_badge')}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {t('achieve_2_desc')}
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2 text-[10px] font-mono text-neutral-500">
              <span>Alem AI</span> • <span>10 Days Hackathon</span> • <span>AI Solution</span>
            </div>
          </div>

          {/* Card 3: Creative 3D & Data Visualization */}
          <div className="p-5 rounded-xl bg-[#0c0e14] border border-purple-500/20 relative overflow-hidden space-y-3 group hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-white">
                  {t('achieve_3_title')}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  {t('achieve_3_badge')}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {t('achieve_3_desc')}
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2 text-[10px] font-mono text-neutral-500">
              <span>Three.js (3D)</span> • <span>D3.js (Data Viz)</span> • <span>Interactive Canvas</span>
            </div>
          </div>

          {/* Card 4: React, TypeScript, Vite & SEO */}
          <div className="p-5 rounded-xl bg-[#0c0e14] border border-emerald-500/20 relative overflow-hidden space-y-3 group hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-white">
                  {t('achieve_4_title')}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {t('achieve_4_badge')}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {t('achieve_4_desc')}
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2 text-[10px] font-mono text-neutral-500">
              <span>React</span> • <span>TypeScript</span> • <span>TailwindCSS</span> • <span>Vite</span> • <span>SEO</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Competencies & Tech Stack Tags */}
      <div className="p-6 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-3">
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
          {t('about_stack')}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            'React',
            'Three.js (3D Web)',
            'D3.js (Data Viz)',
            'TypeScript',
            'TailwindCSS',
            'Vite',
            lang === 'en' ? 'SEO Optimization' : 'SEO-оптимизация',
            lang === 'en' ? '2nd Place Infomatrix' : '2 место Infomatrix',
            lang === 'en' ? '3rd Place Alem AI Hackathon' : '3 место Alem AI Hackathon',
            'Autonomous AI Agents',
            'Google Search Grounding',
            'Core Web Vitals & Performance',
            'Spatial UI Design'
          ].map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-[#141620] border border-white/[0.08] text-xs font-mono text-neutral-200 flex items-center gap-1.5 hover:border-white/20 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 5. Architectural Philosophy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0c0e14] border border-white/[0.06] space-y-2">
          <div className="text-[10px] font-mono uppercase text-sky-400 tracking-wider">
            {t('philosophy_1_tag')}
          </div>
          <h4 className="text-sm font-semibold text-white">
            {t('philosophy_1_title')}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('philosophy_1_desc')}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0e14] border border-white/[0.06] space-y-2">
          <div className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
            {t('philosophy_2_tag')}
          </div>
          <h4 className="text-sm font-semibold text-white">
            {t('philosophy_2_title')}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('philosophy_2_desc')}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0e14] border border-white/[0.06] space-y-2">
          <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
            {t('philosophy_3_tag')}
          </div>
          <h4 className="text-sm font-semibold text-white">
            {t('philosophy_3_title')}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('philosophy_3_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyHistoryPage;
