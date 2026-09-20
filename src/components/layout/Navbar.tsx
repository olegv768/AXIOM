import React, { useState, useEffect } from 'react';
import { Compass, Crosshair, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export type NavView = 'input' | 'query_history' | 'my_history';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: NavView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.18)]'
          : 'py-4 backdrop-blur-md'
      }`}
      style={{
        backgroundColor: isScrolled
          ? 'color-mix(in srgb, var(--bg-nav) 95%, transparent)'
          : 'var(--bg-nav)',
        borderBottom: `1px solid var(--border-subtle)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* BRAND */}
        <button
          onClick={() => onNavigate('input')}
          className="flex items-center gap-2.5 text-left cursor-pointer select-none group/brand"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono transition-all"
            style={{
              background: 'var(--border-subtle)',
              border: `1px solid var(--border-mid)`,
              color: 'var(--text-primary)',
            }}
          >
            ◎
          </div>

          <div className="flex items-center gap-2">
            <span
              className="font-display font-bold text-sm tracking-tight uppercase transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              AXIOM
            </span>
          </div>
        </button>

        {/* Center / Navigation Menu */}
        <nav
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: 'var(--border-subtle)',
            border: `1px solid var(--border-subtle)`,
          }}
        >
          <NavBtn
            active={currentView === 'input' || currentView === 'scanning' || currentView === 'results'}
            onClick={() => onNavigate('input')}
            isLight={isLight}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav_validate')}</span>
            <span className="sm:hidden">{t('nav_validate_short')}</span>
          </NavBtn>

          <NavBtn
            active={currentView === 'query_history'}
            onClick={() => onNavigate('query_history')}
            isLight={isLight}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav_benchmarks')}</span>
            <span className="sm:hidden">{t('nav_benchmarks_short')}</span>
          </NavBtn>

          <NavBtn
            active={currentView === 'my_history'}
            onClick={() => onNavigate('my_history')}
            isLight={isLight}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav_about')}</span>
            <span className="sm:hidden">{t('nav_about_short')}</span>
          </NavBtn>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            title="Switch language"
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--border-subtle)',
              border: `1px solid var(--border-mid)`,
              color: 'var(--text-secondary)',
            }}
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--border-subtle)',
              border: `1px solid var(--border-mid)`,
              color: 'var(--text-secondary)',
            }}
          >
            {isLight ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </button>

          {/* CTA */}
          {currentView !== 'input' ? (
            <button
              onClick={() => onNavigate('input')}
              className="group/cta px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-body)',
              }}
            >
              <span>{t('nav_new_audit')}</span>
              <span className="transition-transform duration-200 group-hover/cta:translate-x-0.5">→</span>
            </button>
          ) : (
            <button
              onClick={() => {
                const el = document.querySelector('textarea');
                el?.focus();
              }}
              className="group/cta hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{
                background: 'var(--border-subtle)',
                border: `1px solid var(--border-mid)`,
                color: 'var(--text-secondary)',
              }}
            >
              <span>{t('nav_validate')}</span>
              <span className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5">↗</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const NavBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  isLight: boolean;
  children: React.ReactNode;
}> = ({ active, onClick, isLight, children }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5"
    style={
      active
        ? {
            background: 'var(--text-primary)',
            color: 'var(--bg-body)',
            fontWeight: 600,
          }
        : {
            color: 'var(--text-muted)',
          }
    }
    onMouseEnter={e => {
      if (!active) {
        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
        (e.currentTarget as HTMLElement).style.background = 'var(--border-subtle)';
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }
    }}
  >
    {children}
  </button>
);
