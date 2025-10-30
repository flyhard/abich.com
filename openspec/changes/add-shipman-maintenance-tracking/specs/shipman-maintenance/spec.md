## ADDED Requirements

### Requirement: Maintenance Task Catalog
The system SHALL provide a catalog of maintenance tasks for the Shipman 28 with structured metadata (id, title, description, system tags, season tags, frequency, status, lastPerformed, nextDue, materials, dependencies, privacy level, history records).

#### Scenario: Load catalog
- **WHEN** the maintenance view loads
- **THEN** tasks are available in memory with all required fields

#### Scenario: Missing optional fields
- **WHEN** a task omits non-required fields (e.g., materials)
- **THEN** defaults (empty arrays or null) SHALL be applied without error

### Requirement: Seasonal Checklist Generation
The system SHALL generate seasonal checklists for `winterize` and `commission` seasons by filtering tasks containing corresponding season tags and computing completion percentage.

#### Scenario: Winterization checklist progress
- **WHEN** user opens winterization checklist
- **THEN** only tasks tagged `winterize` are listed AND a progress indicator shows % completed

#### Scenario: Commissioning checklist progress
- **WHEN** user opens commissioning checklist
- **THEN** only tasks tagged `commission` are listed AND overdue tasks are highlighted

### Requirement: Task Status Management
Tasks SHALL support statuses: pending, in-progress, completed, blocked. Transition rules: blocked cannot transition directly to completed without becoming pending or in-progress first.

#### Scenario: Complete task
- **WHEN** user marks a pending task completed with a date
- **THEN** status becomes completed AND lastPerformed updates to provided date

#### Scenario: Blocked transition constraint
- **WHEN** user attempts to mark a blocked task completed directly
- **THEN** the system SHALL reject the action with an explanatory message

### Requirement: Task History Tracking
Each performance event SHALL append a history record (date, action, notes). History MUST preserve chronological order newest-first in UI while stored oldest-first.

#### Scenario: Append history
- **WHEN** user records task performance
- **THEN** a history entry with date and notes is added AND lastPerformed updates

#### Scenario: History ordering
- **WHEN** the task detail is viewed
- **THEN** history displays newest entries first

### Requirement: Frequency & Due Calculation
The system SHALL compute `nextDue` from frequency metadata: interval days, seasonal, or conditional text. Overdue tasks (currentDate > nextDue and status != completed) SHALL be flagged.

#### Scenario: Interval next due
- **WHEN** a task with 90-day interval has lastPerformed = 2025-10-01
- **THEN** nextDue = 2025-12-30 (inclusive) AND flagged overdue only after that date passes

#### Scenario: Seasonal next due
- **WHEN** a seasonal (winterize) task is completed during winterization
- **THEN** nextDue SHALL reflect next applicable season start

### Requirement: Filtering & Tagging
Users SHALL be able to filter tasks by system tag (engine, rigging, hull, electrical, safety), season tag, status, and privacy scope.

#### Scenario: Multi-filter application
- **WHEN** user selects season=commission AND tag=engine
- **THEN** only tasks matching both criteria appear

### Requirement: Privacy Levels
Tasks SHALL include privacy: public | private | buyer. Public tasks visible everywhere; private only owner view; buyer tasks visible in buyer + owner views.

#### Scenario: Public view masking
- **WHEN** public read-only view is rendered
- **THEN** private tasks are omitted AND buyer tasks are omitted

#### Scenario: Buyer view masking
- **WHEN** buyer view is rendered
- **THEN** buyer tasks are included AND private tasks omitted

### Requirement: AI-Compatible Data Export
The system SHALL provide a normalized JSON export of all tasks (including derived nextDue, overdue flag) excluding private notes in public contexts to support AI planning.

#### Scenario: Export for planning
- **WHEN** export function is called with scope=owner
- **THEN** full task metadata including history is returned in JSON

#### Scenario: Export for public
- **WHEN** export function is called with scope=public
- **THEN** private and buyer tasks are excluded AND internal notes removed

### Requirement: Checklist Progress Summary
The system SHALL compute and display a summary for a seasonal checklist: total tasks, completed count, completion percentage rounded to nearest integer, overdue count.

#### Scenario: Progress calculation
- **WHEN** 8 winterize tasks exist and 5 completed and 1 overdue
- **THEN** summary shows total=8, completed=5, percent=62 (rounded), overdue=1

### Requirement: Dependency Awareness
Tasks MAY declare dependencies via other task ids; attempting to complete a task whose dependencies are not completed SHALL prompt a confirmation.

#### Scenario: Dependency prompt
- **WHEN** user completes a task with an incomplete dependency
- **THEN** system prompts confirmation AND proceeds only if user confirms

### Requirement: Blocked Reason Capture
Setting a task status to blocked SHALL require a short reason note stored with the status change event.

#### Scenario: Blocked reason enforcement
- **WHEN** user sets status=blocked without a reason
- **THEN** system rejects and requests reason

### Requirement: Upcoming Task Suggestions
The system SHALL provide a helper that returns the next suggested tasks ordered by urgency (overdue first, then soonest nextDue within 30 days, then seasonal tasks for upcoming season) limited by an optional max count.

#### Scenario: Overdue prioritized
- **WHEN** suggestUpcomingTasks(referenceDate) is called
- **THEN** any overdue tasks appear at the top of the returned list

#### Scenario: Upcoming interval tasks
- **WHEN** referenceDate is 2025-10-30 and a task has nextDue = 2025-11-05
- **THEN** that task appears ahead of tasks with nextDue beyond 30 days

#### Scenario: Seasonal preloading
- **WHEN** today is 14 days before winterization anchor date
- **THEN** winterize-tagged tasks without completion appear after overdue & urgent interval tasks

### Requirement: Privacy Redaction
The system SHALL redact internal notes and blocked reasons for tasks not visible in the current scope when exporting or rendering public or buyer views.

#### Scenario: Public redaction
- **WHEN** scope=public export runs
- **THEN** private and buyer tasks are excluded AND any internal-only notes are removed

#### Scenario: Buyer redaction
- **WHEN** scope=buyer export runs
- **THEN** buyer tasks are included AND private tasks excluded AND blocked reasons replaced with generic placeholder
