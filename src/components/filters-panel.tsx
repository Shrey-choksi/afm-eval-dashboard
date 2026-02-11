"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStore } from "@/lib/store";
import { Filter } from "lucide-react";

export function FiltersPanel() {
  const {
    selectedDomain,
    selectedLanguage,
    selectedModelVersion,
    setDomain,
    setLanguage,
    setModelVersion,
  } = useFilterStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        <span>Filters</span>
      </div>

      <Select value={selectedDomain} onValueChange={setDomain}>
        <SelectTrigger className="h-8 w-[150px] text-xs bg-card/50 border-border/50">
          <SelectValue placeholder="Domain" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Domains</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="coding">Coding</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="medical">Medical</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="infrastructure">Infrastructure</SelectItem>
          <SelectItem value="legal">Legal</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedLanguage} onValueChange={setLanguage}>
        <SelectTrigger className="h-8 w-[140px] text-xs bg-card/50 border-border/50">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="chinese">Chinese</SelectItem>
          <SelectItem value="spanish">Spanish</SelectItem>
          <SelectItem value="arabic">Arabic</SelectItem>
          <SelectItem value="french">French</SelectItem>
          <SelectItem value="japanese">Japanese</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedModelVersion} onValueChange={setModelVersion}>
        <SelectTrigger className="h-8 w-[160px] text-xs bg-card/50 border-border/50">
          <SelectValue placeholder="Model Version" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Versions</SelectItem>
          <SelectItem value="afm-v3">AFM v3</SelectItem>
          <SelectItem value="afm-v2">AFM v2</SelectItem>
          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          <SelectItem value="claude-3.5">Claude 3.5</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
