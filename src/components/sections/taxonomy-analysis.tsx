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
      (m) => m.cycle === latestCycle && m.model_name.includes("AFM v3")
    );
    const sotaModel = modelPerf.find(
      (m) => m.cycle === latestCycle && m.model_name.includes("GPT-4o")
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
      "AFM v3": ourModel?.rubric_scores[dim] ?? 0,
      "GPT-4o (SOTA)": sotaModel?.rubric_scores[dim] ?? 0,
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
                      name="GPT-4o (SOTA)"
                      dataKey="GPT-4o (SOTA)"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      animationDuration={1200}
                    />
                    <Radar
                      name="AFM v3"
                      dataKey="AFM v3"
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
              <ChartAnnotation text="AFM v3 trails GPT-4o (SOTA) by 10-18pp across all rubric dimensions. Factual Accuracy and Reasoning show the widest gaps — highest-impact areas for the next training cycle. Safety Compliance is closest to parity." />
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
                Rubric Severity Distribution
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
                      dataKey="no_issues"
                      name="No Issues"
                      stackId="a"
                      fill="#22c55e"
                      radius={[0, 0, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="minor_issues"
                      name="Minor Issues"
                      stackId="a"
                      fill="#eab308"
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="major_issues"
                      name="Major Issues"
                      stackId="a"
                      fill="#ef4444"
                      radius={[0, 4, 4, 0]}
                      animationDuration={1200}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ChartAnnotation text="Safety Compliance has the highest 'No Issues' rate at 88%. Reasoning Quality has the most Major Issues (12%), confirming it as the top priority for targeted fine-tuning." />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
