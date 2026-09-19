import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ValidationReport } from './lib/types';
import { runFullAudit } from './lib/analyzerEngine';
import { Navbar } from './components/layout/Navbar';
import { HeroInput } from './components/analyzer/HeroInput';
import { CinematicScanner } from './components/analyzer/CinematicScanner';
import { DashboardResults } from './components/analyzer/DashboardResults';
import { HistoryDrawer } from './components/analyzer/HistoryDrawer';

const STORAGE_KEY_HISTORY = 'antigravity_validator_history_v1';

export function App() {
  const [view, setView] = useState<'input' | 'scanning' | 'results'>('input');
  const [pendingAnalysis, setPendingAnalysis] = useState({ idea: '', market: '', apiKey: '' });
  const [currentReport, setCurrentReport] = useState<ValidationReport | null>(null);
  const [history, setHistory] = useState<ValidationReport[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from LocalStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
  }, []);

  const saveToHistory = (newReport: ValidationReport) => {
    setHistory((prev) => {
      const updated = [newReport, ...prev.filter((item) => item.id !== newReport.id)].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist history', e);
      }
      return updated;
    });
  };

  const handleStartAnalysis = (idea: string, market: string, apiKey: string) => {
    setPendingAnalysis({ idea, market, apiKey });
    setView('scanning');
  };

  const handleScanComplete = async () => {
    const report = await runFullAudit(
      pendingAnalysis.idea,
      pendingAnalysis.market,
      pendingAnalysis.apiKey
    );
    setCurrentReport(report);
    saveToHistory(report);
    setView('results');
  };

  const handleSelectHistoryItem = (report: ValidationReport) => {
    setCurrentReport(report);
    setView('results');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOneHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <div className="relative min-h-screen bg-[#07080b] text-neutral-200 flex flex-col justify-between selection:bg-white/20 selection:text-white">
      {/* Subtle technical background */}
      <div className="fixed inset-0 bg-subtle-mesh pointer-events-none z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-ambient-cone pointer-events-none z-0" />

      {/* Navigation Header */}
      <div className="relative z-20">
        <Navbar
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onNewIdea={() => setView('input')}
        />
      </div>

      {/* Main Dynamic View Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {view === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <HeroInput
                onAnalyze={handleStartAnalysis}
                isLoading={false}
              />
            </motion.div>
          )}

          {view === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <CinematicScanner onComplete={handleScanComplete} />
            </motion.div>
          )}

          {view === 'results' && currentReport && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardResults
                report={currentReport}
                onReset={() => setView('input')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Refined Minimalist Footer */}
      <footer className="relative z-10 py-5 border-t border-white/[0.06] text-xs text-neutral-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Antigravity Venture Audit • Precision Telemetry</span>
          <span className="text-neutral-400">
            Powered by Google Gemini Search Grounding
          </span>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onClear={handleClearHistory}
        onDeleteOne={handleDeleteOneHistory}
      />
    </div>
  );
}

export default App;
