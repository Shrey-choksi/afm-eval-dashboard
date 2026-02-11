"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  Download,
  ArrowUpRight,
  Shield,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const insights = [
  {
    type: "improvement",
    icon: TrendingUp,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    title: "Biggest Improvement Area",
    metric: "+18pp Win Rate",
    description:
      "Reasoning Quality showed the largest improvement this quarter, jumping from 62% to 80% accuracy. This correlates directly with the chain-of-thought training data introduced in Cycle 3.",
    tags: ["Reasoning", "CoT Training", "Q3 Impact"],
  },
  {
    type: "weakness",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    title: "Largest Weakness",
    metric: "58% Win Rate",
    description:
      "Legal & Compliance domain remains the weakest vertical at 58% win rate. The model struggles with jurisdiction-specific reasoning and regulatory citation accuracy. Recommend targeted legal corpus augmentation.",
    tags: ["Legal Domain", "Data Gap", "Priority"],
  },
  {
    type: "focus",
    icon: Target,
    iconColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    title: "Recommended Training Focus",
    metric: "3 Priority Areas",
    description:
      "For the next training cycle, prioritize: (1) Legal domain data augmentation, (2) Arabic and Japanese multilingual capability, (3) Complex multi-step reasoning chains. Expected impact: +8-12pp overall win rate.",
    tags: ["Next Cycle", "Multilingual", "Reasoning"],
  },
];

const quickStats = [
  {
    icon: Shield,
    label: "Safety Score",
    value: "93%",
    trend: "+3pp",
    color: "text-emerald-400",
  },
  {
    icon: Zap,
    label: "Inference Latency",
    value: "124ms",
    trend: "-18ms",
    color: "text-blue-400",
  },
  {
    icon: BookOpen,
    label: "Training Data",
    value: "2.4M",
    trend: "+340K",
    color: "text-violet-400",
  },
];

export function AIInsights() {
  return (
    <section>
      <SectionHeader
        id="insights"
        icon={Sparkles}
        title="AI Insight Summary"
        description="Auto-generated analysis of model performance patterns and recommendations"
      />

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="border-border/50 bg-gradient-to-r from-violet-500/[0.07] to-blue-500/[0.07] backdrop-blur-sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4 px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium">Model Health Score</span>
              <Badge className="bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                87 / 100
              </Badge>
            </div>
            <div className="flex flex-wrap gap-6">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <span className="text-xs font-semibold">{stat.value}</span>
                  <span className="text-[10px] text-emerald-500">{stat.trend}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card
              className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-${insight.borderColor} hover:shadow-lg h-full`}
            >
              <div className={`absolute inset-0 ${insight.bgColor} opacity-0 transition-opacity group-hover:opacity-100`} />
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${insight.bgColor}`}>
                      <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {insight.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${insight.bgColor} ${insight.iconColor} text-[10px] font-semibold`}
                  >
                    {insight.metric}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  {insight.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {insight.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4 px-6">
            <div>
              <p className="text-sm font-medium">Export Report</p>
              <p className="text-xs text-muted-foreground">
                Download the full evaluation report for stakeholder review
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => {
                  window.print();
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Export as PDF
              </Button>
              <Button
                size="sm"
                className="text-xs gap-1.5 bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Share Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
