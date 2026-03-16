import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface CustomerDashboardProps {
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'transit' | 'delivered'>('all');
  const [query, setQuery] = useState('');
  const [showNewDelivery, setShowNewDelivery] = useState(false);
  const deliveries = useMemo(
    () => [
      { id: '#KX-9281', dest: 'Lagos, NG', status: 'In Transit', eta: '2 hours' },
      { id: '#KX-9275', dest: 'Abuja, NG', status: 'Pending', eta: 'Tomorrow' },
      { id: '#KX-9260', dest: 'Port Harcourt, NG', status: 'Delivered', eta: 'Completed' },
      { id: '#KX-9254', dest: 'Ibadan, NG', status: 'In Transit', eta: '45 mins' },
      { id: '#KX-9249', dest: 'Benin City, NG', status: 'Pending', eta: 'Today 5pm' },
    ],
    []
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deliveries.filter(d => {
      const okStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && d.status === 'Pending') ||
        (statusFilter === 'transit' && d.status === 'In Transit') ||
        (statusFilter === 'delivered' && d.status === 'Delivered');
      const okQuery = !q || d.id.toLowerCase().includes(q) || d.dest.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [deliveries, statusFilter, query]);
  const counts = useMemo(
    () => ({
      all: deliveries.length,
      pending: deliveries.filter(d => d.status === 'Pending').length,
      transit: deliveries.filter(d => d.status === 'In Transit').length,
      delivered: deliveries.filter(d => d.status === 'Delivered').length,
    }),
    [deliveries]
  );
  const handleMarkDelivered = (id: string) => {
    toast.success(`${id} marked as delivered`);
  };
  const handleTrack = (id: string) => {
    toast.info(`Tracking ${id}`);
  };
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-40 bg-white dark:bg-background-dark sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-background-dark">
            <span className="material-symbols-outlined text-xl">bolt</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Kinetix</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
            JD
          </div>
          <button 
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 lg:px-40 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Actions */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, John! 👋</h1>
              <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your deliveries today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">+12%</span>
                </div>
                <h3 className="text-2xl font-bold">24</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Deliveries</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">8</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Pickup</p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">142</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Completed this month</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowNewDelivery(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-background-dark rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">add</span>
                New Delivery
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-primary/5 border border-primary/20 rounded-xl font-bold hover:bg-primary/10 transition-all">
                <span className="material-symbols-outlined">map</span>
                Track Orders
              </button>
            </div>

            <div className="bg-white dark:bg-primary/5 border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Deliveries</h3>
                  <div className="flex items-center gap-2">
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search by ID or destination"
                      className="h-10 w-56 rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      statusFilter === 'all' ? 'bg-primary text-background-dark border-primary' : 'border-primary/20 hover:bg-primary/10'
                    }`}
                  >
                    All ({counts.all})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      statusFilter === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Pending ({counts.pending})
                  </button>
                  <button
                    onClick={() => setStatusFilter('transit')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      statusFilter === 'transit' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    In Transit ({counts.transit})
                  </button>
                  <button
                    onClick={() => setStatusFilter('delivered')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      statusFilter === 'delivered' ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    Delivered ({counts.delivered})
                  </button>
                </div>
              </div>
              <div className="overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center text-sm text-slate-500">
                    No deliveries match your filters
                  </div>
                ) : (
                  <table className="w-full text-left table-auto">
                    <thead className="bg-slate-50 dark:bg-primary/10 text-xs uppercase text-slate-500 font-bold">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Destination</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">ETA</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                      {filtered.map(row => (
                        <tr key={row.id} className="text-sm hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{row.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap max-w-[200px] sm:max-w-[260px] truncate">{row.dest}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                row.status === 'In Transit'
                                  ? 'bg-blue-100 text-blue-700'
                                  : row.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.eta}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleTrack(row.id)}
                                className="h-8 px-3 rounded-lg border border-primary/20 text-xs font-semibold whitespace-nowrap hover:bg-primary/10"
                              >
                                Track
                              </button>
                              {(row.status === 'In Transit' || row.status === 'Pending') && (
                                <button
                                  onClick={() => handleMarkDelivered(row.id)}
                                  className="h-8 px-3 rounded-lg bg-primary text-background-dark text-xs font-bold whitespace-nowrap hover:brightness-110"
                                >
                                  Mark Delivered
                                </button>
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

          {/* Right Column: Wallet & Profile */}
          <div className="lg:col-span-4 space-y-8">
            {/* Wallet Card */}
            <div className="p-8 rounded-3xl bg-primary text-background-dark shadow-xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Wallet Balance</span>
                  <span className="material-symbols-outlined opacity-70">account_balance_wallet</span>
                </div>
                <h2 className="text-4xl font-black mb-2">₦450,230.00</h2>
                <p className="text-sm font-medium opacity-70 mb-8">Available for shipments</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-background-dark text-white rounded-xl font-bold text-sm hover:brightness-125 transition-all">
                    Top Up
                  </button>
                  <button className="flex-1 py-3 bg-white/20 text-background-dark rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Support */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5">
              <h4 className="font-bold mb-2">Need Help?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Our support team is available 24/7 to assist with your shipments.</p>
              <button className="w-full py-3 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all">
                Contact Support
              </button>
            </div>
          </div>

        </div>
      </main>

      {showNewDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setShowNewDelivery(false)} />
          <div className="relative w-full max-w-[720px] mx-4 rounded-2xl bg-white dark:bg-slate-900 p-6 border border-primary/20 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Create New Delivery</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Enter pickup, drop-off and package details.</p>
              </div>
              <button
                onClick={() => setShowNewDelivery(false)}
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              <NewDeliveryForm onCancel={() => setShowNewDelivery(false)} onCreated={() => { setShowNewDelivery(false); toast.success('Delivery created'); }} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-primary/10">
        <p>© 2024 Kinetix Secure Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerDashboard;

function NewDeliveryForm({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    pickupAddress: '',
    pickupCity: '',
    dropAddress: '',
    dropCity: '',
    itemName: '',
    weightKg: '',
    valueNgn: '',
    paymentMethod: '' as '' | 'paystack' | 'cngn',
    notes: '',
    fragile: false,
  });
  const step1Valid =
    form.pickupAddress.trim() !== '' &&
    form.pickupCity.trim() !== '' &&
    form.dropAddress.trim() !== '' &&
    form.dropCity.trim() !== '' &&
    form.paymentMethod !== '' &&
    form.valueNgn.trim() !== '';
  const isValid =
    form.pickupAddress.trim() !== '' &&
    form.pickupCity.trim() !== '' &&
    form.dropAddress.trim() !== '' &&
    form.dropCity.trim() !== '' &&
    form.itemName.trim() !== '' &&
    form.weightKg.trim() !== '' &&
    form.valueNgn.trim() !== '' &&
    form.schedule.trim() !== '';
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) {
          if (!step1Valid) return;
          setStep(2);
          return;
        }
        if (step === 2) {
          if (!isValid) return;
          onCreated();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-primary uppercase">Step {step} of 2</p>
        <div className="text-xs text-slate-500 dark:text-slate-400">All fields are required unless marked optional</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pickup Address</label>
          <input
            value={form.pickupAddress}
            onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
            placeholder="Street and number"
            className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pickup City</label>
          <input
            value={form.pickupCity}
            onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
            placeholder="e.g. Lagos"
            className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drop-off Address</label>
          <input
            value={form.dropAddress}
            onChange={(e) => setForm({ ...form, dropAddress: e.target.value })}
            placeholder="Street and number"
            className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drop-off City</label>
          <input
            value={form.dropCity}
            onChange={(e) => setForm({ ...form, dropCity: e.target.value })}
            placeholder="e.g. Abuja"
            className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Declared Value (₦)</label>
              <input
                value={form.valueNgn}
                onChange={(e) => setForm({ ...form, valueNgn: e.target.value })}
                placeholder="e.g. 45000"
                className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preferred Payment</label>
              <div className="flex gap-3">
                <label className={`flex-1 rounded-lg border p-3 cursor-pointer ${form.paymentMethod === 'paystack' ? 'border-primary bg-primary/5' : 'border-primary/20'}`}>
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={form.paymentMethod === 'paystack'}
                    onChange={() => setForm({ ...form, paymentMethod: 'paystack' })}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <span>Paystack</span>
                  </div>
                </label>
                <label className={`flex-1 rounded-lg border p-3 cursor-pointer ${form.paymentMethod === 'cngn' ? 'border-primary bg-primary/5' : 'border-primary/20'}`}>
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={form.paymentMethod === 'cngn'}
                    onChange={() => setForm({ ...form, paymentMethod: 'cngn' })}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary">currency_bitcoin</span>
                    <span>cNGN</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Special instructions for pickup or drop-off"
                className="min-h-[90px] w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Options</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.fragile}
                  onChange={(e) => setForm({ ...form, fragile: e.target.checked })}
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                />
                <span className="text-sm">Fragile item</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 px-4 rounded-lg border border-primary/20 text-sm font-semibold hover:bg-primary/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!step1Valid}
              className={`h-11 px-6 rounded-lg text-sm font-bold ${step1Valid ? 'bg-primary text-background-dark hover:brightness-110' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Item Description</label>
              <input
                value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                placeholder="e.g. Electronics - Bluetooth Speaker"
                className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Weight (kg)</label>
              <input
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                placeholder="e.g. 2.5"
                className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 px-4 rounded-lg border border-primary/20 text-sm font-semibold hover:bg-primary/10"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`h-11 px-6 rounded-lg text-sm font-bold ${isValid ? 'bg-primary text-background-dark hover:brightness-110' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'}`}
            >
              Create Delivery
            </button>
          </div>
        </>
      )}
    </form>
  );
}
