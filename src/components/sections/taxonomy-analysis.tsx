"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartAnnotation } from "@/components/chart-annotation";
import { SectionHeader } from "@/components/section-header";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Brain } from "lucide-react";
import {
  generateModelPerformance,
  generateSeverityData,
  CYCLES,
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
          <span className="font-semibold">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function TaxonomyAnalysis() {
  const modelPerf = useMemo(() => generateModelPerformance(), []);
  const severityData = useMemo(() => generateSeverityData(), []);

  // Get latest cycle data for radar
  const radarData = useMemo(() => {
    const latestCycle = CYCLES[CYCLES.length - 1];
    const ourModel = modelPerf.find(
      (m) => m.cycle === latestCycle && m.model_name.includes("AFM")
    );
    const sotaModel = modelPerf.find(
      (m) => m.cycle === latestCycle && m.model_name.includes("O3/O4")
    );

    const dimensions = [
      "factual",
      "reasoning",
      "helpfulness",
      "clarity",
      "safety",
    ] as const;
    const labels: Record<string, string> = {
      factual: "Factual Accuracy",
      reasoning: "Reasoning Quality",
      helpfulness: "Helpfulness",
      clarity: "Clarity / Style",
      safety: "Safety Compliance",
    };

    return dimensions.map((dim) => ({
      dimension: labels[dim],
      "AFM (Ours)": ourModel?.rubric_scores[dim] ?? 0,
      "O3/O4 (SOTA)": sotaModel?.rubric_scores[dim] ?? 0,
    }));
  }, [modelPerf]);

  return (
    <section>
      <SectionHeader
        id="taxonomy"
        icon={Brain}
        title="Taxonomy Performance Analysis"
        description="Reveal WHY the model wins or loses across quality dimensions"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Rubric Dimension Radar — Latest Cycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid
                      stroke="currentColor"
                      className="text-border/30"
                    />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fontSize: 10, fill: "currentColor" }}
                      className="text-muted-foreground"
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 9 }}
                      stroke="currentColor"
                      className="text-muted-foreground/40"
                    />
                    <Radar
                      name="O3/O4 (SOTA)"
                      dataKey="O3/O4 (SOTA)"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      animationDuration={1200}
                    />
                    <Radar
                      name="AFM (Ours)"
                      dataKey="AFM (Ours)"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                      strokeWidth={2.5}
                      animationDuration={1200}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <ChartAnnotation text="AFM trails SOTA by 10-18pp across rubric dimensions. The widest gaps are in Reasoning Quality (60.4% vs 76.6%) and Factual Accuracy (63.4% vs 74.2%). Safety/Policy Adherence is closest to parity at 83.8% vs 83.1% — indicating robust safety measures already in place." />
            </CardContent>
          </Card>
        </motion.div>

        {/* Rubric Severity Stacked Bar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Rubric Pass / Fail Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={severityData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-border/20"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={110}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar
                      dataKey="pass"
                      name="Pass (Yes)"
                      stackId="a"
                      fill="#22c55e"
                      radius={[0, 0, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="fail"
                      name="Fail (No)"
                      stackId="a"
                      fill="#ef4444"
                      radius={[0, 4, 4, 0]}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ChartAnnotation text="Safety Compliance has the highest pass rate at 83.8%. Reasoning Quality carries the most failures (39.6% fail rate), confirming it as the top priority for targeted training — target: reach 70%+ in the next iteration." />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
