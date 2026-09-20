import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton } from '../ui/NeonButton';
import { StartupStressLab } from './StartupStressLab';
import { ScrollReveal } from '../ui/ScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  CornerDownLeft,
  Search,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Activity,
  Terminal,
  Cpu,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface HeroInputProps {
  onAnalyze: (idea: string, market: string) => void;
  isLoading: boolean;
  initialIdea?: string;
  initialMarket?: string;
}

const EXAMPLE_IDEAS_RU = [
  {
    code: '01',
    title: 'Саммари звонков',
    text: 'Сервис автоматической расшифровки и формирования саммари рабочих звонков в Zoom и Meet с фиксацией задач в Jira',
    market: 'B2B SaaS',
    tag: 'TRANSCRIPTION',
  },
  {
    code: '02',
    title: 'Матчинг кофаундеров',
    text: 'Платформа поиска кофаундеров для стартапов со свайпами анкет, проверкой GitHub коммитов и тестом на психологическую совместимость',
    market: 'Consumer Mobile',
    tag: 'NETWORKING',
  },
  {
    code: '03',
    title: 'P2P аренда фототехники',
    text: 'Маркетплейс для краткосрочной аренды профессиональной фото- и видеотехники между операторами с депозитом на смарт-контракте',
    market: 'Marketplace / P2P',
    tag: 'HARDWARE',
  },
  {
    code: '04',
    title: 'Автономный код-ревьюер',
    text: 'Система для глубокого статического анализа и ревью pull requests в GitHub с автоматическим поиском регрессий архитектуры',
    market: 'DevTools & Infra',
    tag: 'AUTOMATION',
  },
];

const EXAMPLE_IDEAS_EN = [
  {
    code: '01',
    title: 'Call Summaries',
    text: 'Automated transcription and executive summary generator for Zoom and Meet calls with 1-click Jira ticket creation',
    market: 'B2B SaaS',
    tag: 'TRANSCRIPTION',
  },
  {
    code: '02',
    title: 'Cofounder Matching',
    text: 'Startup cofounder matchmaking platform featuring profile swipes, GitHub commit verification, and psychological fit assessment',
    market: 'Consumer Mobile',
    tag: 'NETWORKING',
  },
  {
    code: '03',
    title: 'P2P Camera Rental',
    text: 'Peer-to-peer equipment sharing marketplace for professional photo and cinema gear with automated escrow deposits',
    market: 'Marketplace / P2P',
    tag: 'HARDWARE',
  },
  {
    code: '04',
    title: 'Autonomous Code Reviewer',
    text: 'AI system for deep static analysis, security vetting, and architectural regression detection in GitHub pull requests',
    market: 'DevTools & Infra',
    tag: 'AUTOMATION',
  },
];

const TARGET_MARKETS = [
  'B2B SaaS',
  'Consumer Mobile',
  'Marketplace / P2P',
  'DevTools & Infra',
  'FinTech & Web3',
];

const PLACEHOLDERS_RU = [
  'Сервис расшифровки и саммари встреч в Zoom с генерацией задач в Jira...',
  'Платформа поиска кофаундеров по GitHub коммитам и стеку навыков...',
  'P2P маркетплейс аренды профессиональной фототехники со смарт-страховкой...',
  'Система автоматического ревью pull requests и выявления архитектурных долгов...',
];

const PLACEHOLDERS_EN = [
  'Automated meeting transcript & action items generator for Zoom and Jira...',
  'Cofounder matching platform based on GitHub commits and tech skillsets...',
  'P2P marketplace for renting high-end camera gear with smart escrow...',
  'Autonomous pull request reviewer and architectural regression detector...',
];

