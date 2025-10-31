import { exportTasks } from '../src/lib/maintenance.ts';

function assert(cond, msg){ if(!cond) throw new Error('Assertion failed: ' + msg); }
const publicData = exportTasks('public');
const buyerData = exportTasks('buyer');
const ownerData = exportTasks('owner');

// Ensure private tasks absent from public & buyer
assert(!publicData.tasks.find(t => t.privacy === 'private'), 'Private task leaked to public');
assert(!buyerData.tasks.find(t => t.privacy === 'private'), 'Private task leaked to buyer');
// Ensure buyer sees buyer task
assert(buyerData.tasks.find(t => t.privacy === 'buyer'), 'Buyer task missing from buyer scope');
// Ensure owner sees private
assert(ownerData.tasks.find(t => t.privacy === 'private'), 'Owner missing private task');
// Ensure history notes removed in public scope
const pubWithHistory = publicData.tasks.find(t => t.history && t.history.length > 0);
if (pubWithHistory) {
  assert(!pubWithHistory.history.find(h => h.notes), 'Public export retained notes');
}
console.log('Privacy tests passed');
