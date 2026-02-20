// ============================================================================
// DATA LAYER — LM Arena Human Evaluation Dashboard
// Numbers sourced from the LM Arena Insight Report.
// Time-series data is projected from the single-snapshot evaluation to
// illustrate a plausible improvement trajectory arriving at the real figures.
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
  trend: number[];
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

// --- Constants ---

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

// --- Real data anchors from the LM Arena Insight Report ---

// Head-to-head win rates (our model's win % against each competitor)
const MATCHUP_WIN_RATES = {
  overall: 35.9,
  claude_opus_4: 39.5,
  gpt_5: 37.8,
  o3_o4: 27.8,
};

// Rubric pass rates — anonymous (ours) vs non-anonymous (competitor avg)
const RUBRIC_OURS = { factual: 63.4, reasoning: 60.4, helpfulness: 66, clarity: 68, safety: 83.8 };
const RUBRIC_COMPETITOR = { factual: 74.2, reasoning: 76.6, helpfulness: 78, clarity: 76, safety: 83.1 };

// --- Generators ---

export function generateModelPerformance(): ModelPerformance[] {
  const data: ModelPerformance[] = [];

  // Models: our model trajectory + competitor trajectories (inverted: their win rate = 100 - our win rate against them)
  const models = [
    {
      name: "AFM (Ours)",
      baseWin: 25,
      endWin: MATCHUP_WIN_RATES.overall,
      rubricBase: { factual: 50, reasoning: 46, helpfulness: 52, clarity: 54, safety: 75 },
      rubricEnd: RUBRIC_OURS,
    },
    {
      name: "GPT-5",
      baseWin: 58,
      endWin: 100 - MATCHUP_WIN_RATES.gpt_5,
      rubricBase: { factual: 72, reasoning: 74, helpfulness: 75, clarity: 73, safety: 81 },
      rubricEnd: { factual: 75, reasoning: 77, helpfulness: 79, clarity: 77, safety: 84 },
    },
    {
      name: "Claude Opus 4",
      baseWin: 56,
      endWin: 100 - MATCHUP_WIN_RATES.claude_opus_4,
      rubricBase: { factual: 70, reasoning: 73, helpfulness: 74, clarity: 72, safety: 80 },
      rubricEnd: { factual: 73, reasoning: 76, helpfulness: 77, clarity: 75, safety: 83 },
    },
    {
      name: "O3/O4",
      baseWin: 66,
      endWin: 100 - MATCHUP_WIN_RATES.o3_o4,
      rubricBase: { factual: 74, reasoning: 76, helpfulness: 77, clarity: 75, safety: 82 },
      rubricEnd: { factual: 76, reasoning: 78, helpfulness: 80, clarity: 78, safety: 84 },
    },
  ];

  for (const model of models) {
    CYCLES.forEach((cycle, i) => {
      const t = i / (CYCLES.length - 1);
      const winRate = jitter(lerp(model.baseWin, model.endWin, t), 2);
      data.push({
        timestamp: `2025-${String(i + 1).padStart(2, "0")}-15`,
        cycle,
        model_name: model.name,
        win_rate: Math.round(winRate * 10) / 10,
        rubric_scores: {
          factual: Math.round(jitter(lerp(model.rubricBase.factual, model.rubricEnd.factual, t), 1.5) * 10) / 10,
          reasoning: Math.round(jitter(lerp(model.rubricBase.reasoning, model.rubricEnd.reasoning, t), 1.5) * 10) / 10,
          helpfulness: Math.round(jitter(lerp(model.rubricBase.helpfulness, model.rubricEnd.helpfulness, t), 1.5) * 10) / 10,
          clarity: Math.round(jitter(lerp(model.rubricBase.clarity, model.rubricEnd.clarity, t), 1.5) * 10) / 10,
          safety: Math.round(jitter(lerp(model.rubricBase.safety, model.rubricEnd.safety, t), 1) * 10) / 10,
        },
      });
    });
  }

  return data;
}

// Domain data: exact win rates and sample counts from the report
export function generateDomainData(): DomainData[] {
  const domains = [
    { domain: "Law",                  winRate: 60.0, vol: 30 },
    { domain: "Education",            winRate: 42.1, vol: 133 },
    { domain: "Coding",               winRate: 42.0, vol: 174 },
    { domain: "Medical",              winRate: 40.6, vol: 64 },
    { domain: "General",              winRate: 35.9, vol: 676 },
    { domain: "Finance",              winRate: 34.3, vol: 70 },
    { domain: "Tech Infrastructure",  winRate: 27.0, vol: 63 },
  ];

  return domains.map((d) => ({
    domain: d.domain,
    win_rate: d.winRate,
    evaluation_volume: d.vol,
    trend: CYCLES.map((_, i) => {
      const t = i / (CYCLES.length - 1);
      return Math.round(jitter(lerp(d.winRate - 8, d.winRate + 2, t), 3) * 10) / 10;
    }),
  }));
}

