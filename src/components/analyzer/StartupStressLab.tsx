import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Flame,
  Snowflake,
  Rocket,
  Activity,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  Scale,
  Radar,
  Info
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface StartupStressLabProps {
  ideaTitle?: string;
  className?: string;
}

type Mode = 'SCENARIOS' | 'RADAR' | 'UNIT_LEVERS';

interface ScenarioDef {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  baseSurvival: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  threatDescription: string;
  vulnerability: string;
  mitigations: {
    id: string;
    label: string;
    impact: number;
    description: string;
  }[];
  strategicAdvice: string;
}

const SCENARIOS_RU: ScenarioDef[] = [
  {
    id: 'bigtech',
    name: 'Атака бигтеха',
    shortLabel: 'Big Tech Clone',
    icon: Flame,
    tagline: 'Google, OpenAI или Microsoft выкатывают бесплатный аналог вашей ключевой фичи',
    baseSurvival: 38,
    threatLevel: 'CRITICAL',
    threatDescription: 'Риск потери 65% поверхностных лидов из-за нулевой стоимости альтернативы от IT-гиганта.',
    vulnerability: 'Интерфейсная обёртка без закрытого слоя данных легко повторяется за 2 спринта.',
    mitigations: [
      {
        id: 'prop_data',
        label: 'Закрытый датасет и проприетарные пайплайны',
        impact: 24,
        description: 'Обучение на данных, к которым у внешних LLM нет доступа (внутренние CRM/ERP/базы).'
      },
      {
        id: 'workflow_lock',
        label: 'Глубокий интеграционный Lock-In в B2B',
        impact: 22,
        description: 'Высокая стоимость смены софта: интеграция в критические операционные процессы клиентов.'
      },
      {
        id: 'community_brand',
        label: 'Нишевый бренд и комьюнити экспертов',
        impact: 16,
        description: 'Лояльное сообщество, ориентированное на персонализированный сервис, а не безликую утилиту.'
      }
    ],
    strategicAdvice: 'Не соревнуйтесь в общих моделях. Фокусируйтесь на вертикальной специфике, узких регламентах и непубличных данных отрасли.'
  },
  {
    id: 'cac_spike',
    name: 'Взлёт CAC x3',
    shortLabel: 'CAC Spike x3',
    icon: ShieldAlert,
    tagline: 'Рекламные аукционы перегреты, перформанс-каналы уходят в минус',
    baseSurvival: 34,
    threatLevel: 'CRITICAL',
    threatDescription: 'Юнит-экономика рушится: стоимость привлечения одного платящего клиента превышает 12 месяцев выручки.',
    vulnerability: 'Критическая моно-зависимость от таргета и контекстной рекламы без органического трафика.',
    mitigations: [
      {
        id: 'plg_viral',
        label: 'PLG-петля и виральный K-factor > 1.2',
        impact: 28,
        description: 'Продукт генерирует новых пользователей естественным путём при использовании существующими.'
      },
      {
        id: 'programmatic_seo',
        label: 'Программатик SEO и экспертный контент-движок',
        impact: 20,
        description: 'Создание тысяч страниц под узкочастотные запросы с нулевой стоимостью клика.'
      },
      {
        id: 'b2b_partners',
        label: 'Партнёрская дистрибуция и реселлеры',
        impact: 18,
        description: 'Продажи через интеграторов и смежные сервисы за процент от выручки (RevShare).'
      }
    ],
    strategicAdvice: 'Если ваш LTV/CAC ниже 3.0x при текущих ставках, любой скачок аукциона убьет бизнес. Внедряйте виральные триггеры до масштабирования рекламы.'
  },
  {
    id: 'venture_winter',
    name: 'Венчурная зима',
    shortLabel: 'Zero Capital',
    icon: Snowflake,
    tagline: 'Инвесторы заморозили раунды. Рассчитывать можно только на собственную выручку',
    baseSurvival: 44,
    threatLevel: 'HIGH',
    threatDescription: 'Runway ограничен. Отсутствие быстрого денежного потока приведет к закрытию через несколько месяцев.',
    vulnerability: 'Бизнес-модель с отложенной монетизацией или слишком долгим циклом согласования сделки.',
    mitigations: [
      {
        id: 'annual_upfront',
        label: '100% предоплата за годовые тарифы со скидкой',
        impact: 26,
        description: 'Привлечение операционного кэша от самих клиентов вместо внешнего размытия долей.'
      },
      {
        id: 'lean_infra',
        label: 'Ультра-эффективный стек и Serverless/Edge',
        impact: 16,
        description: 'Сокращение постоянных костов на облако и инфраструктуру до минимальных объемов.'
      },
      {
        id: 'enterprise_pilots',
        label: 'Платные Enterprise-пилоты с первого дня',
        impact: 24,
        description: 'Отказ от бесплатных тестов в пользу платных внедрений с чётким ROI для заказчика.'
      }
    ],
    strategicAdvice: 'Принцип Default Alive: выручка от первого дня важнее абстрактного MAU. Продавайте решение боли, за которую бизнес готов платить картой сразу.'
  },
  {
    id: 'scale_surge',
    name: 'Виральный взрыв x100',
    shortLabel: 'Viral Surge x100',
    icon: Rocket,
    tagline: 'Проект завирусился: миллион визитов за выходные и перегрузка инфраструктуры',
    baseSurvival: 52,
    threatLevel: 'MODERATE',
    threatDescription: 'Отток разочарованных юзеров из-за лагов, лимитов внешних API и краха серверов.',
    vulnerability: 'Синхронные тяжелые вычисления и неоптимизированные запросы к БД.',
    mitigations: [
      {
        id: 'edge_cache',
        label: 'Асинхронные очереди и Edge-кэширование',
        impact: 22,
        description: 'Изоляция тяжелых задач в фоновые воркеры с моментальным ответом интерфейса.'
      },
      {
        id: 'waitlist_vip',
        label: 'Геймифицированный Waitlist с виральным пропуском',
        impact: 20,
        description: 'Дозирование нагрузки с превращением ожидания в маркетинговый ажиотаж.'
      },
      {
        id: 'auto_onboard',
        label: 'Zero-Touch автономный онбординг',
        impact: 18,
        description: 'Самостоятельное подключение пользователей без привлечения живой службы поддержки.'
      }
    ],
    strategicAdvice: 'Виральность быстро сгорает, если первое впечатление испорчено 30-секундной загрузкой. Готовьте инфраструктуру очередей заранее.'
  }
];

