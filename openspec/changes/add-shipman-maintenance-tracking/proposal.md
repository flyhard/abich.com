## Why
Current site lacks structured maintenance tracking for the Shipman 28. Seasonal (winterization / commissioning) checklists, recurring tasks, and history are ad‑hoc, making it harder for me to organize work, share status with a prospective buyer, and provide a reference for other owners. A structured capability will enable AI agents to plan, generate checklists, and surface upcoming or overdue tasks.

## What Changes
- Add new capability: `shipman-maintenance` (task catalog + seasonal checklists + history)
- Provide structured task metadata (frequency, last performed, materials, dependencies, system tags)
- Support seasonal grouping: `winterize`, `commission` (put back into water)
- Enable marking tasks as: pending, in-progress, completed, blocked
- Track each performance event (history entries) with date + notes
- Generate dynamic seasonal checklist pages/components
- Provide public read-only view (filtered safe tasks) for other owners & potential buyer
- Provide private view (full detail, internal notes)
- Add AI-friendly data export (JSON shape) for planning assistance
- Add optional privacy flag per task (public | private | buyer-only)
- Basic overdue/next-due calculation based on frequency metadata
- Status summary component showing completion % for current seasonal checklist
- (Future benefit) Optional photo attachment references per task/history via Google Photos (album or image link) to document condition and work performed

## Impact
- Affected specs: `shipman-maintenance` (new capability)
- Affected code (planned):
  - `src/components/MaintenanceTaskList.astro` (list & filters)
  - `src/components/MaintenanceTaskDetail.astro` (history + metadata)
  - `src/components/MaintenanceSeasonChecklist.astro` (season-specific checklist)
  - `src/lib/maintenance.ts` (data model, helper functions)
  - `src/pages/shipman28.astro` (integration section)
  - New data source: `src/data/maintenance/tasks.json` (or `.yaml`)
- Potential future external integration: Google Photos API (to fetch/share image links) would introduce auth/token handling and privacy considerations (not in initial scope)
- No breaking changes to existing capabilities.
- Facilitates AI agent usage by providing normalized JSON schema and clear requirement scenarios.
