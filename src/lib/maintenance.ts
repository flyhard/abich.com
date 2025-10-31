import tasksData from '../data/maintenance/tasks.json' assert { type: 'json' };
type Scope = Privacy | 'owner';

// Type Definitions for Shipman Maintenance Capability
// Privacy levels govern task visibility across scopes: public, buyer, private.
// Frequency defines scheduling semantics; conditional frequencies have no deterministic nextDue.
// History entries represent immutable chronological actions performed on tasks.
// Derived fields (nextDue, overdue) are computed at runtime; not stored in source JSON.

import { nextSeasonAnchor } from './maintenanceConfig';

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
  systemTags: string[];
  seasonTags: string[];
  frequency?: Frequency;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  lastPerformed?: string;
  nextDue?: string; // derived
  materials?: { name: string; quantity?: number; unit?: string; notes?: string }[];
  dependencies?: string[];
  estimatedDurationMinutes?: number;
  privacy: Privacy;
  history: TaskHistoryEntry[];
  // Potential future: photos?: string[] (Google Photos URLs)
}

export interface DecoratedTask extends MaintenanceTask {
  overdue: boolean;
  daysUntilDue?: number; // negative if overdue
}

function parseISO(dateStr: string): Date {
  return new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00Z' : ''));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date); // clone without getTime
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

// Ephemeral in-memory mutable task store (clone original JSON once)
const mutableTasks: MaintenanceTask[] = (tasksData as MaintenanceTask[]).map(t => ({ ...t, history: [...t.history] }));

// Adjust loadTasks to return clones of mutableTasks for safety
export function loadTasks(): MaintenanceTask[] {
  return mutableTasks.map(t => ({ ...t, history: [...t.history] }));
}

export function computeNextDue(task: MaintenanceTask, reference: Date = new Date()): string | undefined {
  if (!task.frequency) return undefined;
  switch (task.frequency.type) {
    case 'interval': {
      const base = task.lastPerformed ? parseISO(task.lastPerformed) : reference;
      return addDays(base, task.frequency.intervalDays).toISOString().substring(0, 10);
    }
    case 'seasonal': {
      const next = nextSeasonAnchor(task.frequency.season, reference);
      return next.toISOString().substring(0, 10);
    }
    case 'conditional': {
      return undefined; // Conditional tasks have no deterministic nextDue
    }
  }
}

export function decorateTasks(tasks: MaintenanceTask[], reference: Date = new Date()): DecoratedTask[] {
  return tasks.map(task => {
    const nextDue = computeNextDue(task, reference);
    let overdue = false;
    let daysUntilDue: number | undefined = undefined;
    if (nextDue) {
      const dueDate = parseISO(nextDue);
      const diffMs = dueDate.getTime() - reference.getTime();
      daysUntilDue = Math.round(diffMs / 86400000);
      overdue = daysUntilDue < 0 && task.status !== 'completed';
    }
    return { ...task, nextDue, overdue, daysUntilDue };
  });
}

export function filterTasksByScope(tasks: MaintenanceTask[], scope: Privacy | 'owner'): MaintenanceTask[] {
  if (scope === 'owner') return tasks;
  return tasks.filter(t => {
    if (scope === 'public') return t.privacy === 'public';
    if (scope === 'buyer') return t.privacy === 'public' || t.privacy === 'buyer';
    return true;
  });
}

export function getSeasonChecklist(season: 'winterize' | 'commission', reference: Date = new Date(), scope: Privacy | 'owner' = 'owner'): DecoratedTask[] {
  const tasks = filterTasksByScope(loadTasks(), scope).filter(t => t.seasonTags.includes(season));
  return decorateTasks(tasks, reference);
}

export interface StatusSummary {
  total: number;
  completed: number;
  percent: number; // rounded
  overdue: number;
}

export function computeStatusSummary(tasks: MaintenanceTask[]): StatusSummary {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => (t as any).overdue).length; // may be decorated
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent, overdue };
}

export function suggestUpcomingTasks(reference: Date = new Date(), scope: Privacy | 'owner' = 'owner', max = 10): DecoratedTask[] {
  const tasks = decorateTasks(filterTasksByScope(loadTasks(), scope), reference);
  const upcoming = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      // Overdue first
      if (a.overdue && !b.overdue) return -1;
      if (b.overdue && !a.overdue) return 1;
      // Next due tasks ranked by daysUntilDue (ascending), undefined goes last
      if (a.daysUntilDue != null && b.daysUntilDue != null) {
        return a.daysUntilDue - b.daysUntilDue;
      }
      if (a.daysUntilDue != null) return -1;
      if (b.daysUntilDue != null) return 1;
      // Fallback alphabetical
      return a.title.localeCompare(b.title);
    });
  return upcoming.slice(0, max);
}

export function appendHistory(taskId: string, entry: TaskHistoryEntry): MaintenanceTask | undefined {
  const task = mutableTasks.find(t => t.id === taskId);
  if (!task) return undefined;
  if (entry.action === 'blocked' && !entry.reason) {
    throw new Error('Blocked status requires reason');
  }
  // Append preserving oldest-first ordering
  task.history.push(entry);
  if (entry.action === 'completed') {
    task.lastPerformed = entry.date;
    task.status = 'completed';
    // Recompute nextDue (derived) for convenience; decoration still handles canonical value
    task.nextDue = computeNextDue(task, new Date());
  } else if (entry.action === 'blocked') {
    task.status = 'blocked';
  } else if (entry.action === 'unblocked') {
    // Return to pending unless frequency implies immediate interval work
    task.status = 'pending';
  }
  return { ...task, history: [...task.history] }; // return shallow clone
}

export function exportTasks(scope: Scope = 'owner', reference: Date = new Date()) {
  const tasks = decorateTasks(filterTasksByScope(mutableTasks.map(t => ({ ...t, history: [...t.history] })), scope), reference).map(t => {
    // Redaction logic
    const clone: any = { ...t, history: t.history.map(h => ({ ...h })) };
    if (scope !== 'owner') {
      clone.history = t.history.map(h => {
        const hClone: any = { date: h.date, action: h.action };
        if (scope === 'buyer' && h.notes) {
          hClone.notes = h.notes;
        }
        if (h.action === 'blocked') {
          hClone.reason = 'redacted';
        }
        return hClone;
      });
    }
    return clone;
  });
  return { generatedAt: new Date().toISOString(), scope, tasks };
}
