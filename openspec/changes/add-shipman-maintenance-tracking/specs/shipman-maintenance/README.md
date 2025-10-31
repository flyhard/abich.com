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

## Privacy Rules (Expanded)
Visibility Matrix:
- Owner scope: all tasks, full history notes, blocked reasons.
- Buyer scope: public + buyer tasks; history notes included; blocked reasons redacted to generic label.
- Public scope: only public tasks; history notes removed; blocked reasons removed.

Redaction Behavior:
- `exportTasks('buyer')` -> retains notes but sets blocked reason to `redacted`.
- `exportTasks('public')` -> strips notes and blocked reason fields entirely.
- Components (`MaintenancePublicView`, `MaintenanceBuyerView`) rely on scope prop to select tasks and render allowed data only.

Ephemeral Interaction:
- Client-side task actions (complete/block/unblock) do not persist; privacy logic would apply to future persisted implementation.

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

## Agent Mapping & Export Schema

Export function `exportTasks(scope)` returns:
```json
{
  "generatedAt": "2025-10-30T22:40:00.000Z",
  "scope": "public",
  "tasks": [
    {
      "id": "engine-oil-change",
      "title": "Change engine oil",
      "status": "pending",
      "nextDue": "2025-12-14",
      "overdue": false,
      "daysUntilDue": 45,
      "systemTags": ["engine"],
      "seasonTags": ["commission"],
      "privacy": "public"
    }
  ]
}
```
Notes:
- `history` entries redacted (notes removed) for `public` scope.
- Buyer scope retains notes but redacts blocked reasons.

### Suggested Tasks Helper
`suggestUpcomingTasks(new Date(), 'owner', 5)` returns ordered tasks: overdue first, then soonest due, then seasonal upcoming.

```js
import { suggestUpcomingTasks } from '@/src/lib/maintenance';
const upcoming = suggestUpcomingTasks(new Date(), 'owner', 5);
```

### Status Summary Example
```js
import { getSeasonChecklist, computeStatusSummary } from '@/src/lib/maintenance';
const list = getSeasonChecklist('winterize');
const summary = computeStatusSummary(list);
// summary => { total: 6, completed: 0, percent: 0, overdue: 0 }
```

## Usage Examples

### Load Winterize Checklist
```js
import { getSeasonChecklist } from '@/src/lib/maintenance.js';
const winterList = getSeasonChecklist('winterize');
```

### Export Buyer Scope
```js
import { exportTasks } from '@/src/lib/maintenance.js';
const buyerData = exportTasks('buyer');
```

### Suggest Upcoming Tasks
```js
import { suggestUpcomingTasks } from '@/src/lib/maintenance.js';
const upcoming = suggestUpcomingTasks(new Date(), 'owner', 7);
```

## JSON Schema (Simplified)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MaintenanceTask",
  "type": "object",
  "required": ["id", "title", "systemTags", "seasonTags", "status", "privacy", "history"],
  "properties": {
    "id": {"type": "string"},
    "title": {"type": "string"},
    "description": {"type": "string"},
    "systemTags": {"type": "array", "items": {"type": "string"}},
    "seasonTags": {"type": "array", "items": {"type": "string"}},
    "frequency": {
      "oneOf": [
        {"type": "object", "required": ["type", "intervalDays"], "properties": {"type": {"const": "interval"}, "intervalDays": {"type": "number", "minimum": 1}}},
        {"type": "object", "required": ["type", "season"], "properties": {"type": {"const": "seasonal"}, "season": {"enum": ["winterize", "commission"]}}},
        {"type": "object", "required": ["type", "condition"], "properties": {"type": {"const": "conditional"}, "condition": {"type": "string"}}}
      ]
    },
    "status": {"enum": ["pending", "in-progress", "completed", "blocked"]},
    "lastPerformed": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"},
    "materials": {"type": "array", "items": {"type": "object", "required": ["name"], "properties": {"name": {"type": "string"}, "quantity": {"type": "number"}, "unit": {"type": "string"}, "notes": {"type": "string"}}}},
    "dependencies": {"type": "array", "items": {"type": "string"}},
    "estimatedDurationMinutes": {"type": "number"},
    "privacy": {"enum": ["public", "buyer", "private"]},
    "history": {"type": "array", "items": {"type": "object", "required": ["date", "action"], "properties": {"date": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"}, "action": {"enum": ["completed", "blocked", "unblocked"]}, "notes": {"type": "string"}, "reason": {"type": "string"}}}}
  }
}
```
