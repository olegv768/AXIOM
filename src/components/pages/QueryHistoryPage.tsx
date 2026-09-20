import React, { useState, useMemo } from 'react';
import { ValidationReport } from '@/lib/types';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ui/ScrollReveal';
import {
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Crosshair,
  TrendingUp,
  Compass,
  Layers,
  X,
  SlidersHorizontal,
  Lightbulb
} from 'lucide-react';

interface QueryHistoryPageProps {
  allReports: ValidationReport[];
  onSelectReport: (report: ValidationReport) => void;
  onUseAsTemplate: (idea: string, market: string) => void;
  onNewAnalysis: () => void;
}

const MARKET_CATEGORIES = [
  { id: 'all', ru: 'Все рынки', en: 'All markets' },
  { id: 'devtools', ru: 'DevTools & Infra', en: 'DevTools & Infra' },
  { id: 'b2b', ru: 'B2B SaaS', en: 'B2B SaaS' },
  { id: 'marketplace', ru: 'Marketplace / P2P', en: 'Marketplace / P2P' },
  { id: 'healthtech', ru: 'HealthTech & Med', en: 'HealthTech & Med' },
  { id: 'consumer', ru: 'Consumer Mobile', en: 'Consumer Mobile' },
];

export const QueryHistoryPage: React.FC<QueryHistoryPageProps> = ({
  allReports,
  onSelectReport,
  onUseAsTemplate,
  onNewAnalysis,
}) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'score_desc' | 'score_asc'>('newest');

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    return allReports
      .filter((report) => {
        // Category filter
        if (selectedCategoryId !== 'all') {
          const catObj = MARKET_CATEGORIES.find(c => c.id === selectedCategoryId);
          if (catObj && !report.targetMarket.toLowerCase().includes(catObj.id.toLowerCase()) && !report.targetMarket.toLowerCase().includes(catObj.en.toLowerCase()) && !report.targetMarket.toLowerCase().includes(catObj.ru.toLowerCase())) {
            return false;
          }
        }

        // Score filter
        if (scoreFilter === 'high' && report.uniquenessScore < 75) return false;
        if (scoreFilter === 'medium' && (report.uniquenessScore < 50 || report.uniquenessScore >= 75)) return false;
        if (scoreFilter === 'low' && report.uniquenessScore >= 50) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchIdea = report.ideaText.toLowerCase().includes(q);
          const matchMarket = report.targetMarket.toLowerCase().includes(q);
          const matchVerdict = report.verdict.title.toLowerCase().includes(q);
          const matchWebsites = report.similarWebsites?.some(
            (w) => w.name.toLowerCase().includes(q) || w.domain.toLowerCase().includes(q)
          );
          return matchIdea || matchMarket || matchVerdict || matchWebsites;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'score_desc') return b.uniquenessScore - a.uniquenessScore;
        if (sortBy === 'score_asc') return a.uniquenessScore - b.uniquenessScore;
        return 0;
      });
  }, [allReports, selectedCategoryId, scoreFilter, searchQuery, sortBy]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-7 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5 text-neutral-300" />
            </div>
            <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">
              {lang === 'en' ? 'BENCHMARK DATABASE' : 'БАЗА РЫНОЧНЫХ ЗАПРОСОВ'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display uppercase">
            {t('benchmarks_title')}
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            {t('benchmarks_subtitle')}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 rounded-lg bg-white text-black font-medium text-xs font-mono hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-sm"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{t('about_check_idea')}</span>
          </button>
        </div>
      </div>

      <ScrollReveal variant="fade-up" duration={600} delay={50}>
      <div className="p-4 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('benchmarks_search_placeholder')}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#12141c] border border-white/[0.08] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">{t('benchmarks_sort_label')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-[#12141c] border border-white/[0.08] text-xs font-mono text-neutral-300 focus:outline-none focus:border-white/20 cursor-pointer"
            >
              <option value="newest">{t('benchmarks_sort_newest')}</option>
              <option value="score_desc">{t('benchmarks_sort_score_desc')}</option>
              <option value="score_asc">{t('benchmarks_sort_score_asc')}</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Market categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {MARKET_CATEGORIES.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {lang === 'en' ? cat.en : cat.ru}
                </button>
              );
            })}
          </div>

          {/* Score level pills */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-md border border-white/[0.06]">
            <button
              onClick={() => setScoreFilter('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                scoreFilter === 'all' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t('benchmarks_filter_all')}
            </button>
            <button
              onClick={() => setScoreFilter('high')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                scoreFilter === 'high' ? 'bg-emerald-500/20 text-emerald-300' : 'text-neutral-400 hover:text-emerald-300'
              }`}
            >
              75%+
            </button>
            <button
              onClick={() => setScoreFilter('medium')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                scoreFilter === 'medium' ? 'bg-sky-500/20 text-sky-300' : 'text-neutral-400 hover:text-sky-300'
              }`}
            >
              50–74%
            </button>
            <button
              onClick={() => setScoreFilter('low')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                scoreFilter === 'low' ? 'bg-rose-500/20 text-rose-300' : 'text-neutral-400 hover:text-rose-300'
              }`}
            >
              &lt;50%
            </button>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* Query Count Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-500 px-1">
        <span>
          {t('benchmarks_found_label')} <strong className="text-white">{filteredReports.length}</strong>
        </span>
        {(searchQuery || selectedCategoryId !== 'all' || scoreFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryId('all');
              setScoreFilter('all');
            }}
            className="text-neutral-400 hover:text-white underline underline-offset-4"
          >
            {t('benchmarks_reset_filters')}
          </button>
        )}
      </div>

      {/* Grid of Query Cards */}
      {filteredReports.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-[#0c0e14] border border-white/[0.06] space-y-3">
          <Search className="w-8 h-8 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-300">{t('benchmarks_empty')}</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {t('benchmarks_empty_desc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report, idx) => {
            const dateStr = new Date(report.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <ScrollReveal
                key={report.id}
                variant="fade-up"
                duration={500}
                staggerIndex={idx % 6}
                staggerDelay={70}
              >
              <div
                className="group p-5 rounded-xl bg-[#0c0e14] hover:bg-[#10131c] border border-white/[0.07] hover:border-white/[0.16] transition-all flex flex-col justify-between gap-4 relative shadow-sm"
              >
                {/* Card Top: Segment & Uniqueness */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
                        {report.targetMarket}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">{dateStr}</span>
                    </div>

                    {/* Uniqueness Score */}
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
                        report.uniquenessScore >= 75
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : report.uniquenessScore >= 50
                          ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      <span>{report.uniquenessScore}%</span>
                      <span className="text-[10px] font-normal opacity-70">{t('benchmarks_uniqueness')}</span>
                    </div>
                  </div>

                  {/* Idea description */}
                  <h3
                    onClick={() => onSelectReport(report)}
                    className="text-sm font-medium text-neutral-100 hover:text-white transition-colors cursor-pointer leading-relaxed line-clamp-3"
                  >
                    {report.ideaText}
                  </h3>

                  {/* Verdict summary */}
                  <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="truncate">{report.verdict.title}</span>
                  </div>

                  {/* Real websites preview pills */}
                  {report.similarWebsites && report.similarWebsites.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-500">{t('benchmarks_competitors')}</span>
                      {report.similarWebsites.slice(0, 3).map((w, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 border border-white/[0.05]"
                        >
                          {w.domain || w.name}
                        </span>
                      ))}
                      {report.similarWebsites.length > 3 && (
                        <span className="text-[10px] font-mono text-neutral-500">
                          +{report.similarWebsites.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                  <button
                    onClick={() => onUseAsTemplate(report.ideaText, report.targetMarket)}
                    className="text-neutral-400 hover:text-white font-mono text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-400/80" />
                    <span>{t('benchmarks_use_template')}</span>
                  </button>

                  <button
                    onClick={() => onSelectReport(report)}
                    className="px-3 py-1 rounded-md bg-white/[0.07] hover:bg-white/[0.14] text-neutral-200 hover:text-white font-mono text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    <span>{t('benchmarks_view_analysis')}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
};
