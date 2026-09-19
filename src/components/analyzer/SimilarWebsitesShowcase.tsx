import React from 'react';
import { SimilarWebsiteItem } from '@/lib/types';
import { Card3D } from '../ui/Card3D';
import { ExternalLink, Globe, TrendingUp, DollarSign, Eye, AlertCircle } from 'lucide-react';

interface SimilarWebsitesShowcaseProps {
  websites: SimilarWebsiteItem[];
}

export const SimilarWebsitesShowcase: React.FC<SimilarWebsitesShowcaseProps> = ({ websites }) => {
  if (!websites || websites.length === 0) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Реальные примеры сайтов и проектов в этой нише
          </h3>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {websites.length} ВЕРИФИЦИРОВАННЫХ САЙТА
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {websites.map((site) => (
          <div key={site.name} className="h-full">
            <Card3D depth={5} className="h-full p-4 sm:p-5 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Header with Domain & Live Link */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {site.name}
                      </h4>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
                        title="Открыть сайт в новой вкладке"
                      >
                        <span>{site.domain}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </a>
                    </div>
                    <p className="text-xs text-neutral-400 italic mt-0.5">
                      «{site.tagline}»
                    </p>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-neutral-300 border border-white/[0.08] flex-shrink-0">
                    {site.stage}
                  </span>
                </div>

                {/* What they do */}
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {site.whatTheyDo}
                </p>

                {/* Financials / Meta pills */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#10131a] border border-white/[0.04]">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">
                      Модель монетизации:
                    </span>
                    <span className="text-neutral-200 line-clamp-1">{site.pricingModel}</span>
                  </div>

                  <div className="p-2 rounded bg-[#10131a] border border-white/[0.04]">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">
                      Оценка трафика:
                    </span>
                    <span className="text-neutral-200 line-clamp-1">{site.trafficEstimate}</span>
                  </div>
                </div>

                {/* Growth Channel */}
                <div className="text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">
                    Главный канал роста:
                  </span>
                  <p className="text-neutral-300">
                    {site.growthChannel}
                  </p>
                </div>
              </div>

              {/* Blind Spot & Opportunity Window */}
              <div className="mt-3.5 pt-3 border-t border-white/[0.06] p-3 rounded-lg bg-[#141824]/60 border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Их слепая зона (Окно возможностей для вас):</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {site.blindSpot}
                </p>
              </div>
            </Card3D>
          </div>
        ))}
      </div>
    </div>
  );
};
