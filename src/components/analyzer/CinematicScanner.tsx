import React, { useEffect, useState, useRef } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Search, Activity, Terminal } from 'lucide-react';
import { ValidationReport } from '@/lib/types';

interface CinematicScannerProps {
  auditPromise: Promise<ValidationReport>;
  onComplete: (report: ValidationReport) => void;
  onError?: (error: Error) => void;
}

interface ScanStep {
  id: number;
  title: string;
  subtitle: string;
  subStatus: string;
}

const SCAN_STEPS: ScanStep[] = [
  {
    id: 1,
    title: 'Семантический разбор ценностного предложения',
    subtitle: 'Анализ формулировки гипотезы, целевой роли и истинной боли клиента',
    subStatus: 'Индексация формулировки и сегмента рынка...',
  },
  {
    id: 2,
    title: 'Сверка по базам ProductHunt, Crunchbase и открытым реестрам',
    subtitle: 'Поиск прямых аналогов в батчах акселераторов и венчурных раундах',
    subStatus: 'Live Search: парсинг реальных сайтов и похожих продуктов...',
  },
  {
    id: 3,
    title: 'Стресс-тест юнит-экономики и барьеров перехода',
    subtitle: 'Моделирование CAC/LTV, уязвимости перед платформами и Switching Cost',
    subStatus: 'Стресс-тест юнит-экономики и барьеров переключения...',
  },
  {
    id: 4,
    title: 'Синтез Blue Ocean векторов и расчет индекса уникальности',
    subtitle: 'Выявление скрытых точек отказа и стратегий переупаковки',
    subStatus: 'Синтез Blue Ocean векторов и финальная сборка отчета...',
  },
];

export const CinematicScanner: React.FC<CinematicScannerProps> = ({
  auditPromise,
  onComplete,
  onError,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(4);
  const [statusMessage, setStatusMessage] = useState(SCAN_STEPS[0].subStatus);
  const [isFinished, setIsFinished] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const reportRef = useRef<ValidationReport | null>(null);
  const isApiResolved = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Listen to API promise
  useEffect(() => {
    let isCancelled = false;

    auditPromise
      .then((report) => {
        if (isCancelled) return;
        reportRef.current = report;
        isApiResolved.current = true;
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Scanner caught error from audit:', err);
        setScanError(err.message || 'Ошибка обработки запроса');
        if (onError) onError(err);
      });

    return () => {
      isCancelled = true;
    };
  }, [auditPromise, onError]);

  // Dynamic realistic progress loop synced with real time
  useEffect(() => {
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // in seconds

      // If API has resolved
      if (isApiResolved.current && reportRef.current) {
        setProgress((prev) => {
          const next = prev + 8; // rapidly tween to 100%
          if (next >= 100) {
            clearInterval(interval);
            setCurrentStepIndex(4);
            setIsFinished(true);
            setStatusMessage('Анализ завершен • Переход к результатам...');

            // Short transition delay so the user sees the crisp 100% completion
            setTimeout(() => {
              if (reportRef.current) {
                onComplete(reportRef.current);
              }
            }, 450);

            return 100;
          }
          return next;
        });
        return;
      }

      // If still waiting for API: calculate realistic asymptotic progress
      // Timeline curve designed for 15-30s typical live LLM search response:
      // 0-3s: reaches ~28% (Step 1)
      // 3-9s: reaches ~58% (Step 2)
      // 9-16s: reaches ~78% (Step 3)
      // 16-30s+: crawls slowly from 80% to 94% (Step 4)
      let targetProgress = 5;

      if (elapsed < 3) {
        targetProgress = (elapsed / 3) * 26 + 4;
        setCurrentStepIndex(0);
        setStatusMessage(SCAN_STEPS[0].subStatus);
      } else if (elapsed < 8.5) {
        targetProgress = 30 + ((elapsed - 3) / 5.5) * 28;
        setCurrentStepIndex(1);
        setStatusMessage(SCAN_STEPS[1].subStatus);
      } else if (elapsed < 16) {
        targetProgress = 58 + ((elapsed - 8.5) / 7.5) * 22;
        setCurrentStepIndex(2);
        setStatusMessage(SCAN_STEPS[2].subStatus);
      } else {
        // Asymptotic crawl between 80% and 95%
        const extraTime = elapsed - 16;
        targetProgress = Math.min(95, 80 + Math.atan(extraTime / 10) * 12);
        setCurrentStepIndex(3);
        setStatusMessage(SCAN_STEPS[3].subStatus);
      }

      setProgress((prev) => {
        // Smoothly interpolate towards target
        const diff = targetProgress - prev;
        return prev + diff * 0.25;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (scanError) {
    return (
      <div className="w-full max-w-xl mx-auto py-12 px-6 text-center space-y-4 rounded-xl bg-[#0e1017] border border-rose-500/20">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-white">Ошибка выполнения анализа</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">{scanError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const roundedProgress = Math.min(100, Math.round(progress));

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center gap-8">
      {/* Dynamic Progress Telemetry */}
      <div className="w-full text-center space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-neutral-300 uppercase tracking-wider">LIVE TELEMETRY AUDIT</span>
          </div>

          <span className="text-3xl font-semibold font-mono text-white tabular-nums tracking-tight">
            {roundedProgress}%
          </span>
        </div>

        {/* Crisp Linear Progress Bar */}
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isFinished
                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                : 'bg-gradient-to-r from-neutral-200 via-white to-sky-300'
            }`}
            style={{ width: `${roundedProgress}%` }}
          />
        </div>

        {/* Live Status Subtitle */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-mono min-h-[22px]">
          {!isFinished ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400 flex-shrink-0" />
              <span className="truncate">{statusMessage}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-300 font-medium">Отчет сформирован! Открываем дашборд...</span>
            </>
          )}
        </div>
      </div>

      {/* Sequential Analysis Steps */}
      <div className="w-full space-y-2">
        {SCAN_STEPS.map((step, idx) => {
          const isDone = isFinished || currentStepIndex > idx;
          const isCurrent = !isFinished && currentStepIndex === idx;

          return (
            <div
              key={step.id}
              className={`px-4 py-3 rounded-lg border transition-all flex items-center justify-between text-xs ${
                isCurrent
                  ? 'bg-[#121520] border-white/[0.14] text-white shadow-sm'
                  : isDone
                  ? 'bg-[#0b0d13] border-white/[0.04] text-neutral-400'
                  : 'bg-transparent border-transparent text-neutral-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono w-4 ${
                    isCurrent ? 'text-white' : isDone ? 'text-emerald-400' : 'text-neutral-700'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div>
                  <div
                    className={`font-sans font-medium ${
                      isCurrent
                        ? 'text-neutral-100'
                        : isDone
                        ? 'text-neutral-300'
                        : 'text-neutral-600'
                    }`}
                  >
                    {step.title}
                  </div>
                  {isCurrent && (
                    <div className="font-sans text-[11px] text-neutral-400 mt-0.5 animate-fadeIn">
                      {step.subtitle}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 ml-4 font-mono text-[10px]">
                {isDone ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    готов
                  </span>
                ) : isCurrent ? (
                  <span className="text-sky-300 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    в работе
                  </span>
                ) : (
                  <span className="text-neutral-700">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust pill */}
      <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 pt-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          Multi-source Grounding
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          Unit Economics Stress-Test
        </span>
      </div>
    </div>
  );
};