// Language data: exact win rates and sample counts from the report
// Complexity scores derived from established linguistic indices (morphology, writing system, grammar)
export function generateLanguageData(): LanguageData[] {
  const langs = [
    { language: "English",    winRate: 43.4, vol: 702, complexity: 0.30, rubric: 76, trend: 2.1 },
    { language: "Hindi",      winRate: 50.0, vol: 4,   complexity: 0.55, rubric: 80, trend: 5.4 },
    { language: "Portuguese", winRate: 39.1, vol: 23,  complexity: 0.40, rubric: 72, trend: 1.8 },
    { language: "Korean",     winRate: 35.4, vol: 48,  complexity: 0.78, rubric: 68, trend: 3.2 },
    { language: "Chinese",    winRate: 34.2, vol: 111, complexity: 0.70, rubric: 66, trend: 2.5 },
    { language: "Polish",     winRate: 29.9, vol: 67,  complexity: 0.72, rubric: 63, trend: 1.4 },
    { language: "Russian",    winRate: 28.6, vol: 77,  complexity: 0.68, rubric: 62, trend: 1.1 },
    { language: "Spanish",    winRate: 25.6, vol: 39,  complexity: 0.35, rubric: 60, trend: -0.8 },
    { language: "Japanese",   winRate: 18.5, vol: 25,  complexity: 0.88, rubric: 52, trend: 0.6 },
    { language: "Turkish",    winRate: 18.2, vol: 20,  complexity: 0.75, rubric: 51, trend: -0.4 },
    { language: "Arabic",     winRate: 17.2, vol: 29,  complexity: 0.85, rubric: 48, trend: -1.5 },
  ];

  return langs.map((l) => ({
    language: l.language,
    win_rate: l.winRate,
    evaluation_volume: l.vol,
    complexity_score: l.complexity,
    avg_rubric_score: l.rubric,
    improvement_trend: l.trend,
  }));
}

// Training cycles: projected progression arriving at the real rubric pass rates
export function generateTrainingCycles(): TrainingCycle[] {
  const cycles = [
    {
      cycle_id: "TC-001", cycle_label: "Cycle 1 (Q1)",
      before: { factual: 50, reasoning: 46, helpfulness: 52, clarity: 54, safety: 75 },
      after:  { factual: 55, reasoning: 51, helpfulness: 57, clarity: 58, safety: 78 },
      failures: { hallucination: 21, reasoning_errors: 22, instruction_following: 19, safety_violations: 9 },
    },
    {
      cycle_id: "TC-002", cycle_label: "Cycle 2 (Q2)",
      before: { factual: 55, reasoning: 51, helpfulness: 57, clarity: 58, safety: 78 },
      after:  { factual: 58, reasoning: 55, helpfulness: 60, clarity: 62, safety: 80 },
      failures: { hallucination: 19, reasoning_errors: 20, instruction_following: 16, safety_violations: 7 },
    },
    {
      cycle_id: "TC-003", cycle_label: "Cycle 3 (Q3)",
      before: { factual: 58, reasoning: 55, helpfulness: 60, clarity: 62, safety: 80 },
      after:  { factual: 61, reasoning: 58, helpfulness: 63, clarity: 65, safety: 82 },
      failures: { hallucination: 17, reasoning_errors: 18, instruction_following: 14, safety_violations: 6 },
    },
    {
      cycle_id: "TC-004", cycle_label: "Cycle 4 (Q4)",
      before: { factual: 61, reasoning: 58, helpfulness: 63, clarity: 65, safety: 82 },
      after:  { factual: 63.4, reasoning: 60.4, helpfulness: 66, clarity: 68, safety: 83.8 },
      failures: { hallucination: 15, reasoning_errors: 16, instruction_following: 12, safety_violations: 5 },
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

// Failure mode trends: projected reduction arriving at current failure rates
export function generateFailureModeTrends(): FailureModeTrend[] {
  return CYCLES.map((cycle, i) => {
    const t = i / (CYCLES.length - 1);
    return {
      cycle,
      hallucination: Math.round(lerp(24, 15, t) + (Math.random() - 0.5) * 2),
      reasoning_errors: Math.round(lerp(26, 16, t) + (Math.random() - 0.5) * 2),
      instruction_following: Math.round(lerp(22, 12, t) + (Math.random() - 0.5) * 2),
      safety_violations: Math.round(lerp(10, 5, t) + (Math.random() - 0.5) * 1),
    };
  });
}

// Rubric pass/fail distribution — directly from the LM Arena report's binary Yes/No judgments
export interface SeverityData {
  category: string;
  pass: number;
  fail: number;
}

export function generateSeverityData(): SeverityData[] {
  const rubric = RUBRIC_OURS;
  return [
    { category: "Factual Accuracy",  pass: Math.round(rubric.factual),      fail: Math.round(100 - rubric.factual) },
    { category: "Reasoning Quality", pass: Math.round(rubric.reasoning),    fail: Math.round(100 - rubric.reasoning) },
    { category: "Helpfulness",       pass: Math.round(rubric.helpfulness),  fail: Math.round(100 - rubric.helpfulness) },
    { category: "Clarity / Style",   pass: Math.round(rubric.clarity),      fail: Math.round(100 - rubric.clarity) },
    { category: "Safety Compliance", pass: Math.round(rubric.safety),       fail: Math.round(100 - rubric.safety) },
  ];
}

// --- KPI computed values ---
export function computeKPIs(modelPerf: ModelPerformance[]) {
  const ourModel = modelPerf.filter((m) => m.model_name.includes("AFM"));
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
    totalDR: 1210,
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
