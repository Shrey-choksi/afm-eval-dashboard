// ============================================================================
// MOCK DATA GENERATOR — LLM Evaluation & Training Insight Dashboard
// ============================================================================

// --- Types ---

export interface RubricScores {
  factual: number;
  reasoning: number;
  helpfulness: number;
  clarity: number;
  safety: number;
}

export interface ModelPerformance {
  timestamp: string;
  cycle: string;
  model_name: string;
  win_rate: number;
  rubric_scores: RubricScores;
}

export interface DomainData {
  domain: string;
  win_rate: number;
  evaluation_volume: number;
  trend: number[]; // per-cycle scores
}

export interface LanguageData {
  language: string;
  win_rate: number;
  evaluation_volume: number;
  complexity_score: number;
  avg_rubric_score: number;
  improvement_trend: number;
}

export interface TrainingCycle {
  cycle_id: string;
  cycle_label: string;
  before_scores: RubricScores;
  after_scores: RubricScores;
  failure_breakdown: {
    hallucination: number;
    reasoning_errors: number;
    instruction_following: number;
    safety_violations: number;
  };
}

export interface FailureModeTrend {
  cycle: string;
  hallucination: number;
  reasoning_errors: number;
  instruction_following: number;
  safety_violations: number;
}

// --- Generators ---

const CYCLES = [
  "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025",
  "May 2025", "Jun 2025", "Jul 2025", "Aug 2025",
  "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function jitter(val: number, amount: number) {
  return Math.max(0, Math.min(100, val + (Math.random() - 0.5) * amount));
}

export function generateModelPerformance(): ModelPerformance[] {
  const data: ModelPerformance[] = [];
  const models = [
    { name: "AFM v3 (Ours)", baseWin: 52, growth: 28, rubricBase: { factual: 58, reasoning: 52, helpfulness: 60, clarity: 62, safety: 70 }, rubricGrowth: 14 },
    { name: "GPT-4o", baseWin: 72, growth: 8, rubricBase: { factual: 82, reasoning: 80, helpfulness: 78, clarity: 85, safety: 88 }, rubricGrowth: 6 },
    { name: "Claude 3.5", baseWin: 70, growth: 10, rubricBase: { factual: 80, reasoning: 82, helpfulness: 80, clarity: 82, safety: 90 }, rubricGrowth: 7 },
    { name: "AFM v2 (Legacy)", baseWin: 48, growth: 5, rubricBase: { factual: 50, reasoning: 45, helpfulness: 52, clarity: 55, safety: 65 }, rubricGrowth: 3 },
  ];

  for (const model of models) {
    CYCLES.forEach((cycle, i) => {
      const t = i / (CYCLES.length - 1);
      const winRate = jitter(lerp(model.baseWin, model.baseWin + model.growth, t), 3);
      data.push({
        timestamp: `2025-${String(i + 1).padStart(2, "0")}-15`,
        cycle,
        model_name: model.name,
        win_rate: Math.round(winRate * 10) / 10,
        rubric_scores: {
          factual: Math.round(jitter(lerp(model.rubricBase.factual, model.rubricBase.factual + model.rubricGrowth * 0.9, t), 2) * 10) / 10,
          reasoning: Math.round(jitter(lerp(model.rubricBase.reasoning, model.rubricBase.reasoning + model.rubricGrowth * 1.0, t), 2) * 10) / 10,
          helpfulness: Math.round(jitter(lerp(model.rubricBase.helpfulness, model.rubricBase.helpfulness + model.rubricGrowth * 0.8, t), 2) * 10) / 10,
          clarity: Math.round(jitter(lerp(model.rubricBase.clarity, model.rubricBase.clarity + model.rubricGrowth * 0.7, t), 2) * 10) / 10,
          safety: Math.round(jitter(lerp(model.rubricBase.safety, model.rubricBase.safety + model.rubricGrowth * 0.5, t), 1) * 10) / 10,
        },
      });
    });
  }

  return data;
}

