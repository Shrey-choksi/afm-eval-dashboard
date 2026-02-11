"use client";

import { type LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  id: string;
}

export function SectionHeader({ icon: Icon, title, description, id }: SectionHeaderProps) {
  return (
    <div id={`section-${id}`} className="scroll-mt-8 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20">
          <Icon className="h-4 w-4 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
