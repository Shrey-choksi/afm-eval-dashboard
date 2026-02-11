import { create } from "zustand";

interface FilterState {
  selectedDomain: string;
  selectedLanguage: string;
  selectedModelVersion: string;
  timeRange: [number, number]; // cycle index range
  activeSection: string;
  setDomain: (domain: string) => void;
  setLanguage: (lang: string) => void;
  setModelVersion: (version: string) => void;
  setTimeRange: (range: [number, number]) => void;
  setActiveSection: (section: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedDomain: "all",
  selectedLanguage: "all",
  selectedModelVersion: "all",
  timeRange: [0, 11],
  activeSection: "overview",
  setDomain: (domain) => set({ selectedDomain: domain }),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  setModelVersion: (version) => set({ selectedModelVersion: version }),
  setTimeRange: (range) => set({ timeRange: range }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