const SCENARIOS_EN: ScenarioDef[] = [
  {
    id: 'bigtech',
    name: 'Big Tech Clone',
    shortLabel: 'Big Tech Clone',
    icon: Flame,
    tagline: 'Google, OpenAI, or Microsoft launches a free alternative to your core feature',
    baseSurvival: 38,
    threatLevel: 'CRITICAL',
    threatDescription: 'Risk of losing 65% of top-of-funnel leads due to a zero-cost incumbent alternative.',
    vulnerability: 'Shallow UI wrapper with no proprietary data layer can be duplicated in 2 sprints.',
    mitigations: [
      {
        id: 'prop_data',
        label: 'Proprietary Datasets & Private Pipelines',
        impact: 24,
        description: 'Fine-tuning on internal customer data inaccessible to general frontier LLMs.'
      },
      {
        id: 'workflow_lock',
        label: 'Deep B2B Workflow Integration Lock-In',
        impact: 22,
        description: 'High switching costs: deeply embedded in mission-critical operational processes.'
      },
      {
        id: 'community_brand',
        label: 'Niche Brand & Expert Community',
        impact: 16,
        description: 'Loyal user community anchored around personalized service rather than a generic utility.'
      }
    ],
    strategicAdvice: 'Do not compete on general models. Focus on vertical specificity, narrow regulations, and non-public industry workflows.'
  },
  {
    id: 'cac_spike',
    name: 'CAC Spike x3',
    shortLabel: 'CAC Spike x3',
    icon: ShieldAlert,
    tagline: 'Ad auctions are overheated, performance marketing channels turn unprofitable',
    baseSurvival: 34,
    threatLevel: 'CRITICAL',
    threatDescription: 'Unit economics collapse: customer acquisition cost exceeds 12 months of customer revenue.',
    vulnerability: 'Critical mono-dependence on paid ads without organic acquisition or SEO loops.',
    mitigations: [
      {
        id: 'plg_viral',
        label: 'PLG Loop & Viral K-Factor > 1.2',
        impact: 28,
        description: 'Product naturally generates new users through existing user workflows and invitations.'
      },
      {
        id: 'programmatic_seo',
        label: 'Programmatic SEO & Content Engine',
        impact: 20,
        description: 'Generating targeted long-tail search pages with near-zero marginal acquisition cost.'
      },
      {
        id: 'b2b_partners',
        label: 'Partner Distribution & Resellers',
        impact: 18,
        description: 'Channel sales via system integrators and complementary SaaS tools on revenue share.'
      }
    ],
    strategicAdvice: 'If your LTV/CAC is below 3.0x at baseline rates, any auction inflation is fatal. Build viral triggers prior to scaling paid ads.'
  },
  {
    id: 'venture_winter',
    name: 'Venture Winter',
    shortLabel: 'Zero Capital',
    icon: Snowflake,
    tagline: 'Investors freeze funding rounds. Survival depends strictly on customer cash flow',
    baseSurvival: 44,
    threatLevel: 'HIGH',
    threatDescription: 'Runway is capped. Absence of immediate cash flow leads to shutdown within a few months.',
    vulnerability: 'Business model with deferred monetization or excessively prolonged enterprise sales cycles.',
    mitigations: [
      {
        id: 'annual_upfront',
        label: '100% Upfront Annual Prepayment',
        impact: 26,
        description: 'Funding working capital directly from customers instead of equity dilution.'
      },
      {
        id: 'lean_infra',
        label: 'Ultra-Lean Serverless & Edge Stack',
        impact: 16,
        description: 'Minimizing fixed cloud and model inference overhead to negligible baseline levels.'
      },
      {
        id: 'enterprise_pilots',
        label: 'Paid Enterprise Pilots from Day 1',
        impact: 24,
        description: 'Zero free POCs: charging for deployment with quantifiable customer ROI.'
      }
    ],
    strategicAdvice: 'Default Alive principle: day-one cash flow matters more than vanity MAU. Sell solutions to acute pains businesses pay for immediately.'
  },
  {
    id: 'scale_surge',
    name: 'Viral Surge x100',
    shortLabel: 'Viral Surge x100',
    icon: Rocket,
    tagline: 'Viral breakout: 1M visits over the weekend and infrastructure throttling',
    baseSurvival: 52,
    threatLevel: 'MODERATE',
    threatDescription: 'User churn spikes from latency, third-party API rate limits, and database locks.',
    vulnerability: 'Synchronous compute workloads and unindexed database queries on the critical path.',
    mitigations: [
      {
        id: 'edge_cache',
        label: 'Async Queues & Edge Caching',
        impact: 22,
        description: 'Offloading heavy processing to background workers with instant UI response.'
      },
      {
        id: 'waitlist_vip',
        label: 'Gamified Viral Waitlist System',
        impact: 20,
        description: 'Throttling load while converting excess demand into viral social proof.'
      },
      {
        id: 'auto_onboard',
        label: 'Zero-Touch Autonomous Onboarding',
        impact: 18,
        description: 'Self-serve customer activation with zero manual customer success overhead.'
      }
    ],
    strategicAdvice: 'Virality evaporates quickly if first impressions are ruined by 30-second delays. Architect queue pipelines before scaling.'
  }
];