export function generateDomainData(): DomainData[] {
  const domains = [
    { domain: "General Knowledge", base: 78, vol: 12400 },
    { domain: "Coding & Engineering", base: 72, vol: 8900 },
    { domain: "Finance & Analytics", base: 68, vol: 5600 },
    { domain: "Medical & Health", base: 64, vol: 4200 },
    { domain: "Education", base: 82, vol: 7800 },
    { domain: "Infrastructure & DevOps", base: 70, vol: 3400 },
    { domain: "Legal & Compliance", base: 58, vol: 2800 },
  ];

  return domains.map((d) => ({
    domain: d.domain,
    win_rate: Math.round(jitter(d.base, 4) * 10) / 10,
    evaluation_volume: d.vol + Math.floor(Math.random() * 500),
    trend: CYCLES.map((_, i) => {
      const t = i / (CYCLES.length - 1);
      return Math.round(jitter(lerp(d.base - 10, d.base + 8, t), 4) * 10) / 10;
    }),
  }));
}

export function generateLanguageData(): LanguageData[] {
  const langs = [
    { language: "English", winRate: 82, vol: 24000, complexity: 0.3, rubric: 86 },
    { language: "Chinese (Mandarin)", winRate: 71, vol: 8500, complexity: 0.75, rubric: 74 },
    { language: "Spanish", winRate: 76, vol: 6200, complexity: 0.35, rubric: 79 },
    { language: "Arabic", winRate: 62, vol: 3800, complexity: 0.82, rubric: 66 },
    { language: "French", winRate: 74, vol: 4100, complexity: 0.38, rubric: 77 },
    { language: "German", winRate: 73, vol: 3600, complexity: 0.45, rubric: 76 },
    { language: "Japanese", winRate: 66, vol: 5200, complexity: 0.85, rubric: 69 },
    { language: "Korean", winRate: 68, vol: 3200, complexity: 0.72, rubric: 71 },
    { language: "Hindi", winRate: 65, vol: 2800, complexity: 0.6, rubric: 68 },
    { language: "Portuguese", winRate: 75, vol: 2400, complexity: 0.36, rubric: 78 },
    { language: "Russian", winRate: 67, vol: 2100, complexity: 0.65, rubric: 70 },
    { language: "Turkish", winRate: 60, vol: 1400, complexity: 0.7, rubric: 64 },
  ];

  return langs.map((l) => ({
    language: l.language,
    win_rate: Math.round(jitter(l.winRate, 3) * 10) / 10,
    evaluation_volume: l.vol + Math.floor(Math.random() * 300),
    complexity_score: Math.round(jitter(l.complexity * 100, 5)) / 100,
    avg_rubric_score: Math.round(jitter(l.rubric, 3) * 10) / 10,
    improvement_trend: Math.round((Math.random() * 12 - 2) * 10) / 10,
  }));
}

