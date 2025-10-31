import { loadTasks, decorateTasks, suggestUpcomingTasks, exportTasks } from '../src/lib/maintenance.ts';

function log(title, value) { console.log('\n=== ' + title + ' ==='); console.log(JSON.stringify(value, null, 2)); }

const tasks = loadTasks();
log('Loaded tasks count', tasks.length);

const decorated = decorateTasks(tasks, new Date('2025-10-30'));
log('First decorated task sample', decorated[0]);

const suggestions = suggestUpcomingTasks(new Date('2025-10-30'), 'owner', 5);
log('Upcoming suggestions', suggestions.map(t => ({ id: t.id, overdue: t.overdue, daysUntilDue: t.daysUntilDue })));

const publicExport = exportTasks('public', new Date('2025-10-30'));
log('Public export task sample', publicExport.tasks[0]);

const buyerExport = exportTasks('buyer', new Date('2025-10-30'));
log('Buyer export task sample', buyerExport.tasks[0]);