interface RadarDimension {
  id: string;
  label: string;
  shortLabel: string;
  defaultVal: number;
  description: string;
  actionableTip: string;
}

const RADAR_DIMENSIONS_RU: RadarDimension[] = [
  {
    id: 'tech_moat',
    label: 'Технологический барьер',
    shortLabel: 'Tech Moat',
    defaultVal: 68,
    description: 'Сложность прямого копирования кода и алгоритмов конкурентами.',
    actionableTip: 'Защищайте ноу-хау специализированными пайплайнами обработки данных и тонкими оптимизациями latency.'
  },
  {
    id: 'network_effect',
    label: 'Сетевые эффекты',
    shortLabel: 'Network FX',
    defaultVal: 54,
    description: 'Увеличение ценности продукта для каждого клиента при росте базы.',
    actionableTip: 'Добавляйте совместные рабочие пространства, бенчмаркинг по индустрии и межпользовательский шеринг.'
  },
  {
    id: 'switching_cost',
    label: 'Стоимость переключения',
    shortLabel: 'Switching Cost',
    defaultVal: 72,
    description: 'Сложность для клиента отказаться от вашего сервиса в пользу аналога.',
    actionableTip: 'Накапливайте исторические данные клиента и делайте сервис единым источником правды (Single Source of Truth).'
  },
  {
    id: 'unit_margin',
    label: 'Маржинальность и LTV',
    shortLabel: 'Unit Margin',
    defaultVal: 80,
    description: 'Доля валовой прибыли после оплаты серверов, LLM-токенов и поддержки.',
    actionableTip: 'Кэшируйте типовые запросы и переходите на легковесные fine-tuned модели вместо дорогостоящих общих API.'
  },
  {
    id: 'anti_wrapper',
    label: 'Иммунитет к коммодитизации',
    shortLabel: 'Anti-Wrapper',
    defaultVal: 62,
    description: 'Степень защиты от того, что базовые модели заменят ваш функционал.',
    actionableTip: 'Не продавайте доступ к тексту или картинке — продавайте завершенное бизнес-действие и автоматизацию процесса.'
  },
  {
    id: 'market_timing',
    label: 'Рыночный тайминг',
    shortLabel: 'Market Timing',
    defaultVal: 85,
    description: 'Готовность целевой аудитории платить за решение именно сейчас.',
    actionableTip: 'Ловите тектонические сдвиги в регуляторике или технологиях, пока крупные вендоры неповоротливы.'
  }
];

