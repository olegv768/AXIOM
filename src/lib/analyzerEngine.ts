import {
  ValidationReport,
  ViabilityMetrics,
  CompetitorItem,
  RedFlagItem,
  BlueOceanPivot,
  RuthlessCritique,
  VerdictInfo,
  SimilarWebsiteItem,
  UnitEconomics,
  GtmStep,
  MarketSizing,
} from './types';

// Надежный вызов Gemini API с поддержкой Google Search Grounding и парсингом реальных сайтов
export async function analyzeWithGemini(
  ideaText: string,
  targetMarket: string,
  apiKey: string,
  enableSearch: boolean = true
): Promise<ValidationReport> {
  const model = 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `Ты — ведущий венчурный партнер и технологический аудитор.
Проведи глубокий, строгий и беспристрастный анализ стартап-идеи:
ИДЕЯ: "${ideaText}"
РЫНОК/СЕГМЕНТ: "${targetMarket}"

КРИТИЧЕСКИ ВАЖНО:
Найди 2-4 РЕАЛЬНО СУЩЕСТВУЮЩИХ сайта, компании или стартапа в мире с похожими концепциями!
Укажи их настоящие домены (domain), реальные ссылки (url https://...), стадии финансирования, модели монетизации, примерный трафик, сильные стороны и их уязвимости/слепые зоны.

Ответь ИСКЛЮЧИТЕЛЬНО валидным JSON-объектом (без лишнего текста вокруг) следующей структуры:
{
  "uniquenessScore": <число от 0 до 100>,
  "verdict": {
    "title": "<вердикт на русском: Голубой океан / Перспективная отстройка / Инкрементальный продукт / Перенасыщенный рынок>",
    "description": "<аналитическое резюме вердикта>",
    "level": "<'blue_ocean' | 'promising' | 'incremental' | 'crowded'>"
  },
  "metrics": {
    "innovation": <0-100>,
    "saturation": <0-100>,
    "moat": <0-100>,
    "cacDifficulty": <0-100>,
    "retentionPotential": <0-100>
  },
  "similarWebsites": [
    {
      "name": "<название реально существующего сервиса/стартапа>",
      "url": "<настоящая ссылка https://...>",
      "domain": "<домен, например granola.so>",
      "stage": "<стадия, раунды финансирования или Bootstrapped>",
      "pricingModel": "<модель монетизации и цены>",
      "trafficEstimate": "<оценка трафика>",
      "tagline": "<слоган>",
      "whatTheyDo": "<что они конкретно делают>",
      "growthChannel": "<их главный канал роста>",
      "blindSpot": "<в чем их главная уязвимость/слепая зона перед новой идеей>"
    }
  ],
  "competitors": [
    {
      "name": "<имя конкурента>",
      "type": "<'direct' | 'indirect' | 'incumbent'>",
      "description": "<описание>",
      "strength": "<сильная сторона>",
      "vulnerability": "<уязвимость>",
      "estimatedFundingOrReach": "<масштаб>"
    }
  ],
  "ruthlessCritique": {
    "founderBias": "<когнитивное искажение основателя>",
    "switchingBarrier": "<барьер переключения пользователей>",
    "retentionPitfall": "<скрытая ловушка удержания>",
    "monetizationFlaw": "<уязвимость монетизации>"
  },
  "redFlags": [
    {
      "title": "<название риска>",
      "riskLevel": "<'critical' | 'high' | 'medium'>",
      "description": "<суть риска>",
      "mitigationHint": "<как нивелировать>"
    }
  ],
  "blueOceanPivots": [
    {
      "title": "<название вектора>",
      "expectedUniqueness": <число 85-98>,
      "angle": "<угол отстройки>",
      "description": "<описание>",
      "tacticalMove": "<тактический ход>"
    }
  ],
  "unitEconomics": {
    "cacEstimate": "<оценка CAC>",
    "expectedLtv": "<ожидаемый LTV>",
    "paybackPeriod": "<период окупаемости>",
    "marginProfile": "<маржинальность>",
    "burnRisk": "<критический финансовый риск>"
  },
  "gtmPlaybook": [
    {
      "phase": "<фаза>",
      "channel": "<канал>",
      "tacticalAction": "<действие>",
      "timeline": "<сроки>"
    }
  ],
  "marketSizing": {
    "tam": "<TAM объем>",
    "sam": "<SAM объем>",
    "som": "<SOM объем>",
    "averageCheck": "<средний чек>"
  },
  "quickTakeaway": "<главный вывод>"
}`;

  let response: Response;
  const requestBody: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
    }
  };

  // Попытка 1: С поиском в Google Search
  if (enableSearch) {
    try {
      const searchBody = { ...requestBody, tools: [{ googleSearch: {} }] };
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchBody),
      });

      if (!response.ok) {
        // Если поиск вернул ошибку квоты/тарифа, делаем запрос без search tool
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
      }
    } catch {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
    }
  } else {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Пустой ответ от Gemini API');

  // Извлекаем чистый JSON из ответа
  let cleanJson = rawText.trim();
  const jsonMatch = cleanJson.match(/```(?:json)?([\s\S]*?)```/);
  if (jsonMatch) {
    cleanJson = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(cleanJson);

  return {
    ...parsed,
    id: `val_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ideaText,
    targetMarket,
    createdAt: Date.now(),
    sourceProvider: 'gemini_search',
    verdict: {
      ...parsed.verdict,
      badgeColor: parsed.uniquenessScore >= 75
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : parsed.uniquenessScore >= 50
        ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
        : 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      accentColor: parsed.uniquenessScore >= 75 ? '#10b981' : parsed.uniquenessScore >= 50 ? '#38bdf8' : '#f43f5e',
    }
  };
}

// Запасной локальный генератор (если ключ еще не введен)
export function generateLocalFallback(ideaText: string, targetMarket: string): ValidationReport {
  return {
    id: `val_${Date.now()}_fallback`,
    ideaText,
    targetMarket,
    createdAt: Date.now(),
    uniquenessScore: 54,
    verdict: {
      title: 'Требуется подключение живого API',
      description: 'Для глубокого поиска реальных сайтов в интернете и анализа конкурентов подключите Gemini API ключ.',
      level: 'incremental',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      accentColor: '#f59e0b'
    },
    metrics: {
      innovation: 50,
      saturation: 65,
      moat: 40,
      cacDifficulty: 70,
      retentionPotential: 50
    },
    similarWebsites: [
      {
        name: 'ProductHunt Index',
        url: `https://www.producthunt.com/search?q=${encodeURIComponent(ideaText.split(' ').slice(0, 3).join(' '))}`,
        domain: 'producthunt.com',
        stage: 'Search Database',
        pricingModel: 'Freemium / B2B',
        trafficEstimate: '~4.5M визитов/мес',
        tagline: 'Каталог новых продуктов',
        whatTheyDo: 'База запусков стартапов в смежных сегментах.',
        growthChannel: 'Community Releases',
        blindSpot: 'Высокая смертность проектов после дня релиза.'
      },
      {
        name: 'Crunchbase Companies',
        url: 'https://www.crunchbase.com',
        domain: 'crunchbase.com',
        stage: 'Global Intelligence',
        pricingModel: 'Enterprise',
        trafficEstimate: '~9M визитов/мес',
        tagline: 'База профинансированных компаний',
        whatTheyDo: 'Глобальный реестр инвестиционных раундов.',
        growthChannel: 'Data Licensing',
        blindSpot: 'Медленно индексирует инди-проекты на стадии pre-seed.'
      }
    ],
    competitors: [
      {
        name: 'Платформенные экосистемы (Google / Apple / Microsoft)',
        type: 'incumbent',
        description: 'Встроенные инструменты операционных систем и офисных пакетов.',
        strength: 'Нулевой CAC и монопольный доступ к пользователям.',
        vulnerability: 'Медленный цикл релиза и отсутствие персонализации.',
        estimatedFundingOrReach: 'Триллионные корпорации'
      }
    ],
    ruthlessCritique: {
      founderBias: 'Иллюзия отсутствия конкурентов: если вы не находите аналоги, скорее всего, рынка либо нет, либо вы ищете не по тем терминам.',
      switchingBarrier: 'Высокая инерция пользователей: переучивать привычки дорого.',
      retentionPitfall: 'Проблема разового использования продукта без повторного цикла.',
      monetizationFlaw: 'Неопределенность готовности платить за решение проблемы.'
    },
    redFlags: [
      {
        title: 'Неподтвержденная готовность платить',
        riskLevel: 'critical',
        description: 'Люди соглашаются, что проблема существует, но отказываются открывать кошелек.',
        mitigationHint: 'Собрать 10 предоплат или предзаказов до написания функционала.'
      }
    ],
    blueOceanPivots: [
      {
        title: 'Узкая вертикализация под конкретную профессию',
        expectedUniqueness: 92,
        angle: 'Vertical Specialization',
        description: 'Сфокусироваться на одной роли с высоким чеком.',
        tacticalMove: 'Пакетное решение под ключ для b2b-клиентов.'
      }
    ],
    unitEconomics: {
      cacEstimate: '$80–$150',
      expectedLtv: '$350–$600',
      paybackPeriod: '6–8 месяцев',
      marginProfile: '75%',
      burnRisk: 'Риск слива бюджета без отстроенного позиционирования'
    },
    gtmPlaybook: [
      {
        phase: 'Фаза 1: CustDev',
        channel: 'Прямые интервью',
        tacticalAction: 'Провести 20 разговоров с потенциальными клиентами.',
        timeline: 'Недели 1–2'
      }
    ],
    marketSizing: {
      tam: '$5B+',
      sam: '$500M',
      som: '$10M',
      averageCheck: '$200/год'
    },
    quickTakeaway: 'Подключите Gemini API ключ с Google Search Grounding для проведения полноценного живого аудита с реальными сайтами из интернета.',
    sourceProvider: 'offline'
  };
}

