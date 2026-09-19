import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card3D } from '../ui/Card3D';
import { NeonButton } from '../ui/NeonButton';
import { CornerDownLeft, Globe, Key, ShieldCheck } from 'lucide-react';

interface HeroInputProps {
  onAnalyze: (idea: string, market: string, apiKey: string) => void;
  isLoading: boolean;
}

const EXAMPLE_IDEAS = [
  {
    title: 'AI саммари звонков',
    text: 'AI-ассистент для автоматической расшифровки и формирования саммари рабочих звонков в Zoom и Meet с фиксацией задач в Jira',
    market: 'B2B SaaS / Productivity'
  },
  {
    title: 'Tinder для кофаундеров',
    text: 'Приложение для поиска кофаундеров и партнеров в стартап со свайпами анкет, проверкой GitHub коммитов и тестом на совместимость',
    market: 'B2C / Networking'
  },
  {
    title: 'P2P аренда фототехники',
    text: 'P2P-маркетплейс для аренды профессиональной фото- и кинотехники между операторами с депозитом на смарт-контракте и экспресс-страховкой',
    market: 'Marketplace / P2P'
  },
  {
    title: 'AI-агент код-ревью в PR',
    text: 'Автономный AI-агент для ревью pull requests в GitHub, выявления скрытых архитектурных регрессий и генерации фикс-коммитов',
    market: 'DevTools / Infra'
  },
];

const TARGET_MARKETS = [
  'B2B SaaS',
  'Consumer Mobile',
  'Marketplace / P2P',
  'DevTools & Infra',
  'FinTech & Web3',
];

export const HeroInput: React.FC<HeroInputProps> = ({ onAnalyze, isLoading }) => {
  const [ideaText, setIdeaText] = useState('');
  const [targetMarket, setTargetMarket] = useState(TARGET_MARKETS[0]);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  // Load saved API key from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key_v1') || '';
    if (saved) setApiKey(saved);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ideaText.trim() || ideaText.trim().length < 8) {
      setError('Опишите идею чуть подробнее (хотя бы от 8-10 символов) для корректного скоринга.');
      return;
    }
    setError('');
    // Persist API key if entered
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key_v1', apiKey.trim());
    }
    onAnalyze(ideaText.trim(), targetMarket, apiKey.trim());
  };

  const handleSelectExample = (example: typeof EXAMPLE_IDEAS[0]) => {
    setIdeaText(example.text);
    setTargetMarket(example.market);
    setError('');
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto pt-8 pb-14 px-4 sm:px-6">
      {/* Subdued status pill */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-[#11141c] text-xs font-mono text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Real-time Venture Audit</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-300">Google Search Live Grounding</span>
        </div>
      </motion.div>

      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
          Реальный аудит идеи <br />
          <span className="text-neutral-400">с живым поиском аналогов в Google.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Беспристрастный поиск реально запущенных сайтов, оценка барьера копирования (Moat), юнит-экономики и Blue Ocean отстройки.
        </p>
      </motion.div>

      {/* 3D Machined Card Input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <Card3D depth={6} className="p-5 sm:p-6 bg-[#0c0e14]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Segment Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Целевой сегмент:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {TARGET_MARKETS.map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => setTargetMarket(market)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      targetMarket === market
                        ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                        : 'bg-transparent text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Textarea */}
            <div className="relative">
              <textarea
                value={ideaText}
                onChange={(e) => {
                  setIdeaText(e.target.value);
                  if (error) setError('');
                }}
                rows={3}
                placeholder="Опишите вашу идею или ценностное предложение... (например: P2P аренда кинооптики со смарт-контрактом)"
                className="w-full bg-[#10131b] border border-white/[0.08] rounded-lg p-3.5 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:bg-[#131620] transition-colors resize-none font-normal"
              />
              <div className="absolute right-3 bottom-2.5 text-[11px] text-neutral-500 font-mono">
                {ideaText.length} символов
              </div>
            </div>

            {/* Direct API Key Input Bar for Live Google Search */}
            <div className="p-3 rounded-lg bg-[#11141c] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-sky-400" />
                  <span>Google Gemini API Key (для живого поиска сайтов в интернете):</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  GOOGLE SEARCH GROUNDING
                </span>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (вставьте ключ или передайте мне в чат для авто-подключения)"
                className="w-full bg-[#0a0c10] border border-white/[0.08] rounded-md px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400"
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Ключ хранится только в вашем браузере
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  Получить ключ в Google AI Studio →
                </a>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-mono">
                {error}
              </p>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>{apiKey ? 'Режим: Живой веб-поиск через Gemini' : 'Режим: Офлайн-бенчмарк (введите ключ для интернета)'}</span>
              </div>

              <NeonButton
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full sm:w-auto"
              >
                <span>Запустить реальный аудит</span>
                <CornerDownLeft className="w-3.5 h-3.5 ml-1 opacity-70" />
              </NeonButton>
            </div>
          </form>
        </Card3D>
      </motion.div>

      {/* Understated Example Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2.5">
          <span>Примеры для теста:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {EXAMPLE_IDEAS.map((example) => (
            <button
              key={example.title}
              type="button"
              onClick={() => handleSelectExample(example)}
              className="px-3 py-1.5 rounded-lg bg-[#11131a] hover:bg-[#161a24] border border-white/[0.06] hover:border-white/[0.14] text-xs text-neutral-300 hover:text-white transition-all text-left"
            >
              {example.title}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
