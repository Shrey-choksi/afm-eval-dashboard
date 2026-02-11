"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartAnnotation } from "@/components/chart-annotation";
import { SectionHeader } from "@/components/section-header";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { Languages, ArrowUpDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { generateLanguageData, type LanguageData } from "@/lib/mock-data";
import { useFilterStore } from "@/lib/store";
import { motion } from "framer-motion";

const LANG_FILTER_MAP: Record<string, string> = {
  english: "English",
  chinese: "Chinese (Mandarin)",
  spanish: "Spanish",
  arabic: "Arabic",
  french: "French",
  japanese: "Japanese",
};

function BubbleTooltip({ active, payload }: {active?: boolean; payload?: Array<{payload: LanguageData}>}) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-border/50 bg-popover/95 px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="mb-1.5 text-xs font-semibold">{d.language}</p>
      <div className="space-y-0.5 text-[11px] text-muted-foreground">
        <p>Win Rate: <span className="font-semibold text-foreground">{d.win_rate}%</span></p>
        <p>Complexity: <span className="font-semibold text-foreground">{d.complexity_score.toFixed(2)}</span></p>
        <p>Evaluations: <span className="font-semibold text-foreground">{d.evaluation_volume.toLocaleString()}</span></p>
        <p>Rubric Score: <span className="font-semibold text-foreground">{d.avg_rubric_score}</span></p>
      </div>
    </div>
  );
}

type SortKey = "win_rate" | "evaluation_volume" | "avg_rubric_score" | "improvement_trend";

export function MultilingualInsights() {
  const allLangData = useMemo(() => generateLanguageData(), []);
  const { selectedLanguage } = useFilterStore();
  const [sortKey, setSortKey] = useState<SortKey>("win_rate");
  const [sortAsc, setSortAsc] = useState(false);

  const langData = useMemo(() => {
    if (selectedLanguage === "all") return allLangData;
    const target = LANG_FILTER_MAP[selectedLanguage];
    if (!target) return allLangData;
    return allLangData.filter((l) => l.language === target);
  }, [allLangData, selectedLanguage]);

  const sorted = useMemo(() => {
    return [...langData].sort((a, b) =>
      sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
  }, [langData, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="cursor-pointer px-3 py-2.5 text-left text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? "text-violet-400" : ""}`} />
      </div>
    </th>
  );

  return (
    <section>
      <SectionHeader
        id="multilingual"
        icon={Languages}
        title="Multilingual Performance Insights"
        description="Cross-lingual reliability and performance across language families"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bubble Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Language Complexity vs Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-border/20"
                    />
                    <XAxis
                      dataKey="complexity_score"
                      type="number"
                      name="Complexity"
                      tick={{ fontSize: 10 }}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                      domain={[0.2, 1]}
                      label={{ value: "Language Complexity", position: "bottom", fontSize: 10, fill: "currentColor", className: "text-muted-foreground" }}
                    />
                    <YAxis
                      dataKey="win_rate"
                      type="number"
                      name="Win Rate"
                      tick={{ fontSize: 10 }}
                      stroke="currentColor"
                      className="text-muted-foreground/50"
                      tickLine={false}
                      axisLine={false}
                      domain={[55, 90]}
                      tickFormatter={(v) => `${v}%`}
                      label={{ value: "Win Rate %", angle: -90, position: "insideLeft", fontSize: 10, fill: "currentColor", className: "text-muted-foreground" }}
                    />
                    <ZAxis
                      dataKey="evaluation_volume"
                      type="number"
                      range={[100, 1200]}
                      name="Volume"
                    />
                    <Tooltip content={<BubbleTooltip />} />
                    <Scatter
                      data={langData}
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      animationDuration={1200}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <ChartAnnotation text="Clear inverse correlation between language complexity and win rate. English leads at 82%, while high-complexity languages (Arabic, Japanese) cluster around 62-66%. Bubble size shows evaluation volume — high-resource languages benefit from more training data." />
            </CardContent>
          </Card>
        </motion.div>

        {/* Language Ranking Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Language Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[420px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card/95 backdrop-blur-sm">
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-2.5 text-left text-[11px] font-medium text-muted-foreground">
                        Language
                      </th>
                      <SortHeader label="Win Rate" field="win_rate" />
                      <SortHeader label="DR Count" field="evaluation_volume" />
                      <SortHeader label="Rubric" field="avg_rubric_score" />
                      <SortHeader label="Trend" field="improvement_trend" />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((lang, i) => (
                      <tr
                        key={lang.language}
                        className="border-b border-border/30 transition-colors hover:bg-accent/50"
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground w-4">
                              {i + 1}
                            </span>
                            <span className="text-xs font-medium">
                              {lang.language}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-border/50 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${lang.win_rate}%`,
                                  backgroundColor: getPerformanceColor(lang.win_rate),
                                }}
                              />
                            </div>
                            <span className="text-xs tabular-nums">{lang.win_rate}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums">
                          {lang.evaluation_volume.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-xs tabular-nums">
                          {lang.avg_rubric_score}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-medium ${
                              lang.improvement_trend >= 0
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {lang.improvement_trend >= 0 ? (
                              <ArrowUpRight className="mr-0.5 h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="mr-0.5 h-3 w-3" />
                            )}
                            {lang.improvement_trend >= 0 ? "+" : ""}
                            {lang.improvement_trend.toFixed(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3">
                <ChartAnnotation text="English and Portuguese lead in rubric quality. Turkish and Arabic represent the highest-opportunity languages for targeted multilingual training." />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function getPerformanceColor(value: number): string {
  if (value >= 80) return "#22c55e";
  if (value >= 70) return "#8b5cf6";
  if (value >= 60) return "#eab308";
  return "#ef4444";
}