// Главная точка входа
export async function runFullAudit(
  ideaText: string,
  targetMarket: string,
  apiKey: string
): Promise<ValidationReport> {
  const keyToUse = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (keyToUse) {
    try {
      return await analyzeWithGemini(ideaText, targetMarket, keyToUse, true);
    } catch (err) {
      console.error('Gemini API call failed:', err);
      const fallback = generateLocalFallback(ideaText, targetMarket);
      fallback.quickTakeaway = `Ошибка вызова Gemini API (${(err as Error).message}). Проверьте правильность ключа.`;
      return fallback;
    }
  }

  // Если ключ не указан
  return generateLocalFallback(ideaText, targetMarket);
}

// Экспорт отчета в Markdown
export function exportToMarkdown(report: ValidationReport): string {
  return `# Валидация идеи: "${report.ideaText}"
*Сегмент*: ${report.targetMarket} | *Дата*: ${new Date(report.createdAt).toLocaleString('ru-RU')}
*Индекс уникальности*: **${report.uniquenessScore}/100**
*Вердикт*: **${report.verdict.title}**
> ${report.verdict.description}

---

## 1. Реальные примеры похожих сайтов и стартапов
${report.similarWebsites.map(s => `### [${s.name}](${s.url}) (${s.domain})
- **Слоган**: *${s.tagline}*
- **Что делают**: ${s.whatTheyDo}
- **Стадия / Капитал**: ${s.stage}
- **Модель монетизации**: ${s.pricingModel}
- **Оценка трафика**: ${s.trafficEstimate}
- **Канал роста**: ${s.growthChannel}
- **В чем их уязвимость**: ${s.blindSpot}
`).join('\n')}

---

## 2. Стресс-тест юнит-экономики (Unit Economics)
- **Оценка CAC (привлечение)**: ${report.unitEconomics.cacEstimate}
- **Ожидаемый LTV**: ${report.unitEconomics.expectedLtv}
- **Период окупаемости**: ${report.unitEconomics.paybackPeriod}
- **Маржинальность**: ${report.unitEconomics.marginProfile}
- **Критический риск**: ${report.unitEconomics.burnRisk}

---

## 3. Go-To-Market Playbook (0 → 1000 пользователей)
${report.gtmPlaybook.map(g => `- **${g.phase}** [${g.timeline}]: канал *${g.channel}* — ${g.tacticalAction}`).join('\n')}

---

## 4. Оценка емкости рынка (Market Sizing)
- **TAM**: ${report.marketSizing.tam}
- **SAM**: ${report.marketSizing.sam}
- **SOM**: ${report.marketSizing.som}
- **Средний чек**: ${report.marketSizing.averageCheck}

---

## 5. Беспристрастная критика (Ruthless Critique)
- **Искажение фаундера**: ${report.ruthlessCritique.founderBias}
- **Барьер привычки**: ${report.ruthlessCritique.switchingBarrier}
- **Ловушка удержания**: ${report.ruthlessCritique.retentionPitfall}
- **Уязвимость экономики**: ${report.ruthlessCritique.monetizationFlaw}

---

## 6. Точки отказа (Red Flags)
${report.redFlags.map(rf => `### [${rf.riskLevel.toUpperCase()}] ${rf.title}
- **Суть риска**: ${rf.description}
- **Тактика защиты**: ${rf.mitigationHint}
`).join('\n')}

---

## 7. Blue Ocean Pivots (Векторы трансформации до 90%+ уникальности)
${report.blueOceanPivots.map(p => `### ${p.title} (${p.expectedUniqueness}%)
- **Вектор**: ${p.angle}
- **Суть**: ${p.description}
- **Тактический шаг**: ${p.tacticalMove}
`).join('\n')}

---
**Итоговый вывод**: ${report.quickTakeaway}
`;
}
