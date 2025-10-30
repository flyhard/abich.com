# Shipman Maintenance Capability (Change Delta)

This README describes the intended capability for structured Shipman 28 maintenance tracking prior to implementation.

## Purpose
Provide a normalized catalog of maintenance tasks enabling:
- Personal organization (what to do, what was done, what is overdue)
- Seasonal preparation (winterization / commissioning checklists)
- Reference for other owners (public subset)
- Status transparency for a potential buyer (buyer subset)
- AI agent planning (exportable JSON with rich metadata)

## Data Model (Proposed JSON Shape)
```json
{
  "id": "engine-oil-change",
  "title": "Change engine oil",
  "description": "Replace engine oil and filter.",
  "systemTags": ["engine"],
  "seasonTags": ["commission"],
  "frequency": { "type": "interval", "intervalDays": 90 },
  "status": "pending",
  "lastPerformed": "2025-09-15",
  "nextDue": "2025-12-14",
  "materials": [ { "name": "Oil 10W-40", "quantity": 3, "unit": "L" } ],
  "dependencies": ["engine-warm-up"],
  "estimatedDurationMinutes": 45,
  "privacy": "public",
  "history": [
    { "date": "2025-06-10", "action": "completed", "notes": "Normal wear" },
    { "date": "2025-09-15", "action": "completed", "notes": "Oil darker than expected" }
  ]
}
```

### Frequency Object
- Interval: `{ "type": "interval", "intervalDays": <number> }`
- Seasonal: `{ "type": "seasonal", "season": "winterize" }`
- Conditional: `{ "type": "conditional", "condition": "After heavy storm" }`

### Derived Fields
- `nextDue` computed by helper based on `lastPerformed` + `frequency`.
- `overdue` boolean derived when `Date.now() > nextDue` and `status != completed`.

## Privacy Rules
- `public`: Visible in all views and exports.
- `buyer`: Visible only in buyer + owner scope; excluded from public.
- `private`: Visible only to owner scope; excluded from buyer + public.

## Seasonal Checklists
- Winterization: tasks tagged `winterize`.
- Commissioning: tasks tagged `commission`.

## AI Export
Function `exportTasks(scope)` returns array with:
- Core fields
- Derived: `overdue`, `daysUntilDue`, `seasonalGroup`
- Redactions per privacy scope.

## Planned Helper Functions
- `loadTasks()`
- `getSeasonChecklist(season)`
- `computeStatusSummary(tasks)`
- `suggestUpcomingTasks(referenceDate)`
- `appendHistory(taskId, record)`

## Open Questions
- Do we need per-task photo attachments? (Not in initial scope)
- Do we track cost per task occurrence? (Future enhancement)
- User authentication (current site static?)—owner vs public segmentation method.

