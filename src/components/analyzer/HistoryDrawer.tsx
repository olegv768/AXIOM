import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ValidationReport } from '@/lib/types';
import { X, Clock, Trash2, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ValidationReport[];
  onSelect: (report: ValidationReport) => void;
  onClear: () => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  onDeleteOne,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0c0e14] border-l border-white/[0.08] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">История аудитов</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-400">
                  {history.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClear}
                    title="Очистить историю"
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-neutral-500 hover:text-white rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 font-mono text-xs">
                  <Clock className="w-10 h-10 stroke-[1.5] mb-3 opacity-30 text-neutral-400" />
                  <p className="font-medium text-neutral-300">История пуста</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Проведенные аудиты сохраняются локально
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const dateStr = new Date(item.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={item.id}
                      className="group p-3.5 rounded-lg bg-[#11141c] hover:bg-[#161a24] border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer relative"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                              item.uniquenessScore >= 75
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : item.uniquenessScore >= 50
                                ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            }`}
                          >
                            {item.uniquenessScore}%
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {dateStr}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteOne(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-rose-400 rounded transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-relaxed">
                        {item.ideaText}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span>{item.targetMarket}</span>
                        <span className="text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Открыть <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