const RADAR_DIMENSIONS_EN: RadarDimension[] = [
  {
    id: 'tech_moat',
    label: 'Technical Moat',
    shortLabel: 'Tech Moat',
    defaultVal: 68,
    description: 'Difficulty for competitors to clone codebase, algorithms, and latency optimizations.',
    actionableTip: 'Protect know-how with specialized data processing pipelines and sub-second execution speed.'
  },
  {
    id: 'network_effect',
    label: 'Network Effects',
    shortLabel: 'Network FX',
    defaultVal: 54,
    description: 'Marginal value added for every existing user as total user base expands.',
    actionableTip: 'Integrate shared team workspaces, industry benchmark data, and cross-user asset sharing.'
  },
  {
    id: 'switching_cost',
    label: 'Switching Costs',
    shortLabel: 'Switching Cost',
    defaultVal: 72,
    description: 'Cost and friction for customers to migrate to a competing alternative.',
    actionableTip: 'Store proprietary historical workflow data and position your app as the Single Source of Truth.'
  },
  {
    id: 'unit_margin',
    label: 'Unit Margin & LTV',
    shortLabel: 'Unit Margin',
    defaultVal: 80,
    description: 'Gross margin remaining after inference tokens, cloud servers, and support costs.',
    actionableTip: 'Cache repetitive queries and switch to fine-tuned compact models instead of monolithic frontier APIs.'
  },
  {
    id: 'anti_wrapper',
    label: 'Commoditization Immunity',
    shortLabel: 'Anti-Wrapper',
    defaultVal: 62,
    description: 'Resilience against foundation models integrating your core capability natively.',
    actionableTip: 'Do not sell raw text or image generation — sell complete business outcome automation.'
  },
  {
    id: 'market_timing',
    label: 'Market Timing',
    shortLabel: 'Market Timing',
    defaultVal: 85,
    description: 'Target audience readiness to purchase and adopt your solution today.',
    actionableTip: 'Capitalize on regulatory shifts and AI advances while legacy vendors remain inert.'
  }
];

