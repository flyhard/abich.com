import { loadTasks, computeNextDue, decorateTasks, suggestUpcomingTasks } from '../src/lib/maintenance.ts';

function assert(cond, msg){ if(!cond) throw new Error('Assertion failed: ' + msg); }
const tasks = loadTasks();
const oilTask = tasks.find(t => t.id === 'engine-oil-change');
const nextDue = computeNextDue(oilTask, new Date('2025-10-01'));
assert(nextDue === '2025-12-30', 'Oil change next due expected 2025-12-30 got ' + nextDue);

const winterizeTask = tasks.find(t => t.id === 'winterize-engine');
const nextWinterDue = computeNextDue(winterizeTask, new Date('2025-10-30'));
assert(/2026-10-15/.test(nextWinterDue), 'Winterize engine next seasonal anchor expected 2026-10-15 got ' + nextWinterDue);

const decorated = decorateTasks(tasks, new Date('2025-10-30'));
const suggestions = suggestUpcomingTasks(new Date('2025-10-30'), 'owner', 5);
assert(suggestions.length <= 5, 'Suggestions length should be <=5');
console.log('All edge tests passed.');
