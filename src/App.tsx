import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ValidationReport } from './lib/types';
import { runFullAudit } from './lib/analyzerEngine';
import { CURATED_QUERIES } from './lib/curatedQueries';
import { Navbar, NavView } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroInput } from './components/analyzer/HeroInput';
import { CinematicScanner } from './components/analyzer/CinematicScanner';
import { DashboardResults } from './components/analyzer/DashboardResults';
import { QueryHistoryPage } from './components/pages/QueryHistoryPage';
import { MyHistoryPage } from './components/pages/MyHistoryPage';
import { SpatialBackground } from './components/ui/SpatialBackground';
import { CustomCursor } from './components/ui/CustomCursor';

const STORAGE_KEY_HISTORY = 'axiom_validator_history_v1';
const LEGACY_STORAGE_KEY_HISTORY = 'antigravity_validator_history_v1';
const STORAGE_KEY_STARRED = 'axiom_validator_starred_v1';
const LEGACY_STORAGE_KEY_STARRED = 'antigravity_validator_starred_v1';

export type AppView = 'input' | 'scanning' | 'results' | 'query_history' | 'my_history';

export function App() {
  const [view, setView] = useState<AppView>('input');
  const [currentReport, setCurrentReport] = useState<ValidationReport | null>(null);
  const [history, setHistory] = useState<ValidationReport[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [activeAuditPromise, setActiveAuditPromise] = useState<Promise<ValidationReport> | null>(null);
  const [draftIdea, setDraftIdea] = useState<{ idea: string; market: string } | null>(null);

  // Load history & starred items from LocalStorage
  useEffect(() => {
    try {
      const savedHistory =
        localStorage.getItem(STORAGE_KEY_HISTORY) ||
        localStorage.getItem(LEGACY_STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedStarred =
        localStorage.getItem(STORAGE_KEY_STARRED) ||
        localStorage.getItem(LEGACY_STORAGE_KEY_STARRED);
      if (savedStarred) {
        setStarredIds(JSON.parse(savedStarred));
      }
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
  }, []);

  // Save report to history
  const saveToHistory = (newReport: ValidationReport) => {
    setHistory((prev) => {
      const updated = [newReport, ...prev.filter((item) => item.id !== newReport.id)].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist history', e);
      }
      return updated;
    });
  };

  // Toggle favorite / starred
  const handleToggleStar = (id: string) => {
    setStarredIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist starred items', e);
      }
      return updated;
    });
  };

  // Start analysis: immediately fire API and pass promise to scanner
  const handleStartAnalysis = (idea: string, market: string) => {
    const promise = runFullAudit(idea, market, '');
    setActiveAuditPromise(promise);
    setView('scanning');
  };

  // Scanner completes when API promise resolves
  const handleScanComplete = (report: ValidationReport) => {
    setCurrentReport(report);
    saveToHistory(report);
    setView('results');
  };

  const handleSelectReport = (report: ValidationReport) => {
    setCurrentReport(report);
    setView('results');
  };

  const handleUseAsTemplate = (idea: string, market: string) => {
    setDraftIdea({ idea, market });
    setView('input');
  };

  const handleClearHistory = () => {
    setHistory([]);
    setStarredIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      localStorage.removeItem(STORAGE_KEY_STARRED);
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
    setStarredIds((prev) => {
      const updated = prev.filter((item) => item !== id);
      try {
        localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleNavigate = (newView: NavView) => {
    setView(newView);
  };

  // Combine user history and curated dataset for "История запросов"
  const allQueries = useMemo(() => {
    const map = new Map<string, ValidationReport>();
    // Add user history first
    history.forEach((h) => map.set(h.id, h));
    // Add curated queries
    CURATED_QUERIES.forEach((c) => {
      if (!map.has(c.id)) {
        map.set(c.id, c);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
  }, [history]);

  return (
    <div className="relative min-h-screen text-neutral-200 flex flex-col justify-between selection:bg-white/20 selection:text-white theme-transition" style={{ backgroundColor: 'var(--bg-body)', color: 'var(--text-primary)' }}>
      {/* Precision Custom Pointer */}
      <CustomCursor />

      {/* Spatial Interactive Background Grid & Coordinates */}
      <SpatialBackground />

      {/* Header Navigation */}
      <Navbar
        currentView={view}
        onNavigate={handleNavigate}
      />

      {/* Main Dynamic View Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {view === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HeroInput
                onAnalyze={handleStartAnalysis}
                isLoading={false}
                initialIdea={draftIdea?.idea}
                initialMarket={draftIdea?.market}
              />
            </motion.div>
          )}

          {view === 'scanning' && activeAuditPromise && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <CinematicScanner
                auditPromise={activeAuditPromise}
                onComplete={handleScanComplete}
              />
            </motion.div>
          )}

          {view === 'results' && currentReport && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <DashboardResults
                report={currentReport}
                onReset={() => setView('input')}
              />
            </motion.div>
          )}

          {view === 'query_history' && (
            <motion.div
              key="query_history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <QueryHistoryPage
                allReports={allQueries}
                onSelectReport={handleSelectReport}
                onUseAsTemplate={handleUseAsTemplate}
                onNewAnalysis={() => setView('input')}
              />
            </motion.div>
          )}

          {view === 'my_history' && (
            <motion.div
              key="my_history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MyHistoryPage
                history={history}
                starredIds={starredIds}
                onSelectReport={handleSelectReport}
                onToggleStar={handleToggleStar}
                onDeleteOne={handleDeleteOneHistory}
                onClearAll={handleClearHistory}
                onNewAnalysis={() => setView('input')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Upgraded Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
