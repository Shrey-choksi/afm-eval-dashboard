"use client";

import { Sparkles } from "lucide-react";

export function ChartAnnotation({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg bg-violet-500/5 px-3 py-2 border border-violet-500/10">
      <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
