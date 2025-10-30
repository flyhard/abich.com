## Context
Shipman 28 maintenance tracking adds structured task data to a static Astro site. Need a lightweight data layer accessible to components and AI export routines.

## Goals / Non-Goals
- Goals: Structured task model, seasonal checklist generation, privacy-filtered views, AI-friendly export.
- Non-Goals: Authentication system, real-time collaboration, external database integration (initially).

## Decisions
- Data Source: Static JSON file `src/data/maintenance/tasks.json` (easier diffing, version control).
- Language: TypeScript types in `src/lib/maintenance.ts` for compile-time safety.
- Derived Fields: Computed at render/build time to avoid stale data stored in file.
- History Ordering: Stored oldest-first; reverse for UI rendering.
- Privacy Filtering: Implement utility `filterTasksByScope(tasks, scope)` where scope ∈ {public, buyer, owner}.

## Data Types (TypeScript Sketch)
```ts
export type Privacy = 'public' | 'buyer' | 'private';
export type Frequency =
  | { type: 'interval'; intervalDays: number }
  | { type: 'seasonal'; season: 'winterize' | 'commission' }
  | { type: 'conditional'; condition: string };

export interface TaskHistoryEntry {
  date: string; // ISO date
  action: 'completed' | 'blocked' | 'unblocked';
  notes?: string;
  reason?: string; // for blocked
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description?: string;
  systemTags: string[]; // e.g., ['engine']
  seasonTags: string[]; // e.g., ['winterize']
  frequency?: Frequency;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  lastPerformed?: string; // ISO date
  nextDue?: string; // derived
  materials?: { name: string; quantity?: number; unit?: string; notes?: string }[];
  dependencies?: string[];
  estimatedDurationMinutes?: number;
  privacy: Privacy;
  history: TaskHistoryEntry[];
}
```

## Helper Logic
- Next Due (interval): `addDays(parseISO(lastPerformed), intervalDays)`.
- Next Due (seasonal): Map seasons to target anchor dates (config object) and choose next future date.
- Overdue: `Date.now() > parseISO(nextDue)` and status != completed.
- Completion Percentage: `completedCount / totalTasks * 100` then round.

## Risks / Trade-offs
- Static JSON requires manual edit for updates; no live interaction persistence.
  - Mitigation: Provide clear editing instructions; consider future lightweight serverless API.
- Privacy segmentation without auth relies on separate build outputs or query parameter.
  - Mitigation: Start with manual scope selection; revisit when authentication needed.
- Seasonal date mapping can vary year to year.
  - Mitigation: Config file `src/lib/maintenanceConfig.ts` for easy adjustment.

## Migration Plan
1. Implement JSON + types.
2. Add components using in-memory processing.
3. Validate with sample tasks.
4. After stabilization, consider adding script to auto-update nextDue.

## Open Questions
- Should blocked reasons appear in public/buyer views? Probably no (redact reason field except owner).
- Add severity/priority? Could be useful; not in initial spec.