export function generateTrainingCycles(): TrainingCycle[] {
  const cycles = [
    {
      cycle_id: "TC-001", cycle_label: "Cycle 1 (Q1)",
      before: { factual: 62, reasoning: 58, helpfulness: 64, clarity: 66, safety: 78 },
      after: { factual: 70, reasoning: 66, helpfulness: 72, clarity: 73, safety: 82 },
      failures: { hallucination: 18, reasoning_errors: 22, instruction_following: 15, safety_violations: 5 },
    },
    {
      cycle_id: "TC-002", cycle_label: "Cycle 2 (Q2)",
      before: { factual: 70, reasoning: 66, helpfulness: 72, clarity: 73, safety: 82 },
      after: { factual: 76, reasoning: 74, helpfulness: 78, clarity: 78, safety: 86 },
      failures: { hallucination: 14, reasoning_errors: 16, instruction_following: 11, safety_violations: 3 },
    },
    {
      cycle_id: "TC-003", cycle_label: "Cycle 3 (Q3)",
      before: { factual: 76, reasoning: 74, helpfulness: 78, clarity: 78, safety: 86 },
      after: { factual: 82, reasoning: 80, helpfulness: 84, clarity: 83, safety: 90 },
      failures: { hallucination: 10, reasoning_errors: 12, instruction_following: 8, safety_violations: 2 },
    },
    {
      cycle_id: "TC-004", cycle_label: "Cycle 4 (Q4)",
      before: { factual: 82, reasoning: 80, helpfulness: 84, clarity: 83, safety: 90 },
      after: { factual: 87, reasoning: 85, helpfulness: 88, clarity: 87, safety: 93 },
      failures: { hallucination: 7, reasoning_errors: 9, instruction_following: 5, safety_violations: 1 },
    },
  ];

  return cycles.map((c) => ({
    cycle_id: c.cycle_id,
    cycle_label: c.cycle_label,
    before_scores: c.before,
    after_scores: c.after,
    failure_breakdown: c.failures,
  }));
}

export function generateFailureModeTrends(): FailureModeTrend[] {
  return CYCLES.map((cycle, i) => {
    const t = i / (CYCLES.length - 1);
    return {
      cycle,
      hallucination: Math.round(lerp(22, 6, t) + (Math.random() - 0.5) * 3),
      reasoning_errors: Math.round(lerp(26, 8, t) + (Math.random() - 0.5) * 3),
      instruction_following: Math.round(lerp(18, 4, t) + (Math.random() - 0.5) * 2),
      safety_violations: Math.round(lerp(7, 1, t) + (Math.random() - 0.5) * 1),
    };
  });
}

// --- Rubric severity distribution data ---
export interface SeverityData {
  category: string;
  no_issues: number;
  minor_issues: number;
  major_issues: number;
}

export function generateSeverityData(): SeverityData[] {
  return [
    { category: "Factual Accuracy", no_issues: 68, minor_issues: 22, major_issues: 10 },
    { category: "Reasoning Quality", no_issues: 62, minor_issues: 26, major_issues: 12 },
    { category: "Helpfulness", no_issues: 74, minor_issues: 18, major_issues: 8 },
    { category: "Clarity / Style", no_issues: 78, minor_issues: 16, major_issues: 6 },
    { category: "Safety Compliance", no_issues: 88, minor_issues: 9, major_issues: 3 },
  ];
}

// --- KPI computed values ---
export function computeKPIs(modelPerf: ModelPerformance[]) {
  const ourModel = modelPerf.filter((m) => m.model_name.includes("AFM v3"));
  const latest = ourModel[ourModel.length - 1];
  const earliest = ourModel[0];
  const secondLatest = ourModel[ourModel.length - 2];

  const avgRubric = latest
    ? Math.round(
        ((latest.rubric_scores.factual +
          latest.rubric_scores.reasoning +
          latest.rubric_scores.helpfulness +
          latest.rubric_scores.clarity +
          latest.rubric_scores.safety) /
          5) *
          10
      ) / 10
    : 0;

  return {
    winRate: latest?.win_rate ?? 0,
    winRateChange: latest && secondLatest ? Math.round((latest.win_rate - secondLatest.win_rate) * 10) / 10 : 0,
    totalDR: 48720,
    avgRubric,
    improvement: latest && earliest ? Math.round((latest.win_rate - earliest.win_rate) * 10) / 10 : 0,
    sparkData: ourModel.map((m) => m.win_rate),
  };
}

// --- Heatmap data ---
export interface HeatmapCell {
  domain: string;
  cycle: string;
  value: number;
}

export function generateHeatmapData(domainData: DomainData[]): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  for (const d of domainData) {
    d.trend.forEach((val, i) => {
      cells.push({ domain: d.domain, cycle: CYCLES[i], value: val });
    });
  }
  return cells;
}

export { CYCLES };
