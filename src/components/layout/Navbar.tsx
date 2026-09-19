import React from 'react';
import { Clock } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onNewIdea: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onNewIdea,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-[#07080b]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand - Minimalist Studio Monomark */}
        <button
          onClick={onNewIdea}
          className="flex items-center gap-2.5 text-left cursor-pointer select-none group"
        >
          <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs font-mono shadow-sm">
            AG
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
              Antigravity
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-400">
              VENTURE AUDIT
            </span>
          </div>
        </button>

        {/* Right Tools - Just History */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#12141c] hover:bg-[#181b26] border border-white/[0.08] hover:border-white/[0.15] text-xs font-mono text-neutral-300 hover:text-white transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>История</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1 rounded bg-white/10 text-neutral-200">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
