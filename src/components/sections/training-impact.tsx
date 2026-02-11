"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartAnnotation } from "@/components/chart-annotation";
import { SectionHeader } from "@/components/section-header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  generateTrainingCycles,
  generateFailureModeTrends,
  type TrainingCycle,
} from "@/lib/mock-data";
import { motion } from "framer-motion";

function CustomTooltip({ active, payload, label }: {active?: boolean; payload?: Array<{value: number; name: string; color: string}>; label?: string}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function buildComparisonData(cycle: TrainingCycle) {
  const dims = ["factual", "reasoning", "helpfulness", "clarity", "safety"] as const;
  const labels: Record<string, string> = {
    factual: "Factual",
    reasoning: "Reasoning",
    helpfulness: "Helpful",
    clarity: "Clarity",
    safety: "Safety",
  };

  return dims.map((dim) => ({
    dimension: labels[dim],
    Before: cycle.before_scores[dim],
    After: cycle.after_scores[dim],
    improvement: cycle.after_scores[dim] - cycle.before_scores[dim],
  }));
}

function getCycleAnnotation(index: number): string {
  const annotations = [
    "Cycle 1 focused on foundational quality improvements. Factual accuracy saw the largest gain (+8pp), driven by retrieval-augmented training data introduced in Q1.",
    "Cycle 2 delivered broad improvements across all dimensions. Helpfulness jumped +6pp as instruction-tuning datasets were expanded significantly.",
    "Cycle 3 was the most impactful cycle — Reasoning improved +6pp through chain-of-thought fine-tuning. All dimensions crossed the 78+ threshold.",
    "Cycle 4 training delivered +5pp average improvement across all dimensions. Reasoning saw the largest gain (+5pp), confirming the effectiveness of chain-of-thought fine-tuning.",
  ];
  return annotations[index] ?? annotations[3];
}

export function TrainingImpact() {
  const trainingCycles = useMemo(() => generateTrainingCycles(), []);
  const failureTrends = useMemo(() => generateFailureModeTrends(), []);
  const [selectedCycleIndex, setSelectedCycleIndex] = useState(trainingCycles.length - 1);

  const selectedCycle = trainingCycles[selectedCycleIndex];
  const comparisonData = useMemo(
    () => buildComparisonData(selectedCycle),
    [selectedCycle]
  );

  return (
    <section>
      <SectionHeader
        id="training"
        icon={TrendingUp}
        title="Training Impact Tracking"
        description="ROI of training cycles — before vs after performance and failure reduction"
      />

      {/* Cycle badges — all clickable */}
      <div className="mb-4 flex flex-wrap gap-2">
        {trainingCycles.map((cycle, i) => {
          const isSelected = i === selectedCycleIndex;
          return (
            <button
              key={cycle.cycle_id}
              onClick={() => setSelectedCycleIndex(i)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-sm shadow-violet-500/10"
                  : "border-border/50 bg-card/50 text-muted-foreground hover:border-violet-500/20 hover:bg-violet-500/5 hover:text-foreground"
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  isSelected
                    ? "bg-violet-500"
                    : "bg-muted-foreground/30"
                }`}
              />
              {cycle.cycle_label}
              {isSelected && (
                <span className="text-[10px] font-medium">(Selected)</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Before vs After */}
        <motion.div
          key={`comparison-${selectedCycleIndex}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Before vs After Training — {selectedCycle.cycle_label}
                </CardTitle>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-[#6b7280]" />
                    Before
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                    After
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-border/20"
                    />
                    <XAxis
                      dataKey="dimension"
                      tick={{ fontSize: 11 }}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="Before"
                      fill="#6b7280"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="After"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Improvement badges */}
              <div className="mt-2 flex flex-wrap gap-2">
                {comparisonData.map((d) => (
                  <div
                    key={d.dimension}
                    className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-500"
                  >
                    {d.dimension}: +{d.improvement}pp
                  </div>
                ))}
              </div>
              <ChartAnnotation text={getCycleAnnotation(selectedCycleIndex)} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Failure Mode Reduction */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Failure Mode Reduction Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={failureTrends}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="hallGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="reasonGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="instrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#eab308" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#eab308" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-border/20"
                    />
                    <XAxis
                      dataKey="cycle"
                      tick={{ fontSize: 10 }}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Area
                      type="monotone"
                      dataKey="hallucination"
                      name="Hallucination"
                      stackId="1"
                      stroke="#ef4444"
                      fill="url(#hallGrad)"
                      strokeWidth={1.5}
                      animationDuration={1200}
                    />
                    <Area
                      type="monotone"
                      dataKey="reasoning_errors"
                      name="Reasoning Errors"
                      stackId="1"
                      stroke="#f97316"
                      fill="url(#reasonGrad)"
                      strokeWidth={1.5}
                      animationDuration={1200}
                    />
                    <Area
                      type="monotone"
                      dataKey="instruction_following"
                      name="Instruction Following"
                      stackId="1"
                      stroke="#eab308"
                      fill="url(#instrGrad)"
                      strokeWidth={1.5}
                      animationDuration={1200}
                    />
                    <Area
                      type="monotone"
                      dataKey="safety_violations"
                      name="Safety Violations"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="url(#safeGrad)"
                      strokeWidth={1.5}
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <ChartAnnotation text="Total failure rate reduced from ~73% to ~19% over 12 months. Hallucinations dropped 72% (from 22% to ~6%). Safety violations are now under 1%, meeting production thresholds." />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
