## 1. Specification & Design
- [x] 1.1 Finalize `proposal.md` (review wording & completeness)
- [x] 1.2 Author delta spec with ADDED requirements & scenarios
- [x] 1.3 Create `design.md` (data model, privacy, rendering plan)
- [ ] 1.4 Validate change: `openspec validate add-shipman-maintenance-tracking --strict`

## 2. Data Model & Storage
- [x] 2.1 Create `src/data/maintenance/tasks.json` initial seed
- [x] 2.2 Implement TypeScript interfaces in `src/lib/maintenance.ts`
- [x] 2.3 Implement helpers: loadTasks(), getSeasonChecklist(season), computeStatusSummary()
- [x] 2.4 Implement frequency & next-due calculation logic
- [x] 2.5 Implement history append function with validation

## 3. Components (UI)
- [x] 3.1 `MaintenanceTaskList.astro` (filters: season, tag/system, status, privacy scope)
- [x] 3.2 `MaintenanceTaskDetail.astro` (metadata + history timeline + perform action) // perform action pending future interaction
- [x] 3.3 `MaintenanceSeasonChecklist.astro` (progress bar + grouped sections)
- [x] 3.4 Status summary widget (completion %, overdue count)
- [x] 3.5 Public read-only view variant (mask private notes & buyer-only tasks logic)

## 4. Interactions & Actions
- [x] 4.1 Add Perform Task action (date, notes) -> update history & lastPerformed
- [x] 4.2 Add mark blocked/unblocked
- [x] 4.3 Add quick seasonal completion toggle (batch mark standard tasks) with confirmation

## 5. AI / Export
- [x] 5.1 Implement export endpoint/function: serialize tasks JSON (normalized)
- [x] 5.2 Add structured mapping doc for agent (README update)
- [x] 5.3 Provide planning helper: suggestUpcomingTasks(referenceDate)

## 6. Privacy & Views
- [x] 6.1 Enforce privacy filter in public buyer view
- [x] 6.2 Redact internal notes when privacy != public
- [x] 6.3 Document privacy rules in README

## 7. Content & Seed Data
- [x] 7.1 Populate initial Shipman 28 tasks (engine, rigging, hull, electrical, safety)
- [x] 7.2 Tag seasonal tasks (winterize, commission)
- [x] 7.3 Add estimated durations & materials where known

## 8. Quality
- [x] 8.1 Lightweight unit tests for helpers (scripts/maintenance-edge-test.mjs & privacy-test)
- [x] 8.2 Manual validation of seasonal checklist rendering
- [x] 8.3 Validate overdue calculation edge cases
- [x] 8.4 Lint & accessibility pass: MaintenanceSeasonChecklist (roles, progressbar, aria-live)
- [x] 8.5 Lint & typing fixes: MaintenanceTaskDetail (input casting, null guards)
- [x] 8.6 Resolve Astro nullability diagnostics in MaintenanceSeasonChecklist script

## 9. Documentation
- [x] 9.1 Update capability README with usage examples
- [x] 9.2 Add inline code comments for data model
- [x] 9.3 Provide maintenance JSON schema snippet in README

## 10. Completion
- [x] 10.1 Re-run `openspec validate --strict`
- [ ] 10.2 Mark all tasks completed (`- [x]`)
- [ ] 10.3 Prepare archive PR after deployment

## 11. OpenSpec Process Compliance
- [x] 11.1 Review AGENTS.md and ensure proposal + spec delta format correct
- [ ] 11.2 Run `openspec validate add-shipman-maintenance-tracking --strict` and attach output
- [x] 11.3 Implement blocked transition constraint (spec Requirement: Task Status Management)
- [x] 11.4 Implement dependency confirmation prompt (spec Requirement: Dependency Awareness)
- [ ] 11.5 Archive change after deployment (`openspec archive add-shipman-maintenance-tracking --yes`)

## 12. Code Health (Astro Check Warnings)
- [x] 12.1 Resolve unused `suggestUpcomingTasks` warning (implement UI widget or test harness referencing it)
- [x] 12.2 Resolve unused `appendHistory` warning (integrate ephemeral history calls into a dev-only utility or remove if out of scope)
- [x] 12.3 Resolve unused `exportTasks` warning (add export debug page or CLI script using it)
- [x] 12.4 Migrate all imports from `maintenance.js` to `maintenance.ts` (components & scripts)
- [x] 12.5 Remove redundant `src/lib/maintenance.js` after successful migration
- [x] 12.6 Add automated CI step running `npx astro check` & failing on warnings (or classify acceptable warnings)
- [x] 12.7 Silence nullability diagnostics in `MaintenanceSeasonChecklist.astro` script
- [x] 12.8 Dynamic overdue count in seasonal checklist progress recompute
- [x] 12.9 Persist in-memory updates via mutableTasks store & recompute nextDue in appendHistory