export const HeroInput: React.FC<HeroInputProps> = ({
  onAnalyze,
  isLoading,
  initialIdea = '',
  initialMarket = TARGET_MARKETS[0],
}) => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const placeholders = lang === 'en' ? PLACEHOLDERS_EN : PLACEHOLDERS_RU;
  const exampleIdeas = lang === 'en' ? EXAMPLE_IDEAS_EN : EXAMPLE_IDEAS_RU;
  const [ideaText, setIdeaText] = useState(initialIdea);
  const [targetMarket, setTargetMarket] = useState(initialMarket);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (initialIdea) setIdeaText(initialIdea);
    if (initialMarket) setTargetMarket(initialMarket);
  }, [initialIdea, initialMarket]);

  // Typing animation for placeholder
  useEffect(() => {
    if (ideaText.length > 0) return;

    const currentText = placeholders[placeholderIdx % placeholders.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && charPos < currentText.length) {
      timer = setTimeout(() => setCharPos((prev) => prev + 1), 40 + Math.random() * 25);
    } else if (!isDeleting && charPos === currentText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && charPos > 0) {
      timer = setTimeout(() => setCharPos((prev) => prev - 1), 20);
    } else if (isDeleting && charPos === 0) {
      setIsDeleting(false);
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }

    return () => clearTimeout(timer);
  }, [charPos, isDeleting, placeholderIdx, ideaText.length, placeholders]);

  // Subtle mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({ x, y });
  }, []);

  // Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === 'Enter' &&
        ideaText.trim().length >= 8 &&
        !isLoading
      ) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ideaText, targetMarket, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ideaText.trim() || ideaText.trim().length < 8) {
      setError(t('hero_error_short'));
      return;
    }
    setError('');
    onAnalyze(ideaText.trim(), targetMarket);
  };

  const handleSelectExample = (example: (typeof EXAMPLE_IDEAS_RU)[0]) => {
    setIdeaText(example.text);
    setTargetMarket(example.market);
    setError('');
    textareaRef.current?.focus();
  };

  const scrollToInput = () => {
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textareaRef.current?.focus();
  };

  const maxChars = 400;
  const charRatio = Math.min(ideaText.length / maxChars, 1);
  const circumference = 2 * Math.PI * 14;
  const strokeDashoffset = circumference * (1 - charRatio);
  const ringColor = charRatio > 0.9 ? '#f43f5e' : charRatio > 0.7 ? '#f59e0b' : '#38bdf8';

  const currentPlaceholderString = placeholders[placeholderIdx % placeholders.length] || '';
  const animatedPlaceholder = currentPlaceholderString.substring(0, charPos);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-24">
      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative text-center space-y-8">
        {/* Primary Statement Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-[-0.04em] leading-[1.02]">
            {t('hero_headline_1')}
            <br />
            <span className="text-neutral-400">{t('hero_headline_2')}</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed tracking-normal">
            {t('hero_subtitle')}
          </p>
        </motion.div>

        {/* ============================================================ */}
        {/* INTERACTIVE IDEA INPUT (Focal Object) */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative max-w-3xl mx-auto text-left"
        >

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="relative group/input"
          >
            {/* Subtle Specular Glow Rim */}
            <div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(450px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.12), transparent 50%)`,
              }}
            />

            {/* Container Card */}
            <div
              className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                isFocused
                  ? 'border-white/30 bg-[#0e1017] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)]'
                  : 'border-white/[0.1] bg-[#0c0d12] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)]'
              }`}
            >
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                {/* Header: Segment Selector + Technical Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      IDEA / 01
                    </span>
                    <span className="text-neutral-600">→</span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      {t('hero_market_label')}
                    </span>
                  </div>

                  {/* Market Pills */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {TARGET_MARKETS.map((market) => (
                      <button
                        key={market}
                        type="button"
                        onClick={() => setTargetMarket(market)}
                        className={`relative px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                          targetMarket === market
                            ? 'text-white bg-white/[0.12] border border-white/[0.18]'
                            : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                        }`}
                      >
                        {market}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea with Animated Placeholder & Character Ring */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={ideaText}
                    onChange={(e) => {
                      setIdeaText(e.target.value);
                      if (error) setError('');
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    rows={4}
                    placeholder={animatedPlaceholder + (ideaText.length === 0 ? '|' : '')}
                    className="w-full bg-[#12141c]/80 border border-white/[0.08] rounded-xl p-4 pr-14 text-white placeholder-neutral-500/70 text-sm focus:border-white/30 transition-all resize-none font-normal leading-relaxed"
                    maxLength={maxChars}
                  />

                  {/* SVG Telemetry Char Counter Ring */}
                  <div className="absolute right-3.5 bottom-3.5 flex items-center justify-center">
                    <svg width="34" height="34" viewBox="0 0 36 36" className="transform -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="2.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-[9px] font-mono text-neutral-400 tabular-nums">
                      {ideaText.length > 0 ? ideaText.length : ''}
                    </span>
                  </div>
                </div>

                {/* Validation Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      className="text-xs text-rose-400 font-mono"
                    >
                      [ERR] {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {/* Primary CTA with animated arrow */}
                  <NeonButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    showArrow={true}
                    className="w-full sm:w-auto font-display uppercase tracking-tight"
                  >
                    <span>{t('hero_submit')}</span>
                  </NeonButton>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Start Presets (Minimalist Cards) */}
          <div className="mt-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                {t('hero_presets_label')}
              </span>
              <span className="text-[10px] font-mono text-neutral-600">{t('hero_presets_click')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {exampleIdeas.map((ex) => (
                <button
                  key={ex.code}
                  type="button"
                  onClick={() => handleSelectExample(ex)}
                  className="group flex items-start gap-3 p-3 rounded-xl bg-[#0e1016] hover:bg-[#141720] border border-white/[0.06] hover:border-white/[0.18] transition-all text-left"
                >
                  <span className="text-[11px] font-mono font-bold text-neutral-500 group-hover:text-white transition-colors pt-0.5">
                    {ex.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-display font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                        {ex.title}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-neutral-500 px-1 rounded bg-white/[0.03]">
                        {ex.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {ex.text}
                    </p>
                  </div>
                  <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs font-mono">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. HOW IT WORKS (3 Steps Editorial Flow) */}
      {/* ============================================================ */}
      <ScrollReveal variant="fade-up" duration={700}>
      <section className="space-y-8 pt-8 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
              {t('how_label')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
              {t('how_title')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScrollReveal variant="fade-up" staggerIndex={0} staggerDelay={120}>
          <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-4">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono text-sm font-bold text-white">
              01
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-display font-semibold uppercase text-white tracking-tight">
                {t('how_step1_title')}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {t('how_step1_desc')}
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 uppercase">
              ● SEMANTIC VECTOR EXTRACTION
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" staggerIndex={1} staggerDelay={120}>

          <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-4">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono text-sm font-bold text-white">
              02
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-display font-semibold uppercase text-white tracking-tight">
                {t('how_step2_title')}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {t('how_step2_desc')}
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 uppercase">
              ● REAL-TIME WEB SEARCH TELEMETRY
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" staggerIndex={2} staggerDelay={120}>

          <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-4">
            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono text-sm font-bold text-white">
              03
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-display font-semibold uppercase text-white tracking-tight">
                {t('how_step3_title')}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {t('how_step3_desc')}
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 uppercase">
              ● 5-AXIS VIABILITY MATRIX
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>
      </ScrollReveal>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE SIMULATION & STRESS-TEST LAB */}
      {/* ============================================================ */}
      <ScrollReveal variant="scale-up" duration={700}>
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">
              {t('lab_subtitle')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
              {t('lab_title')}
            </h2>
          </div>
        </div>

        {/* Live Interactive Stress & Viability Simulator */}
        <StartupStressLab ideaTitle={ideaText.trim() ? ideaText.trim().substring(0, 30) : 'YOUR STARTUP'} />
      </section>
      </ScrollReveal>

      {/* ============================================================ */}
      {/* 4. UNIQUENESS ENGINE (Defensibility & Architecture) */}
      {/* ============================================================ */}
      <ScrollReveal variant="blur-in" duration={800}>
      <section className="space-y-8 pt-8 border-t border-white/[0.06]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
            {t('uniqueness_engine_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-300" />
                <h4 className="text-sm font-display font-bold uppercase text-white tracking-tight">
                  {t('uniqueness_card1_title')}
                </h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {t('uniqueness_card1_desc')}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] text-neutral-300 flex items-center justify-between">
              <span>CRUNCHBASE / PRODUCTHUNT / YC</span>
              <span className="text-emerald-400">● VERIFIED</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0e14] border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-300" />
                <h4 className="text-sm font-display font-bold uppercase text-white tracking-tight">
                  {t('uniqueness_card2_title')}
                </h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {t('uniqueness_card2_desc')}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] text-neutral-300 flex items-center justify-between">
              <span>COGNITIVE BIAS AUDIT</span>
              <span className="text-cyan-400">● 5-AXIS RADAR</span>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ============================================================ */}
      {/* 5. FINAL STATEMENT CTA */}
      {/* ============================================================ */}
      <ScrollReveal variant="slide-up" duration={800}>
      <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-b from-[#0e1018] to-[#08090c] border border-white/[0.1] space-y-6">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold uppercase text-white tracking-tight leading-[1.05] max-w-2xl mx-auto">
          DON'T JUST BUILD AN IDEA.
          <br />
          <span className="text-neutral-400">UNDERSTAND IT.</span>
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          {t('final_cta_desc')}
        </p>

        <div className="pt-2">
          <NeonButton
            variant="primary"
            size="lg"
            onClick={scrollToInput}
            showArrow={true}
            className="font-display uppercase tracking-tight"
          >
            <span>{t('hero_submit')}</span>
          </NeonButton>
        </div>
      </section>
      </ScrollReveal>
    </div>
  );
};
