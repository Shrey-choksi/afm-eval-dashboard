"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/animated-counter";
import { ChartAnnotation } from "@/components/chart-annotation";
import { SectionHeader } from "@/components/section-header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  LineChart as LineChartIcon,
  Trophy,
  FileCheck2,
  Star,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  generateModelPerformance,
  computeKPIs,
  CYCLES,
} from "@/lib/mock-data";
import { useFilterStore } from "@/lib/store";
import { motion } from "framer-motion";

function MiniSparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke="#8b5cf6"
            strokeWidth={1.5}
            fill="url(#sparkGrad)"
            dot={false}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPICard({
  title,
  value,
  change,
  suffix,
  prefix,
  icon: Icon,
  sparkData,
  delay,
  decimals,
}: {
  title: string;
  value: number;
  change: number;
  suffix?: string;
  prefix?: string;
  icon: React.ElementType;
  sparkData: number[];
  delay: number;
  decimals?: number;
}) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-blue-500/[0.03] opacity-0 transition-opacity group-hover:opacity-100" />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10">
                  <Icon className="h-3.5 w-3.5 text-violet-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{title}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                </span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] font-medium ${
                    isPositive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="mr-0.5 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-0.5 h-3 w-3" />
                  )}
                  {isPositive ? "+" : ""}
                  {change.toFixed(1)}
                </Badge>
              </div>
            </div>
            <MiniSparkline data={sparkData} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const MODEL_COLORS: Record<string, string> = {
  "AFM v3 (Ours)": "#8b5cf6",
  "GPT-4o": "#3b82f6",
  "Claude 3.5": "#06b6d4",
  "AFM v2 (Legacy)": "#6b7280",
};

const MODEL_FILTER_MAP: Record<string, string> = {
  "afm-v3": "AFM v3 (Ours)",
  "afm-v2": "AFM v2 (Legacy)",
  "gpt-4o": "GPT-4o",
  "claude-3.5": "Claude 3.5",
};

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
          <span className="font-semibold">{entry.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export function PerformanceOverview() {
  const modelPerf = useMemo(() => generateModelPerformance(), []);
  const kpis = useMemo(() => computeKPIs(modelPerf), [modelPerf]);
  const { selectedModelVersion } = useFilterStore();

  // Filter models based on selected version
  const filteredModelNames = useMemo(() => {
    const allNames = [...new Set(modelPerf.map((m) => m.model_name))];
    if (selectedModelVersion === "all") return allNames;
    const target = MODEL_FILTER_MAP[selectedModelVersion];
    if (!target) return allNames;
    // Always show the selected model + keep AFM v3 for reference
    return allNames.filter(
      (n) => n === target || n === "AFM v3 (Ours)"
    );
  }, [modelPerf, selectedModelVersion]);

  // Build chart data
  const chartData = useMemo(() => {
    return CYCLES.map((cycle) => {
      const entry: Record<string, string | number> = { cycle };
      const cycleModels = modelPerf.filter(
        (m) => m.cycle === cycle && filteredModelNames.includes(m.model_name)
      );
      for (const m of cycleModels) {
        entry[m.model_name] = m.win_rate;
      }
      return entry;
    });
  }, [modelPerf, filteredModelNames]);

  return (
    <section>
      <SectionHeader
        id="overview"
        icon={LineChartIcon}
        title="Global Performance Overview"
        description="Instant snapshot of model competitiveness across evaluation cycles"
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Win Rate vs SOTA"
          value={kpis.winRate}
          change={kpis.winRateChange}
          suffix="%"
          icon={Trophy}
          sparkData={kpis.sparkData}
          delay={0}
        />
        <KPICard
          title="Total DR Evaluated"
          value={kpis.totalDR}
          change={1240}
          suffix=""
          icon={FileCheck2}
          sparkData={kpis.sparkData.map((v) => v * 600)}
          delay={0.1}
          decimals={0}
        />
        <KPICard
          title="Avg Rubric Score"
          value={kpis.avgRubric}
          change={3.2}
          suffix=""
          icon={Star}
          sparkData={kpis.sparkData.map((v) => v * 1.1)}
          delay={0.2}
        />
        <KPICard
          title="Improvement (Cycle)"
          value={kpis.improvement}
          change={kpis.improvement}
          suffix="pp"
          prefix="+"
          icon={TrendingUp}
          sparkData={kpis.sparkData}
          delay={0.3}
        />
      </div>

      {/* Model Comparison Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Win Rate Trend — Model Comparison
              </CardTitle>
              <div className="flex flex-wrap gap-3">
                {filteredModelNames.map((name) => (
                  <div key={name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: MODEL_COLORS[name] || "#888",
                      }}
                    />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-border/30"
                  />
                  <XAxis
                    dataKey="cycle"
                    tick={{ fontSize: 11 }}
                    stroke="currentColor"
                    className="text-muted-foreground/50"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="currentColor"
                    className="text-muted-foreground/50"
                    tickLine={false}
                    axisLine={false}
                    domain={[40, 90]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {filteredModelNames.map((name) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={MODEL_COLORS[name] || "#888"}
                      strokeWidth={name.includes("Ours") ? 2.5 : 1.5}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2 }}
                      strokeDasharray={
                        name.includes("Legacy") ? "5 5" : undefined
                      }
                      animationDuration={1500}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ChartAnnotation text="AFM v3 shows a strong upward trajectory, narrowing the gap with GPT-4o and Claude 3.5 by 18pp since January. The steepest improvement occurred between Q2 and Q3, correlating with training cycle 3." />
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
