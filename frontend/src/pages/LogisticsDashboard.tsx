import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
 
interface LogisticsDashboardProps {
  onLogout: () => void;
}
 
const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({ onLogout }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'available' | 'assigned' | 'completed'>('available');
  const [showStartShift, setShowStartShift] = useState(false);
 
  const jobs = useMemo(
    () => [
      { id: '#JOB-1021', pickup: 'Ikeja City Mall', drop: 'Yaba Tech Gate', distanceKm: 14, payout: 2500, vehicle: 'motorbike', status: 'available' as const, eta: '45 mins' },
      { id: '#JOB-1015', pickup: 'Lekki Phase 1 Gate', drop: 'Victoria Island Eko Hotel', distanceKm: 6, payout: 1800, vehicle: 'motorbike', status: 'available' as const, eta: '25 mins' },
      { id: '#JOB-1009', pickup: 'Apapa Terminal', drop: 'Surulere Adeniran Ogunsanya', distanceKm: 10, payout: 3200, vehicle: 'van', status: 'assigned' as const, eta: '50 mins' },
      { id: '#JOB-0998', pickup: 'Ikoyi Club', drop: 'Oniru Market', distanceKm: 5, payout: 1600, vehicle: 'bicycle', status: 'completed' as const, eta: 'Delivered' },
    ],
    []
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(j => {
      const okTab =
        (tab === 'available' && j.status === 'available') ||
        (tab === 'assigned' && j.status === 'assigned') ||
        (tab === 'completed' && j.status === 'completed');
      const okQuery =
        !q ||
        j.id.toLowerCase().includes(q) ||
        j.pickup.toLowerCase().includes(q) ||
        j.drop.toLowerCase().includes(q);
      return okTab && okQuery;
    });
  }, [jobs, tab, query]);
 
  const activeAssigned = jobs.find(j => j.status === 'assigned');
  const earningsToday = jobs.filter(j => j.status === 'completed').reduce((acc, j) => acc + j.payout, 0);
 
  const handleAccept = (id: string) => {
    if (!isOnline) {
      toast.error('Go online to accept jobs');
      return;
    }
    toast.success(`${id} accepted`);
  };
  const handleStartPickup = (id: string) => {
    toast.info(`Started pickup for ${id}`);
  };
  const handleMarkDelivered = (id: string) => {
    toast.success(`${id} marked delivered`);
  };
 
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
      <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-40 bg-white dark:bg-background-dark sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-background-dark">
            <span className="material-symbols-outlined text-xl">pedal_bike</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Kinetix Rider</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <button
            onClick={() => setIsOnline(v => !v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border ${isOnline ? 'border-green-500 text-green-700 hover:bg-green-50' : 'border-slate-300 hover:bg-slate-100'}`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
          <button
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </header>
 
      <main className="flex-1 px-6 py-8 lg:px-40 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{jobs.filter(j => j.status === 'assigned').length}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Assigned Jobs</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">₦{earningsToday.toLocaleString()}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Earnings Today</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{isOnline ? 'On shift' : 'Off shift'}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Shift Status</p>
              </div>
            </div>
 
            {activeAssigned && (
              <div className="rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Active Job</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{activeAssigned.eta}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Pickup</p>
                    <p className="text-sm font-semibold">{activeAssigned.pickup}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Drop-off</p>
                    <p className="text-sm font-semibold">{activeAssigned.drop}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Distance</p>
                    <p className="text-sm font-semibold">{activeAssigned.distanceKm} km</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleStartPickup(activeAssigned.id)}
                    className="h-10 px-3 rounded-lg border border-primary/20 text-xs font-semibold whitespace-nowrap hover:bg-primary/10"
                  >
                    Start Pickup
                  </button>
                  <button
                    onClick={() => handleMarkDelivered(activeAssigned.id)}
                    className="h-10 px-3 rounded-lg bg-primary text-background-dark text-xs font-bold whitespace-nowrap hover:brightness-110"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            )}
 
            <div className="bg-white dark:bg-primary/5 border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Jobs</h3>
                  <div className="flex items-center gap-2">
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search job by ID or address"
                      className="h-10 w-64 rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTab('available')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      tab === 'available' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => setTab('assigned')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      tab === 'assigned' ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Assigned
                  </button>
                  <button
                    onClick={() => setTab('completed')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      tab === 'completed' ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
              <div className="overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center text-sm text-slate-500">No jobs</div>
                ) : (
                  <table className="w-full text-left table-auto">
                    <thead className="bg-slate-50 dark:bg-primary/10 text-xs uppercase text-slate-500 font-bold">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Pickup</th>
                        <th className="px-4 py-3">Drop-off</th>
                        <th className="px-4 py-3">Distance</th>
                        <th className="px-4 py-3">Payout</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                      {filtered.map(row => (
                        <tr key={row.id} className="text-sm hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{row.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.pickup}</td>
                          <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.drop}</td>
                          <td className="px-4 py-3">{row.distanceKm} km</td>
                          <td className="px-4 py-3">₦{row.payout.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              {row.status === 'available' && (
                                <button
                                  onClick={() => handleAccept(row.id)}
                                  className="h-8 px-3 rounded-lg bg-primary text-background-dark text-xs font-bold whitespace-nowrap hover:brightness-110"
                                >
                                  Accept
                                </button>
                              )}
                              {row.status === 'assigned' && (
                                <button
                                  onClick={() => handleStartPickup(row.id)}
                                  className="h-8 px-3 rounded-lg border border-primary/20 text-xs font-semibold whitespace-nowrap hover:bg-primary/10"
                                >
                                  Start
                                </button>
                              )}
                              {row.status === 'completed' && (
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Delivered</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
 
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-primary text-background-dark shadow-xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Wallet Balance</span>
                  <span className="material-symbols-outlined opacity-70">account_balance_wallet</span>
                </div>
                <h2 className="text-4xl font-black mb-2">₦82,540.00</h2>
                <p className="text-sm font-medium opacity-70 mb-8">Available to withdraw</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-background-dark text-white rounded-xl font-bold text-sm hover:brightness-125 transition-all">
                    Withdraw
                  </button>
                  <button className="flex-1 py-3 bg-white/20 text-background-dark rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
                    View History
                  </button>
                </div>
              </div>
            </div>
 
            <div className="p-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5">
              <h4 className="font-bold mb-2">Shift Control</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Manage your availability and shifts.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStartShift(true)}
                  className="flex-1 py-3 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all"
                >
                  Start Shift
                </button>
                <button
                  onClick={() => setIsOnline(false)}
                  className="flex-1 py-3 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all"
                >
                  End Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
 
      {showStartShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setShowStartShift(false)} />
          <div className="relative w-full max-w-[480px] mx-4 rounded-2xl bg-white dark:bg-slate-900 p-6 border border-primary/20 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Start Shift</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Confirm to go online and receive jobs.</p>
              </div>
              <button
                onClick={() => setShowStartShift(false)}
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowStartShift(false)}
                className="h-11 px-4 rounded-lg border border-primary/20 text-sm font-semibold hover:bg-primary/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOnline(true);
                  setShowStartShift(false);
                  toast.success('You are now online');
                }}
                className="h-11 px-6 rounded-lg bg-primary text-background-dark text-sm font-bold hover:brightness-110"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
 
      <footer className="px-6 py-6 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-primary/10">
        <p>© 2024 Kinetix Rider Network. All rights reserved.</p>
      </footer>
    </div>
  );
};
 
export default LogisticsDashboard;
