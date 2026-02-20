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
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="medical">Medical</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="infrastructure">Tech Infrastructure</SelectItem>
          <SelectItem value="legal">Law</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedLanguage} onValueChange={setLanguage}>
        <SelectTrigger className="h-8 w-[140px] text-xs bg-card/50 border-border/50">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="hindi">Hindi</SelectItem>
          <SelectItem value="portuguese">Portuguese</SelectItem>
          <SelectItem value="korean">Korean</SelectItem>
          <SelectItem value="chinese">Chinese</SelectItem>
          <SelectItem value="polish">Polish</SelectItem>
          <SelectItem value="russian">Russian</SelectItem>
          <SelectItem value="spanish">Spanish</SelectItem>
          <SelectItem value="japanese">Japanese</SelectItem>
          <SelectItem value="turkish">Turkish</SelectItem>
          <SelectItem value="arabic">Arabic</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedModelVersion} onValueChange={setModelVersion}>
        <SelectTrigger className="h-8 w-[160px] text-xs bg-card/50 border-border/50">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Models</SelectItem>
          <SelectItem value="afm">AFM (Ours)</SelectItem>
          <SelectItem value="gpt-5">GPT-5</SelectItem>
          <SelectItem value="claude-opus-4">Claude Opus 4</SelectItem>
          <SelectItem value="o3-o4">O3/O4</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
