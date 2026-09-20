import React from 'react';
import {
  ArrowUp,
  ArrowRight,
  Activity,
  Layers,
  Globe,
  Compass,
  Crosshair,
  User,
} from 'lucide-react';
import { NavView } from './Navbar';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface FooterProps {
  onNavigate: (view: NavView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAnalysis = () => {
    onNavigate('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      textarea?.focus();
    }, 150);
  };

  const capItemCls = 'group flex items-center gap-2 transition-colors cursor-pointer w-fit';
  const dotCls = 'w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.9)]';
  const underlineCls = "relative pb-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 group-hover:after:w-full";

  return (
    <footer
      className="relative z-10 text-xs overflow-hidden theme-transition"
      style={{
        borderTop: `1px solid var(--border-subtle)`,
        backgroundColor: 'var(--bg-body)',
        color: 'var(--text-secondary)',
      }}
    >
      {/* Ambient gradient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 pointer-events-none blur-2xl"
        style={{ background: `linear-gradient(to bottom, var(--border-mid), transparent)` }}
      />

      {/* Top gradient line */}
      <div className="h-[1px] w-full" style={{ background: `linear-gradient(to right, transparent, var(--border-active), transparent)` }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 space-y-12">

        {/* 1. CTA Banner */}
        <div
          className="relative overflow-hidden p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
          style={{
            background: isLight
              ? 'linear-gradient(to right, #eef2fa, #f4f7fc, #eef2fa)'
              : 'linear-gradient(to right, #0d1017, #0a0d14, #0d1017)',
            border: `1px solid var(--border-mid)`,
          }}
        >
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">
                {t('footer_cta_label')}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {t('footer_cta_title')}
            </h3>
            <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
              {t('footer_cta_desc')}
            </p>
          </div>

          <button
            onClick={handleStartAnalysis}
            className="group px-5 py-3 rounded-xl font-semibold font-mono text-xs flex items-center gap-2 shadow-lg shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-body)',
            }}
          >
            <span>{t('footer_cta_btn')}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 2. Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pt-4">

          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-sm"
                style={{
                  background: 'var(--border-subtle)',
                  border: `1px solid var(--border-mid)`,
                  color: 'var(--text-primary)',
                }}
              >
                ◎
              </div>
              <span className="font-display font-bold text-base tracking-tight uppercase" style={{ color: 'var(--text-primary)' }}>
                AXIOM
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm font-sans" style={{ color: 'var(--text-secondary)' }}>
              {t('footer_brand_desc')}
            </p>
          </div>

          {/* Col 2: Capabilities */}
          <div className="lg:col-span-3 space-y-3 font-mono">
            <div className="text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              <span>{t('footer_capabilities')}</span>
            </div>
            <ul className="space-y-2 text-xs font-sans">
              {[
                t('footer_cap_stress'),
                t('footer_cap_radar'),
                t('footer_cap_unit'),
                t('footer_cap_search'),
              ].map((cap) => (
                <li
                  key={cap}
                  className={capItemCls}
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => onNavigate('input')}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                >
                  <span className={dotCls} style={{ backgroundColor: 'var(--text-muted)' }} />
                  <span className={underlineCls}>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="lg:col-span-2 space-y-3 font-mono">
            <div className="text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('footer_sections')}</span>
            </div>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <button
                  onClick={() => onNavigate('input')}
                  className="group flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                >
                  <Crosshair className="w-3 h-3 transition-colors" style={{ color: 'var(--text-muted)' }} />
                  <span className={underlineCls}>{t('footer_validate')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('query_history')}
                  className="group flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                >
                  <Globe className="w-3 h-3 transition-colors" style={{ color: 'var(--text-muted)' }} />
                  <span className={underlineCls}>{t('footer_benchmarks')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my_history')}
                  className="group flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                >
                  <User className="w-3 h-3 transition-colors" style={{ color: 'var(--text-muted)' }} />
                  <span className={underlineCls}>{t('footer_about')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech Stack */}
          <div className="lg:col-span-3 space-y-3 font-mono">
            <div className="text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('footer_tech')}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                [t('footer_tech_engine'), 'Gemini 3.8 Fast'],
                [t('footer_tech_arch'), 'React 18 + Vite'],
                [t('footer_tech_types'), 'Strict TypeScript'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    background: 'var(--border-subtle)',
                    border: `1px solid var(--border-subtle)`,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{label}</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]"
          style={{ borderTop: `1px solid var(--border-subtle)`, color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} AXIOM. {t('footer_copyright')}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 group font-mono text-xs px-2.5 py-1 rounded-md transition-colors"
            style={{
              color: 'var(--text-secondary)',
              background: 'var(--border-subtle)',
              border: `1px solid var(--border-subtle)`,
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
          >
            <span>{t('footer_scroll_top')}</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
