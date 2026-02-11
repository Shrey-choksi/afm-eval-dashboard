"use client";

import { Sidebar } from "@/components/sidebar";
import { FiltersPanel } from "@/components/filters-panel";
import { PerformanceOverview } from "@/components/sections/performance-overview";
import { TaxonomyAnalysis } from "@/components/sections/taxonomy-analysis";
import { DomainBreakdown } from "@/components/sections/domain-breakdown";
import { MultilingualInsights } from "@/components/sections/multilingual-insights";
import { TrainingImpact } from "@/components/sections/training-impact";
import { AIInsights } from "@/components/sections/ai-insights";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[260px] flex-1 min-h-screen">
        {/* Background gradient */}
        <div className="pointer-events-none fixed inset-0 ml-[260px]">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/[0.04] blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-[120px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-3">
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight">
                Model Evaluation Dashboard
              </h1>
              <p className="text-[11px] text-muted-foreground">
                AFM v3 — Evaluation Period: Jan 2025 – Dec 2025
              </p>
            </div>
            <FiltersPanel />
          </div>
        </header>

        {/* Dashboard Sections */}
        <div className="relative space-y-12 px-8 py-8">
          <PerformanceOverview />
          <Separator className="opacity-30" />
          <TaxonomyAnalysis />
          <Separator className="opacity-30" />
          <DomainBreakdown />
          <Separator className="opacity-30" />
          <MultilingualInsights />
          <Separator className="opacity-30" />
          <TrainingImpact />
          <Separator className="opacity-30" />
          <AIInsights />

          {/* Footer */}
          <footer className="border-t border-border/30 pt-6 pb-8 text-center">
            <p className="text-xs text-muted-foreground/60">
              AFM Eval Dashboard v3.2.0 — Built for research teams and
              model evaluation workflows
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
