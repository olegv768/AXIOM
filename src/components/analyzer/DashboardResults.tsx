import React, { useEffect, useState } from 'react';
import { ValidationReport } from '@/lib/types';
import { exportToMarkdown } from '@/lib/analyzerEngine';
import { Card3D } from '../ui/Card3D';
import { UniquenessGauge } from '../ui/UniquenessGauge';
import { ViabilityRadar } from '../ui/ViabilityRadar';
import { SimilarWebsitesShowcase } from './SimilarWebsitesShowcase';
import { VentureDeepDive } from './VentureDeepDive';
import { StartupStressLab } from './StartupStressLab';
import { NeonButton } from '../ui/NeonButton';
import { ScrollReveal } from '../ui/ScrollReveal';
import {
  Copy,
  Check,
  RotateCcw,
  Compass,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Globe,
  Crosshair,
  Activity
} from 'lucide-react';

interface DashboardResultsProps {
  report: ValidationReport;
  onReset: () => void;
}

export const DashboardResults: React.FC<DashboardResultsProps> = ({ report, onReset }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCopyMarkdown = async () => {
    const md = exportToMarkdown(report);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (level: 'critical' | 'high' | 'medium') => {
    if (level === 'critical') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (level === 'high') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-neutral-300 bg-neutral-800 border-neutral-700';
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-7">
      {/* Precision Header & Action Bar */}
      <ScrollReveal variant="fade-down" duration={600}>
      <div className="p-4 sm:p-5 rounded-xl bg-[#0c0e14] border border-white/[0.08] shadow-hardware flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              ANALYSIS • {report.targetMarket}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-[10px] font-mono text-neutral-400">
              {new Date(report.createdAt).toLocaleDateString('ru-RU')}
            </span>
            {report.sourceProvider && (
              <>
                <span className="text-neutral-600">/</span>
                <span className="text-[10px] font-mono uppercase text-emerald-400">
                  {report.sourceProvider === 'gemini_search' ? '● LIVE SEARCH' : '● BENCHMARK'}
                </span>
              </>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            «{report.ideaText}»
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={handleCopyMarkdown}
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Скопировано' : 'Markdown'}
          </NeonButton>
          <NeonButton
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Сброс
          </NeonButton>
        </div>
      </div>
      </ScrollReveal>

      {/* Row 1: Telemetry Gauge & Viability Radar */}
      <ScrollReveal variant="fade-up" duration={700} delay={100}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Uniqueness Gauge Card */}
        <div className="lg:col-span-5">
          <Card3D depth={6} className="h-full p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Uniqueness Index
              </span>
              <span className="text-[10px] font-mono text-neutral-400">0–100 SCALE</span>
            </div>

            <UniquenessGauge score={report.uniquenessScore} verdict={report.verdict} />

            <div className="pt-3 border-t border-white/[0.06] text-center">
              <span className="text-[11px] text-neutral-500 font-mono">
                Сверка с базами ProductHunt, YC & Crunchbase
              </span>
            </div>
          </Card3D>
        </div>

        {/* Viability Radar Card */}
        <div className="lg:col-span-7">
          <Card3D depth={6} className="h-full p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Market Defensibility Matrix
              </span>
              <span className="text-[10px] font-mono text-neutral-400">5-AXIS RADAR</span>
            </div>

            <ViabilityRadar metrics={report.metrics} />

            <div className="mt-4 p-3 rounded-lg bg-[#11141c] border border-white/[0.06]">
              <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-0.5">Резюме:</span>
                {report.quickTakeaway}
              </div>
            </div>
          </Card3D>
        </div>
      </div>
      </ScrollReveal>

      {/* Row 1.5: INTERACTIVE STRESS-TEST LAB */}
      <ScrollReveal variant="scale-up" duration={700}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white">
              Интерактивный стресс-тест жизнеспособности (Viability Stress Lab)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            REAL-TIME SCENARIOS • DYNAMIC RADAR
          </span>
        </div>
        <StartupStressLab ideaTitle={report.ideaText.substring(0, 32)} />
      </div>
      </ScrollReveal>

      {/* Row 2: REAL SIMILAR WEBSITES & STARTUPS SHOWCASE */}
      <ScrollReveal variant="fade-up" duration={700}>
        <SimilarWebsitesShowcase websites={report.similarWebsites} />
      </ScrollReveal>

      {/* Row 3: VENTURE DEEP DIVE (Unit Economics + TAM/SAM/SOM + GTM) */}
      <ScrollReveal variant="blur-in" duration={800}>
        <VentureDeepDive
          unitEconomics={report.unitEconomics}
          gtmPlaybook={report.gtmPlaybook}
          marketSizing={report.marketSizing}
        />
      </ScrollReveal>

      {/* Row 4: Ruthless Critique (Беспристрастная критика) */}
      <ScrollReveal variant="fade-up" duration={700}>
      <Card3D depth={4} className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Беспристрастная критика (Ruthless Critique)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">COGNITIVE BIAS ANALYSIS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-lg bg-[#10131a] border border-white/[0.06] space-y-1">
            <div className="text-xs font-mono text-neutral-300 font-medium">
              [01] Искажение фаундера (Founder Bias)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {report.ruthlessCritique.founderBias}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10131a] border border-white/[0.06] space-y-1">
            <div className="text-xs font-mono text-neutral-300 font-medium">
              [02] Барьер привычки (Switching Barrier)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {report.ruthlessCritique.switchingBarrier}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10131a] border border-white/[0.06] space-y-1">
            <div className="text-xs font-mono text-neutral-300 font-medium">
              [03] Ловушка удержания (Retention Pitfall)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {report.ruthlessCritique.retentionPitfall}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#10131a] border border-white/[0.06] space-y-1">
            <div className="text-xs font-mono text-neutral-300 font-medium">
              [04] Уязвимость экономики (Monetization Flaw)
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {report.ruthlessCritique.monetizationFlaw}
            </p>
          </div>
        </div>
      </Card3D>
      </ScrollReveal>

      {/* Row 5: Competitor Dossiers with 3D Tilt */}
      <ScrollReveal variant="fade-left" duration={700}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Конкурентный ландшафт (Competitor Analysis)
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {report.competitors.length} ИГРОКА
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.competitors.map((comp) => (
            <div key={comp.name} className="h-full">
              <Card3D depth={6} className="h-full p-4 sm:p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {comp.name}
                    </h4>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-white/[0.06]">
                      {comp.type}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="pt-2.5 space-y-2 border-t border-white/[0.06] text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                        Сильная сторона:
                      </span>
                      <p className="text-neutral-300">
                        {comp.strength}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                        Уязвимость:
                      </span>
                      <p className="text-neutral-300">
                        {comp.vulnerability}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>Охват / Капитал:</span>
                  <span className="text-neutral-300 font-medium">{comp.estimatedFundingOrReach}</span>
                </div>
              </Card3D>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Row 6: Red Flags (Точки отказа) */}
      <ScrollReveal variant="slide-up" duration={700}>
      <Card3D depth={4} className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Критические точки отказа (Red Flags)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">KILL-SWITCH RISKS</span>
        </div>

        <div className="space-y-2.5">
          {report.redFlags.map((rf, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#10131a] border border-white/[0.06] flex flex-col sm:flex-row items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${getRiskColor(rf.riskLevel)}`}>
                    {rf.riskLevel}
                  </span>
                  <span className="font-semibold text-white">
                    {rf.title}
                  </span>
                </div>
                <p className="text-neutral-400 leading-relaxed pt-0.5">
                  {rf.description}
                </p>
              </div>

              <div className="sm:max-w-xs w-full p-2.5 rounded bg-[#151922] border border-white/[0.06] text-neutral-300">
                <span className="block text-[9px] uppercase font-mono text-neutral-400 mb-0.5">
                  Тактика защиты:
                </span>
                {rf.mitigationHint}
              </div>
            </div>
          ))}
        </div>
      </Card3D>
      </ScrollReveal>

      {/* Row 7: Blue Ocean Pivots */}
      <ScrollReveal variant="fade-right" duration={700}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Blue Ocean Pivots (Векторы трансформации)
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            90%+ UNIQUENESS TARGET
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.blueOceanPivots.map((pivot) => (
            <div key={pivot.title} className="h-full">
              <Card3D depth={6} className="h-full p-4 sm:p-5 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Цель: {pivot.expectedUniqueness}%
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {pivot.angle}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {pivot.title}
                  </h4>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {pivot.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                    Тактический ход:
                  </span>
                  <p className="text-xs text-neutral-300">
                    {pivot.tacticalMove}
                  </p>
                </div>
              </Card3D>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Bottom Bar */}
      <ScrollReveal variant="fade-up" duration={600} delay={100}>
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.06] text-xs text-neutral-500">
        <span>Отчет сохранён в истории.</span>
        <div className="flex items-center gap-2.5">
          <NeonButton
            variant="primary"
            size="sm"
            onClick={handleCopyMarkdown}
            icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Скопировано в буфер' : 'Экспорт отчета (MD)'}
          </NeonButton>
          <NeonButton
            variant="secondary"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Новый анализ
          </NeonButton>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
};
