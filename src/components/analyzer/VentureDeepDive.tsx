import React from 'react';
import { UnitEconomics, GtmStep, MarketSizing } from '@/lib/types';
import { Card3D } from '../ui/Card3D';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Calculator, Rocket, PieChart, DollarSign, Clock, ShieldAlert } from 'lucide-react';

interface VentureDeepDiveProps {
  unitEconomics: UnitEconomics;
  gtmPlaybook: GtmStep[];
  marketSizing: MarketSizing;
}

export const VentureDeepDive: React.FC<VentureDeepDiveProps> = ({
  unitEconomics,
  gtmPlaybook,
  marketSizing,
}) => {
  return (
    <div className="space-y-6">
      {/* Unit Economics & Market Sizing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Unit Economics Card */}
        <ScrollReveal variant="fade-right" duration={700} className="lg:col-span-7">
          <Card3D depth={5} className="h-full p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Стресс-тест юнит-экономики (Unit Economics)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">FINANCIAL ANALYSIS</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[#10131a] border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Оценка CAC (Привлечение):
                  </span>
                  <span className="text-xs font-mono font-semibold text-white">
                    {unitEconomics.cacEstimate}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#10131a] border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Ожидаемый LTV:
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {unitEconomics.expectedLtv}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#10131a] border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Срок окупаемости (Payback):
                  </span>
                  <span className="text-xs font-mono font-semibold text-sky-400">
                    {unitEconomics.paybackPeriod}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#10131a] border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Валовая маржинальность:
                  </span>
                  <span className="text-xs font-mono font-semibold text-white">
                    {unitEconomics.marginProfile}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-xs text-rose-300">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono uppercase text-[9px] block font-semibold">Главный финансовый риск:</span>
                {unitEconomics.burnRisk}
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Market Sizing Card */}
        <ScrollReveal variant="fade-left" duration={700} delay={150} className="lg:col-span-5">
          <Card3D depth={5} className="h-full p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Потолок рынка (TAM / SAM / SOM)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">MARKET CEILING</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#10131a] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-neutral-400">TAM (Мировой объем):</span>
                  <span className="text-white font-semibold">{marketSizing.tam}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#10131a] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-neutral-400">SAM (Целевой сегмент):</span>
                  <span className="text-white font-semibold">{marketSizing.sam}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#10131a] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-neutral-400">SOM (План на 18 мес):</span>
                  <span className="text-emerald-400 font-semibold">{marketSizing.som}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#10131a] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-neutral-400">Средний чек (ARPU):</span>
                  <span className="text-white font-semibold">{marketSizing.averageCheck}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 font-mono mt-4 text-center">
              Оценка основана на бенчмарках аналогичных SaaS/Marketplace раундов
            </p>
          </Card3D>
        </ScrollReveal>
      </div>

      {/* Go-To-Market Playbook Card */}
      {gtmPlaybook && gtmPlaybook.length > 0 && (
        <ScrollReveal variant="slide-up" duration={700}>
        <Card3D depth={4} className="p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-neutral-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Go-To-Market Playbook (Стратегия первых 1000 пользователей)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">0 → 1 TRACTION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {gtmPlaybook.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#10131a] border border-white/[0.06] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                    <span className="font-semibold text-white">{step.phase}</span>
                    <span>{step.timeline}</span>
                  </div>

                  <span className="text-xs font-semibold text-neutral-200 block mb-1">
                    Канал: {step.channel}
                  </span>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.tacticalAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card3D>
        </ScrollReveal>
      )}
    </div>
  );
};
