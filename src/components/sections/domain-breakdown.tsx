"use client";

import { useMemo } from "react";
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
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import {
  generateDomainData,
  generateHeatmapData,
  CYCLES,
} from "@/lib/mock-data";
import { useFilterStore } from "@/lib/store";
import { motion } from "framer-motion";

const DOMAIN_FILTER_MAP: Record<string, string> = {
  general: "General Knowledge",
  coding: "Coding & Engineering",
  finance: "Finance & Analytics",
  medical: "Medical & Health",
  education: "Education",
  infrastructure: "Infrastructure & DevOps",
  legal: "Legal & Compliance",
};

function getPerformanceColor(value: number): string {
  if (value >= 80) return "#22c55e";
  if (value >= 70) return "#8b5cf6";
  if (value >= 60) return "#eab308";
  return "#ef4444";
}

function getHeatmapColor(value: number): string {
  if (value >= 85) return "rgba(34, 197, 94, 0.8)";
  if (value >= 78) return "rgba(34, 197, 94, 0.5)";
  if (value >= 72) return "rgba(139, 92, 246, 0.5)";
  if (value >= 65) return "rgba(234, 179, 8, 0.5)";
  if (value >= 58) return "rgba(234, 179, 8, 0.3)";
  return "rgba(239, 68, 68, 0.4)";
}

function CustomTooltip({ active, payload }: {active?: boolean; payload?: Array<{value: number; payload: {domain: string; evaluation_volume: number}}>}) {
  if (!active || !payload || !payload[0]) return null;
  const data = payload[0];
  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="mb-1 text-xs font-medium">{data.payload.domain}</p>
      <p className="text-xs text-muted-foreground">
        Win Rate: <span className="font-semibold text-foreground">{data.value.toFixed(1)}%</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Volume: <span className="font-semibold text-foreground">{data.payload.evaluation_volume.toLocaleString()}</span>
      </p>
    </div>
  );
}

export function DomainBreakdown() {
  const allDomainData = useMemo(() => generateDomainData(), []);
  const { selectedDomain } = useFilterStore();

  const domainData = useMemo(() => {
    if (selectedDomain === "all") return allDomainData;
    const target = DOMAIN_FILTER_MAP[selectedDomain];
    if (!target) return allDomainData;
    return allDomainData.filter((d) => d.domain === target);
  }, [allDomainData, selectedDomain]);

  const heatmapData = useMemo(() => generateHeatmapData(domainData), [domainData]);

  const sortedDomains = useMemo(
    () => [...domainData].sort((a, b) => b.win_rate - a.win_rate),
    [domainData]
  );

  // Unique domains for heatmap rows
  const domains = domainData.map((d) => d.domain);
  const displayCycles = CYCLES.filter((_, i) => i % 2 === 0 || i === CYCLES.length - 1);

  return (
    <section>
      <SectionHeader
        id="domain"
        icon={BarChart3}
        title="Domain Performance Breakdown"
        description="Model strengths and weaknesses across usage verticals"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Horizontal Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Win Rate by Domain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedDomains}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-border/20"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="domain"
                      type="category"
                      tick={{ fontSize: 10 }}
                      width={140}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="win_rate"
                      radius={[0, 6, 6, 0]}
                      animationDuration={1200}
                      barSize={24}
                    >
                      {sortedDomains.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={getPerformanceColor(entry.win_rate)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ChartAnnotation text="Education is the strongest domain at 82%+ win rate. Legal & Compliance lags behind at ~58%, suggesting need for domain-specific training data augmentation." />
            </CardContent>
          </Card>
        </motion.div>

        {/* Domain Trend Heatmap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Domain Performance Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr>
                      <th className="py-2 text-left font-medium text-muted-foreground w-[130px]">
                        Domain
                      </th>
                      {displayCycles.map((c) => (
                        <th
                          key={c}
                          className="px-1 py-2 text-center font-medium text-muted-foreground"
                        >
                          {c.replace(" 2025", "")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain) => (
                      <tr key={domain}>
                        <td className="py-1.5 pr-2 text-xs text-muted-foreground truncate max-w-[130px]">
                          {domain}
                        </td>
                        {displayCycles.map((cycle) => {
                          const cell = heatmapData.find(
                            (h) => h.domain === domain && h.cycle === cycle
                          );
                          return (
                            <td key={cycle} className="px-1 py-1.5">
                              <div
                                className="mx-auto flex h-8 w-full items-center justify-center rounded-md text-[10px] font-medium text-white transition-all hover:scale-105"
                                style={{
                                  backgroundColor: getHeatmapColor(
                                    cell?.value ?? 0
                                  ),
                                }}
                                title={`${domain} — ${cycle}: ${cell?.value?.toFixed(1)}%`}
                              >
                                {cell?.value?.toFixed(0)}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Legend */}
                <div className="mt-3 flex items-center justify-end gap-2">
                  <span className="text-[10px] text-muted-foreground">Weak</span>
                  <div className="flex gap-0.5">
                    {["rgba(239,68,68,0.4)", "rgba(234,179,8,0.3)", "rgba(234,179,8,0.5)", "rgba(139,92,246,0.5)", "rgba(34,197,94,0.5)", "rgba(34,197,94,0.8)"].map((c, i) => (
                      <div
                        key={i}
                        className="h-3 w-6 rounded-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Strong</span>
                </div>
              </div>
              <ChartAnnotation text="All domains show positive trends. Education and General Knowledge lead consistently, while Legal shows the fastest rate of improvement — a +14pp gain since January." />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
