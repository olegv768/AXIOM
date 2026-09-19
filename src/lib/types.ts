export type RiskLevel = 'critical' | 'high' | 'medium';

export interface SimilarWebsiteItem {
  name: string;
  url: string;
  domain: string;
  stage: string;              // e.g. "Series A ($18M)", "Bootstrapped $40k MRR", "Public Corp"
  pricingModel: string;       // e.g. "Freemium ($18/mo)", "12% take-rate + deposit"
  trafficEstimate: string;    // e.g. "~1.2M visits/mo", "~80k visits/mo"
  tagline: string;
  whatTheyDo: string;
  growthChannel: string;      // e.g. "Product-Led Growth & viral invite loops", "SEO / Content"
  blindSpot: string;          // В чем их слепая зона / где новый проект может их обойти
}

export interface CompetitorItem {
  name: string;
  type: 'direct' | 'indirect' | 'incumbent';
  description: string;
  strength: string;
  vulnerability: string;
  estimatedFundingOrReach: string;
}

export interface RedFlagItem {
  title: string;
  riskLevel: RiskLevel;
  description: string;
  mitigationHint: string;
}

export interface BlueOceanPivot {
  title: string;
  expectedUniqueness: number;
  angle: string;
  description: string;
  tacticalMove: string;
}

export interface ViabilityMetrics {
  innovation: number;         // 0-100
  saturation: number;         // 0-100 (чем выше, тем жестче конкуренция)
  moat: number;               // 0-100 (защита от копирования)
  cacDifficulty: number;      // 0-100 (сложность привлечения)
  retentionPotential: number; // 0-100 (потенциал удержания)
}

export interface RuthlessCritique {
  founderBias: string;
  switchingBarrier: string;
  retentionPitfall: string;
  monetizationFlaw: string;
}

export interface VerdictInfo {
  title: string;
  description: string;
  level: 'crowded' | 'incremental' | 'promising' | 'blue_ocean';
  badgeColor: string;
  accentColor: string;
}

export interface UnitEconomics {
  cacEstimate: string;
  expectedLtv: string;
  paybackPeriod: string;
  marginProfile: string;
  burnRisk: string;
}

export interface GtmStep {
  phase: string;
  channel: string;
  tacticalAction: string;
  timeline: string;
}

export interface MarketSizing {
  tam: string;
  sam: string;
  som: string;
  averageCheck: string;
}

export interface ValidationReport {
  id: string;
  ideaText: string;
  targetMarket: string;
  createdAt: number;
  uniquenessScore: number;
  verdict: VerdictInfo;
  metrics: ViabilityMetrics;
  ruthlessCritique: RuthlessCritique;
  similarWebsites: SimilarWebsiteItem[];  // Реальные примеры сайтов с кликабельными URL
  competitors: CompetitorItem[];
  redFlags: RedFlagItem[];
  blueOceanPivots: BlueOceanPivot[];
  unitEconomics: UnitEconomics;           // Стресс-тест экономики
  gtmPlaybook: GtmStep[];                 // Стратегия выхода на рынок
  marketSizing: MarketSizing;             // Оценка рынка
  quickTakeaway: string;
  sourceProvider?: 'offline' | 'gemini_search' | 'alem_ai' | 'openai';
}

export interface ApiSettings {
  provider: 'offline' | 'gemini' | 'alem' | 'openai';
  apiKey: string;
  baseUrl?: string;           // Для Alem AI / пользовательских endpoint
  model: string;
  enableWebSearch: boolean;   // Использовать Google Search Grounding для Gemini
}