export const StartupStressLab: React.FC<StartupStressLabProps> = ({
  ideaTitle = 'YOUR STARTUP',
  className = ''
}) => {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const scenarios = isEn ? SCENARIOS_EN : SCENARIOS_RU;
  const radarDimensions = isEn ? RADAR_DIMENSIONS_EN : RADAR_DIMENSIONS_RU;

  const [activeMode, setActiveMode] = useState<Mode>('SCENARIOS');
  const [activeScenarioId, setActiveScenarioId] = useState<string>('bigtech');
  const [activatedMitigations, setActivatedMitigations] = useState<Record<string, boolean>>({
    'prop_data': true
  });

  // Radar vector states
  const [radarValues, setRadarValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    RADAR_DIMENSIONS_RU.forEach(d => {
      initial[d.id] = d.defaultVal;
    });
    return initial;
  });
  const [selectedRadarDim, setSelectedRadarDim] = useState<string>('tech_moat');

  // Unit Economics Simulator states
  const [arpu, setArpu] = useState<number>(49);
  const [cac, setCac] = useState<number>(35);
  const [monthlyChurn, setMonthlyChurn] = useState<number>(4.5);
  const [organicShare, setOrganicShare] = useState<number>(40);

  // Active scenario data
  const currentScenario = useMemo(() => {
    return scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  }, [activeScenarioId, scenarios]);

  // Toggle scenario mitigation
  const toggleMitigation = (id: string) => {
    setActivatedMitigations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate live scenario survival score
  const survivalScore = useMemo(() => {
    let score = currentScenario.baseSurvival;
    currentScenario.mitigations.forEach(m => {
      if (activatedMitigations[m.id]) {
        score += m.impact;
      }
    });
    return Math.min(99, Math.max(15, score));
  }, [currentScenario, activatedMitigations]);

  // Overall radar score (Defensibility Quotient)
  const averageRadarScore = useMemo(() => {
    const vals = Object.values(radarValues);
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round(sum / vals.length);
  }, [radarValues]);

  // Unit Economics live calculations
  const unitStats = useMemo(() => {
    const churnDecimal = Math.max(0.005, monthlyChurn / 100);
    const lifetimeMonths = 1 / churnDecimal;
    const grossMargin = 0.85; // 85% SaaS standard
    const ltv = Math.round(arpu * lifetimeMonths * grossMargin);
    const blendedCac = Math.round(cac * (1 - (organicShare / 100)));
    const effectiveCac = Math.max(1, blendedCac);
    const ltvCacRatio = Number((ltv / effectiveCac).toFixed(1));
    const paybackMonths = Number((effectiveCac / (arpu * grossMargin)).toFixed(1));

    let status: { label: string; color: string; desc: string } = {
      label: isEn ? 'EXCELLENT VENTURE MODEL' : 'ОТЛИЧНАЯ ВЕНЧУРНАЯ МОДЕЛЬ',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      desc: isEn ? 'High payback velocity, scale without cash flow depletion risk.' : 'Высокая окупаемость, масштабируемость без риска кассового разрыва.'
    };

    if (ltvCacRatio < 2.0) {
      status = {
        label: isEn ? 'CRITICAL PAYBACK RISK' : 'КРИТИЧЕСКИЙ РИСК ОКУПАЕМОСТИ',
        color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        desc: isEn ? 'Customer acquisition eats all margin. High risk of runway depletion.' : 'Привлечение съедает всю маржу. Высокий риск кассового разрыва.'
      };
    } else if (ltvCacRatio < 3.0) {
      status = {
        label: isEn ? 'BORDERLINE MODEL (BOOST NEEDED)' : 'ПОГРАНИЧНАЯ МОДЕЛЬ (НУЖЕН БУСТ)',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        desc: isEn ? 'Business breaks even, but safety margin against external shocks is thin.' : 'Бизнес сводит концы с концами, но запаса прочности для кризисов мало.'
      };
    }

    return {
      ltv,
      blendedCac,
      ltvCacRatio,
      paybackMonths,
      status
    };
  }, [arpu, cac, monthlyChurn, organicShare, isEn]);

  // Presets for unit levers
  const applyArchetype = (type: 'b2b' | 'ai_saas' | 'marketplace' | 'devtool') => {
    if (type === 'b2b') {
      setArpu(420);
      setCac(190);
      setMonthlyChurn(2.0);
      setOrganicShare(25);
    } else if (type === 'ai_saas') {
      setArpu(29);
      setCac(18);
      setMonthlyChurn(5.5);
      setOrganicShare(50);
    } else if (type === 'marketplace') {
      setArpu(65);
      setCac(28);
      setMonthlyChurn(7.0);
      setOrganicShare(35);
    } else if (type === 'devtool') {
      setArpu(99);
      setCac(38);
      setMonthlyChurn(3.0);
      setOrganicShare(60);
    }
  };

  // Color helpers
  const getSurvivalColor = (val: number) => {
    if (val >= 75) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (val >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const survivalColor = getSurvivalColor(survivalScore);

  // SVG Radar Polygon points computation
  const radarSvgData = useMemo(() => {
    const size = 300;
    const center = size / 2;
    const radius = 105;
    const total = radarDimensions.length;

    const getCoords = (index: number, valuePct: number) => {
      const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
      const r = (radius * valuePct) / 100;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    // Background web rings
    const rings = [0.25, 0.5, 0.75, 1.0].map(scale => {
      const pts = radarDimensions.map((_, i) => {
        const { x, y } = getCoords(i, scale * 100);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return pts;
    });

    // Outer axis spoke lines
    const spokes = radarDimensions.map((_, i) => {
      const outer = getCoords(i, 100);
      return { x1: center, y1: center, x2: outer.x, y2: outer.y };
    });

    // Dynamic data polygon
    const polygonPoints = radarDimensions.map((dim, i) => {
      const val = radarValues[dim.id] || 50;
      const { x, y } = getCoords(i, val);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Interactive vertex dots
    const vertexDots = radarDimensions.map((dim, i) => {
      const val = radarValues[dim.id] || 50;
      const { x, y } = getCoords(i, val);
      const labelPos = getCoords(i, 122);
      return {
        id: dim.id,
        x,
        y,
        labelX: labelPos.x,
        labelY: labelPos.y,
        val,
        shortLabel: dim.shortLabel
      };
    });

    return { size, center, rings, spokes, polygonPoints, vertexDots };
  }, [radarValues, radarDimensions]);

  return (
    <div className={`relative w-full rounded-2xl bg-[#090b10] border border-white/[0.08] shadow-2xl overflow-hidden ${className}`}>
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Header / HUD Bar */}
      <div className="relative border-b border-white/[0.08] px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-white shrink-0">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SIMULATION COCKPIT
              </span>
              <span className="text-[10px] font-mono text-neutral-400 border border-white/[0.08] px-1.5 py-0.5 rounded">
                LIVE
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
              <span>{isEn ? 'Stress Lab:' : 'Стресс-лаборатория:'}</span>
              <span className="text-white/80 font-mono text-sm max-w-[200px] sm:max-w-[320px] truncate">
                «{ideaTitle}»
              </span>
            </h3>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveMode('SCENARIOS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeMode === 'SCENARIOS'
                ? 'bg-white/10 text-white shadow-sm border border-white/15'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{isEn ? 'Stress Scenarios' : 'Стресс-сценарии'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('RADAR')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeMode === 'RADAR'
                ? 'bg-white/10 text-white shadow-sm border border-white/15'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEn ? 'Moat Radar' : 'Радар рвов'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('UNIT_LEVERS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeMode === 'UNIT_LEVERS'
                ? 'bg-white/10 text-white shadow-sm border border-white/15'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Unit Levers' : 'Юнит-рычаги'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Content */}
      <div className="relative p-4 sm:p-6">
        {/* ============================================================ */}
        {/* MODE 1: SCENARIOS */}
        {/* ============================================================ */}
        {activeMode === 'SCENARIOS' && (
          <div className="space-y-6">
            {/* Scenario selector cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {scenarios.map(sc => {
                const Icon = sc.icon;
                const isSelected = sc.id === activeScenarioId;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setActiveScenarioId(sc.id)}
                    className={`text-left p-3 sm:p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/30 shadow-lg'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-scenario-pill"
                        className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/15 text-white' : 'bg-white/5 text-neutral-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
                        {sc.threatLevel}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                        {sc.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono truncate">
                        {sc.shortLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Scenario Simulator Workbench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/40 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
              {/* Left Column: Diagnostics & Mitigations */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                      {isEn ? 'SITUATIONAL STRESS-TEST' : 'СИТУАЦИОННЫЙ СТРЕСС-ТЕСТ'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      ID: #{currentScenario.id.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-display font-bold text-white">
                    {currentScenario.tagline}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {currentScenario.threatDescription}
                  </p>
                </div>

                {/* Critical Vulnerability Callout */}
                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-mono uppercase text-rose-400 tracking-wider">
                      {isEn ? 'Core Vulnerability:' : 'Главная уязвимость идеи:'}
                    </div>
                    <div className="text-xs text-neutral-300">
                      {currentScenario.vulnerability}
                    </div>
                  </div>
                </div>

                {/* Interactive Mitigation Toggles */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                      {isEn ? 'Defensive maneuvers (click to activate):' : 'Защитные маневры (кликайте для активации):'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {isEn ? 'Impact on survival' : 'Влияние на выживаемость'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentScenario.mitigations.map(mit => {
                      const isActive = !!activatedMitigations[mit.id];
                      return (
                        <button
                          key={mit.id}
                          type="button"
                          onClick={() => toggleMitigation(mit.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                            isActive
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                              : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isActive ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-neutral-600 bg-transparent'
                            }`}>
                              {isActive && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-xs font-semibold text-white tracking-tight">
                                {mit.label}
                              </div>
                              <div className="text-[11px] text-neutral-400 leading-normal">
                                {mit.description}
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs font-mono font-bold shrink-0 ${
                            isActive ? 'text-emerald-400' : 'text-neutral-400'
                          }`}>
                            +{mit.impact}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tactical Strategic Advice */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <Target className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                      {isEn ? 'Venture Verdict & Strategic Advice:' : 'Венчурный вердикт и рекомендация:'}
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {currentScenario.strategicAdvice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Gauge & Live Outcome */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    {isEn ? 'PROJECT SURVIVAL PROBABILITY' : 'ВЕРОЯТНОСТЬ ВЫЖИВАНИЯ ПРОЕКТА'}
                  </span>
                  <div className="text-xs font-mono text-neutral-400">
                    {isEn ? 'With active defenses applied' : 'С учетом активированных защит'}
                  </div>
                </div>

                {/* Circular Animated SVG Gauge */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.06)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="65"
                      fill="none"
                      stroke={survivalColor.stroke}
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 65}
                      animate={{
                        strokeDashoffset: (2 * Math.PI * 65) * (1 - survivalScore / 100)
                      }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <motion.span
                      key={survivalScore}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-display font-extrabold text-white tracking-tight"
                    >
                      {survivalScore}%
                    </motion.span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      SURVIVAL RATE
                    </span>
                  </div>
                </div>

                {/* Status Evaluation Badge */}
                <div className={`w-full py-2 px-3 rounded-xl border text-center text-xs font-mono font-bold tracking-wider ${survivalColor.border} ${survivalColor.bg} ${survivalColor.text}`}>
                  {survivalScore >= 75
                    ? (isEn ? '🛡️ DEFENSIBLE MOAT (MODEL IS RESILIENT)' : '🛡️ ЗАЩИЩЕННЫЙ РОВ (МОДЕЛЬ УСТОЙЧИВА)')
                    : survivalScore >= 50
                    ? (isEn ? '⚡ MODERATE VULNERABILITY (REFINEMENT NEEDED)' : '⚡ СРЕДНЯЯ УЯЗВИМОСТЬ (ТРЕБУЕТСЯ ДОРАБОТКА)')
                    : (isEn ? '🚨 CRITICAL VULNERABILITY TO ATTACK' : '🚨 КРИТИЧЕСКАЯ УЯЗВИМОСТЬ К УДАРУ')}
                </div>

                {/* Micro metrics bar */}
                <div className="w-full grid grid-cols-2 gap-2 text-center pt-2 border-t border-white/[0.06]">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">{isEn ? 'BASE SHOCK' : 'БАЗОВЫЙ ШОК'}</div>
                    <div className="text-sm font-mono font-bold text-white">{currentScenario.baseSurvival}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">{isEn ? 'DEFENSE BOOST' : 'БУСТ ОТ ЗАЩИТ'}</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      +{survivalScore - currentScenario.baseSurvival}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 2: DEFENSE RADAR */}
        {/* ============================================================ */}
        {activeMode === 'RADAR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Interactive Visual SVG Polygon */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 sm:p-6 bg-black/40 border border-white/[0.06] rounded-2xl relative overflow-hidden">
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <Radar className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                  DEFENSIBILITY QUOTIENT (DQ)
                </span>
              </div>
              <div className="absolute top-3 right-4">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  {averageRadarScore} / 100
                </span>
              </div>

              {/* SVG Web Radar */}
              <div className="relative w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] flex items-center justify-center my-4">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                  {/* Web concentric circles */}
                  {radarSvgData.rings.map((ringPoints, i) => (
                    <polygon
                      key={i}
                      points={ringPoints}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axis spokes */}
                  {radarSvgData.spokes.map((s, i) => (
                    <line
                      key={i}
                      x1={s.x1}
                      y1={s.y1}
                      x2={s.x2}
                      y2={s.y2}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  ))}

                  {/* Dynamic Filled Polygon */}
                  <motion.polygon
                    points={radarSvgData.polygonPoints}
                    fill="rgba(6, 182, 212, 0.18)"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    animate={{ points: radarSvgData.polygonPoints }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Interactive Vertex Dots */}
                  {radarSvgData.vertexDots.map(dot => {
                    const isSelected = selectedRadarDim === dot.id;
                    return (
                      <g key={dot.id} className="cursor-pointer" onClick={() => setSelectedRadarDim(dot.id)}>
                        <circle
                          cx={dot.x}
                          cy={dot.y}
                          r={isSelected ? 6 : 4}
                          fill={isSelected ? '#ffffff' : '#06b6d4'}
                          stroke={isSelected ? '#06b6d4' : '#090b10'}
                          strokeWidth="2"
                          className="transition-all hover:scale-125"
                        />
                        <text
                          x={dot.labelX}
                          y={dot.labelY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isSelected ? '#ffffff' : '#9ca3af'}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="select-none"
                        >
                          {dot.shortLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 text-center">
                {isEn ? 'Click on axes or use sliders on the right to stress-model moats' : 'Кликайте по осям или используйте ползунки справа для стресс-моделирования рвов'}
              </div>
            </div>

            {/* Right Column: Dimension Sliders & Prescriptive Advice */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {isEn ? 'RESILIENCE VECTORS (MODELER)' : 'ВЕКТОРЫ УСТОЙЧИВОСТИ (МОДЕЛЕР)'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const reset: Record<string, number> = {};
                    radarDimensions.forEach(d => { reset[d.id] = d.defaultVal; });
                    setRadarValues(reset);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isEn ? 'Reset' : 'Сброс'}</span>
                </button>
              </div>

              {/* Sliders list */}
              <div className="space-y-2.5">
                {radarDimensions.map(dim => {
                  const val = radarValues[dim.id] || 50;
                  const isSelected = selectedRadarDim === dim.id;

                  return (
                    <div
                      key={dim.id}
                      onClick={() => setSelectedRadarDim(dim.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/[0.06] border-cyan-500/40'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                            {dim.label}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {val}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min="20"
                        max="95"
                        value={val}
                        onChange={(e) => {
                          const newVal = Number(e.target.value);
                          setRadarValues(prev => ({ ...prev, [dim.id]: newVal }));
                        }}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Detailed Active Dimension Insight */}
              {(() => {
                const activeDim = radarDimensions.find(d => d.id === selectedRadarDim) || radarDimensions[0];
                return (
                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">
                        {isEn ? 'Strategic Lever:' : 'Стратегический хак:'} {activeDim.label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {activeDim.actionableTip}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODE 3: UNIT LEVERS */}
        {/* ============================================================ */}
        {activeMode === 'UNIT_LEVERS' && (
          <div className="space-y-6">
            {/* Presets Archetypes */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {isEn ? 'Benchmark Archetypes:' : 'Бенчмарк-профили:'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => applyArchetype('b2b')}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
                >
                  B2B Enterprise
                </button>
                <button
                  type="button"
                  onClick={() => applyArchetype('ai_saas')}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
                >
                  AI Micro-SaaS
                </button>
                <button
                  type="button"
                  onClick={() => applyArchetype('marketplace')}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
                >
                  Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => applyArchetype('devtool')}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
                >
                  DevTool / API
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Sliders */}
              <div className="lg:col-span-6 space-y-4 bg-black/40 border border-white/[0.06] rounded-2xl p-4 sm:p-6">
                <h4 className="text-sm font-mono uppercase tracking-wider text-neutral-300">
                  {isEn ? 'Operating Levers' : 'Операционные рычаги идеи'}
                </h4>

                {/* Slider 1: ARPU */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{isEn ? 'Average Check (Monthly ARPU)' : 'Средний чек (ARPU в месяц)'}</span>
                    <span className="font-mono font-bold text-white">${arpu} {isEn ? '/ mo' : '/ мес'}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="800"
                    step="5"
                    value={arpu}
                    onChange={(e) => setArpu(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>$10</span>
                    <span>$800</span>
                  </div>
                </div>

                {/* Slider 2: Paid CAC */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{isEn ? 'Acquisition Cost (Paid CAC)' : 'Стоимость привлечения (Платный CAC)'}</span>
                    <span className="font-mono font-bold text-rose-400">${cac}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="400"
                    step="5"
                    value={cac}
                    onChange={(e) => setCac(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>$5</span>
                    <span>$400</span>
                  </div>
                </div>

                {/* Slider 3: Churn */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{isEn ? 'Monthly Churn Rate' : 'Ежемесячный отток (Monthly Churn)'}</span>
                    <span className="font-mono font-bold text-amber-400">{monthlyChurn}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={monthlyChurn}
                    onChange={(e) => setMonthlyChurn(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>1% (Enterprise)</span>
                    <span>15% (B2C)</span>
                  </div>
                </div>

                {/* Slider 4: Organic Share */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{isEn ? 'Organic Share (SEO / PLG)' : 'Доля бесплатной органики (SEO / PLG)'}</span>
                    <span className="font-mono font-bold text-cyan-400">{organicShare}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={organicShare}
                    onChange={(e) => setOrganicShare(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>{isEn ? '0% (Paid only)' : '0% (Только реклама)'}</span>
                    <span>{isEn ? '80% (Viral brand)' : '80% (Виральный бренд)'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Calculated Metrics Dashboard */}
              <div className="lg:col-span-6 space-y-4">
                {/* Status Hero Box */}
                <div className={`p-4 rounded-2xl border ${unitStats.status.color} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                      {isEn ? 'UNIT ECONOMICS EXPRESS AUDIT' : 'ЭКСПРЕСС-ДИАГНОСТИКА ЮНИТ-ЭКОНОМИКИ'}
                    </span>
                    <Scale className="w-4 h-4" />
                  </div>
                  <div className="text-base sm:text-lg font-display font-bold">
                    {unitStats.status.label}
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {unitStats.status.desc}
                  </p>
                </div>

                {/* 4 Core KPIs Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">
                      {isEn ? 'LTV (LIFETIME VALUE)' : 'LTV (ЖИЗНЕННЫЙ ЦИКЛ)'}
                    </div>
                    <div className="text-2xl font-display font-bold text-white">
                      ${unitStats.ltv}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      ~{(100 / monthlyChurn).toFixed(0)} {isEn ? 'mo retention' : 'мес. удержания'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">
                      BLENDED CAC
                    </div>
                    <div className="text-2xl font-display font-bold text-white">
                      ${unitStats.blendedCac}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      -{organicShare}% {isEn ? 'via organic' : 'за счет органики'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">
                      {isEn ? 'LTV / CAC RATIO' : 'СООТНОШЕНИЕ LTV / CAC'}
                    </div>
                    <div className="text-2xl font-display font-bold text-emerald-400">
                      {unitStats.ltvCacRatio}x
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {isEn ? 'Venture goal: >3.0x' : 'Цель венчура: >3.0x'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">
                      {isEn ? 'CAC PAYBACK' : 'ОКУПАЕМОСТЬ CAC'}
                    </div>
                    <div className="text-2xl font-display font-bold text-white">
                      {unitStats.paybackMonths} {isEn ? 'mo' : 'мес'}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {isEn ? 'Safe threshold: <12 mo' : 'Безопасный порог: <12 мес'}
                    </div>
                  </div>
                </div>

                {/* Practical Takeaway */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {isEn
                      ? `The higher the organic acquisition share (${organicShare}%), the lower the effective Blended CAC. For projects in the "${ideaTitle}" phase, early retention is the primary growth lever.`
                      : `Чем выше доля органики (${organicShare}%), тем ниже реальный Blended CAC. Для проектов в фазе «${ideaTitle}» ключевой рычаг роста — снижение оттока на ранних стадиях.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SpatialIdeaMap = StartupStressLab;
export default StartupStressLab;
