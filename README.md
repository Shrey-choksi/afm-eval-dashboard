# Aurora Eval Dashboard

A premium, research-grade **Model Evaluation & Training Insight Dashboard** for frontier LLM benchmarking. Built for AI researchers and model teams to visualize performance, diagnose weaknesses, and track training impact.

## Architecture

```
src/
├── app/
│   ├── globals.css          # Theme variables, scrollbar, print styles
│   ├── layout.tsx           # Root layout with ThemeProvider + TooltipProvider
│   └── page.tsx             # Main dashboard page (client component)
├── components/
│   ├── ui/                  # ShadCN UI primitives (card, badge, button, etc.)
│   ├── sections/
│   │   ├── performance-overview.tsx   # Section 1: KPI cards + line chart
│   │   ├── taxonomy-analysis.tsx      # Section 2: Radar + severity bar
│   │   ├── domain-breakdown.tsx       # Section 3: Horizontal bar + heatmap
│   │   ├── multilingual-insights.tsx  # Section 4: Bubble chart + ranking table
│   │   ├── training-impact.tsx        # Section 5: Before/after + stacked area
│   │   └── ai-insights.tsx            # AI summary panel + export
│   ├── sidebar.tsx           # Sticky sidebar navigation + theme toggle
│   ├── filters-panel.tsx     # Domain/language/model version filters
│   ├── animated-counter.tsx  # Smooth number animation component
│   ├── chart-annotation.tsx  # Insight annotation below each chart
│   ├── section-header.tsx    # Reusable section title with icon
│   └── theme-provider.tsx    # next-themes wrapper
└── lib/
    ├── mock-data.ts          # Realistic mock dataset generators
    ├── store.ts              # Zustand filter state management
    └── utils.ts              # cn() utility
```

## Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Framework   | Next.js 16 (App Router)          |
| Language    | TypeScript                       |
| Styling     | TailwindCSS v4 + CSS Variables   |
| Components  | ShadCN UI (New York style)       |
| Charts      | Recharts                         |
| Animations  | Framer Motion                    |
| State       | Zustand                          |
| Theming     | next-themes (dark/light)         |
| Icons       | Lucide React                     |

## Dashboard Sections

### 1. Global Performance Overview
- **KPI Cards** with animated counters, sparkline trends, and color-coded indicators
- **Multi-model line chart** comparing win rates across evaluation cycles

### 2. Taxonomy Performance Analysis
- **Radar chart** overlaying client model vs SOTA across 5 rubric dimensions
- **Stacked bar chart** showing severity distribution (No Issues / Minor / Major)

### 3. Domain Performance Breakdown
- **Horizontal bar chart** with color-gradient performance tiers per domain
- **Heatmap table** showing domain scores across evaluation cycles

### 4. Multilingual Performance Insights
- **Bubble chart** plotting language complexity vs win rate (bubble size = volume)
- **Sortable ranking table** with inline progress bars and trend badges

### 5. Training Impact Tracking
- **Before vs After bar chart** for the latest training cycle
- **Stacked area chart** showing failure mode reduction over time

### 6. AI Insight Summary
- **Model Health Score** with quick stats bar
- **3 insight cards**: Biggest Improvement, Largest Weakness, Recommended Focus
- **Export** options (PDF / Share)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Dark mode (default) with light mode toggle
- Smooth chart animations and transitions
- Animated KPI counters with easing
- Hover tooltips on all charts
- Insight annotations explaining each chart
- Sticky sidebar with section navigation
- Filter panel (domain, language, model version)
- Responsive layout (desktop + tablet)
- Glassmorphism card styling with backdrop blur
- Purple-blue gradient accent theme
- Custom scrollbar styling

## Design Philosophy

Every chart answers a question. Every annotation explains what the data means for model improvement. The dashboard is designed to feel premium, futuristic, and executive-demo ready — inspired by Stripe, Linear, Vercel, and OpenAI platform design quality.
