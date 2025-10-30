## 1. Specification & Design
- [ ] 1.1 Finalize `proposal.md` (review wording & completeness)
- [ ] 1.2 Author delta spec with ADDED requirements & scenarios
- [ ] 1.3 Create `design.md` (data model, privacy, rendering plan)
- [ ] 1.4 Validate change: `openspec validate add-shipman-maintenance-tracking --strict`

## 2. Data Model & Storage
- [ ] 2.1 Create `src/data/maintenance/tasks.json` initial seed
- [ ] 2.2 Implement TypeScript interfaces in `src/lib/maintenance.ts`
- [ ] 2.3 Implement helpers: loadTasks(), getSeasonChecklist(season), computeStatusSummary()
- [ ] 2.4 Implement frequency & next-due calculation logic
- [ ] 2.5 Implement history append function with validation

## 3. Components (UI)
- [ ] 3.1 `MaintenanceTaskList.astro` (filters: season, tag/system, status, privacy scope)
- [ ] 3.2 `MaintenanceTaskDetail.astro` (metadata + history timeline + perform action)
- [ ] 3.3 `MaintenanceSeasonChecklist.astro` (progress bar + grouped sections)
- [ ] 3.4 Status summary widget (completion %, overdue count)
- [ ] 3.5 Public read-only view variant (mask private notes & buyer-only tasks logic)

## 4. Interactions & Actions
- [ ] 4.1 Add Perform Task action (date, notes) -> update history & lastPerformed
- [ ] 4.2 Add mark blocked/unblocked
- [ ] 4.3 Add quick seasonal completion toggle (batch mark standard tasks) with confirmation

## 5. AI / Export
- [ ] 5.1 Implement export endpoint/function: serialize tasks JSON (normalized)
- [ ] 5.2 Add structured mapping doc for agent (README update)
- [ ] 5.3 Provide planning helper: suggestUpcomingTasks(referenceDate)

## 6. Privacy & Views
- [ ] 6.1 Enforce privacy filter in public buyer view
- [ ] 6.2 Redact internal notes when privacy != public
- [ ] 6.3 Document privacy rules in README

## 7. Content & Seed Data
- [ ] 7.1 Populate initial Shipman 28 tasks (engine, rigging, hull, electrical, safety)
- [ ] 7.2 Tag seasonal tasks (winterize, commission)
- [ ] 7.3 Add estimated durations & materials where known

## 8. Quality
- [ ] 8.1 Lightweight unit tests for helpers (if test infra exists) or script-based assertions
- [ ] 8.2 Manual validation of seasonal checklist rendering
- [ ] 8.3 Validate overdue calculation edge cases

## 9. Documentation
- [ ] 9.1 Update capability README with usage examples
- [ ] 9.2 Add inline code comments for data model
- [ ] 9.3 Provide maintenance JSON schema snippet in README

## 10. Completion
- [ ] 10.1 Re-run `openspec validate --strict`
- [ ] 10.2 Mark all tasks completed (`- [x]`)
- [ ] 10.3 Prepare archive PR after deployment

