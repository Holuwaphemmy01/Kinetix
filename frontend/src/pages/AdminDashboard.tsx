import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface AdminDashboardProps {
  onLogout: () => void;
}

type DeliveryRow = {
  id: string;
  customer: string;
  pickup: string;
  drop: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  amount: number;
};

type RiderRow = {
  id: string;
  name: string;
  vehicle: 'bicycle' | 'motorbike' | 'van' | 'truck';
  online: boolean;
  rating: number;
  jobsToday: number;
};

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  deliveries: number;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'deliveries' | 'riders' | 'customers'>('deliveries');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'transit' | 'delivered' | 'cancelled'>('all');

  const deliveries: DeliveryRow[] = useMemo(
    () => [
      { id: '#KX-9281', customer: 'Chinelo Adebayo', pickup: 'Ikeja City Mall', drop: 'Yaba Tech Gate', status: 'In Transit', amount: 2500 },
      { id: '#KX-9275', customer: 'Adeyemi & Co', pickup: 'Lekki Phase 1', drop: 'Eko Hotel VI', status: 'Pending', amount: 1800 },
      { id: '#KX-9260', customer: 'Kinetix Labs', pickup: 'Ikoyi Club', drop: 'Oniru Market', status: 'Delivered', amount: 1600 },
      { id: '#KX-9254', customer: 'Smart Retail', pickup: 'Apapa Terminal', drop: 'Surulere Mall', status: 'Cancelled', amount: 0 },
    ],
    []
  );
  const riders: RiderRow[] = useMemo(
    () => [
      { id: 'RD-102', name: 'Ibrahim Musa', vehicle: 'motorbike', online: true, rating: 4.8, jobsToday: 6 },
      { id: 'RD-097', name: 'Grace Okafor', vehicle: 'van', online: false, rating: 4.6, jobsToday: 3 },
      { id: 'RD-081', name: 'Tunde Bello', vehicle: 'bicycle', online: true, rating: 4.2, jobsToday: 5 },
    ],
    []
  );
  const customers: CustomerRow[] = useMemo(
    () => [
      { id: 'CU-5001', name: 'Chinelo Adebayo', email: 'chinelo@example.com', active: true, deliveries: 41 },
      { id: 'CU-4832', name: 'Adeyemi & Co', email: 'ops@adeyemi.co', active: true, deliveries: 19 },
      { id: 'CU-4620', name: 'Smart Retail', email: 'support@smartretail.ng', active: false, deliveries: 3 },
    ],
    []
  );

  const filteredDeliveries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deliveries.filter(d => {
      const okStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && d.status === 'Pending') ||
        (statusFilter === 'transit' && d.status === 'In Transit') ||
        (statusFilter === 'delivered' && d.status === 'Delivered') ||
        (statusFilter === 'cancelled' && d.status === 'Cancelled');
      const okQuery =
        !q ||
        d.id.toLowerCase().includes(q) ||
        d.customer.toLowerCase().includes(q) ||
        d.pickup.toLowerCase().includes(q) ||
        d.drop.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [deliveries, search, statusFilter]);

  const filteredRiders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return riders.filter(r => !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }, [riders, search]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter(c => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [customers, search]);

  const handleCancelDelivery = (id: string) => {
    toast.error(`${id} cancelled`);
  };
  const handleMarkDelivered = (id: string) => {
    toast.success(`${id} marked delivered`);
  };
  const handleSuspendRider = (id: string) => {
    toast.error(`Rider ${id} suspended`);
  };
  const handleActivateRider = (id: string) => {
    toast.success(`Rider ${id} activated`);
  };
  const handleToggleCustomer = (id: string, active: boolean) => {
    toast.info(`Customer ${id} ${active ? 'disabled' : 'enabled'}`);
  };

  const revenueToday = deliveries.filter(d => d.status === 'Delivered').reduce((acc, d) => acc + d.amount, 0);
  const pendingCount = deliveries.filter(d => d.status === 'Pending').length;
  const ridersOnline = riders.filter(r => r.online).length;
  const deliveriesActive = deliveries.filter(d => d.status === 'In Transit').length;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
      <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-40 bg-white dark:bg-background-dark sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-background-dark">
            <span className="material-symbols-outlined text-xl">shield_person</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Kinetix Admin</h2>
        </div>
        <div className="flex items-center gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{deliveriesActive}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Deliveries</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined">assignment</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{pendingCount}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Approvals</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{ridersOnline}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Riders Online</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">₦{revenueToday.toLocaleString()}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Revenue Today</p>
              </div>
            </div>

            <div className="bg-white dark:bg-primary/5 border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTab('deliveries')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        tab === 'deliveries' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      Deliveries
                    </button>
                    <button
                      onClick={() => setTab('riders')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        tab === 'riders' ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      Riders
                    </button>
                    <button
                      onClick={() => setTab('customers')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        tab === 'customers' ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      Customers
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="h-10 w-64 rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {tab === 'deliveries' && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        statusFilter === 'all' ? 'bg-primary text-background-dark border-primary' : 'border-primary/20 hover:bg-primary/10'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setStatusFilter('pending')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        statusFilter === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setStatusFilter('transit')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        statusFilter === 'transit' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      In Transit
                    </button>
                    <button
                      onClick={() => setStatusFilter('delivered')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        statusFilter === 'delivered' ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => setStatusFilter('cancelled')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        statusFilter === 'cancelled' ? 'bg-slate-600 text-white border-slate-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-hidden">
                {tab === 'deliveries' && (
                  <>
                    {filteredDeliveries.length === 0 ? (
                      <div className="p-10 text-center text-sm text-slate-500">No deliveries</div>
                    ) : (
                      <table className="w-full text-left table-auto">
                        <thead className="bg-slate-50 dark:bg-primary/10 text-xs uppercase text-slate-500 font-bold">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Pickup</th>
                            <th className="px-4 py-3">Drop-off</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                          {filteredDeliveries.map(row => (
                            <tr key={row.id} className="text-sm hover:bg-primary/5 transition-colors">
                              <td className="px-4 py-3 font-medium whitespace-nowrap">{row.id}</td>
                              <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.customer}</td>
                              <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.pickup}</td>
                              <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.drop}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                    row.status === 'In Transit'
                                      ? 'bg-blue-100 text-blue-700'
                                      : row.status === 'Pending'
                                      ? 'bg-amber-100 text-amber-700'
                                      : row.status === 'Delivered'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">₦{row.amount.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 justify-end">
                                  {row.status === 'Pending' && (
                                    <button
                                      onClick={() => handleCancelDelivery(row.id)}
                                      className="h-8 px-3 rounded-lg border border-primary/20 text-xs font-semibold whitespace-nowrap hover:bg-primary/10"
                                    >
                                      Cancel
                                    </button>
                                  )}
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
                  </>
                )}

                {tab === 'riders' && (
                  <>
                    {filteredRiders.length === 0 ? (
                      <div className="p-10 text-center text-sm text-slate-500">No riders</div>
                    ) : (
                      <table className="w-full text-left table-auto">
                        <thead className="bg-slate-50 dark:bg-primary/10 text-xs uppercase text-slate-500 font-bold">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Online</th>
                            <th className="px-4 py-3">Rating</th>
                            <th className="px-4 py-3">Jobs Today</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                          {filteredRiders.map(row => (
                            <tr key={row.id} className="text-sm hover:bg-primary/5 transition-colors">
                              <td className="px-4 py-3 font-medium whitespace-nowrap">{row.id}</td>
                              <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{row.vehicle}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.online ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                                  {row.online ? 'Online' : 'Offline'}
                                </span>
                              </td>
                              <td className="px-4 py-3">{row.rating.toFixed(1)}</td>
                              <td className="px-4 py-3">{row.jobsToday}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 justify-end">
                                  {row.online ? (
                                    <button
                                      onClick={() => handleSuspendRider(row.id)}
                                      className="h-8 px-3 rounded-lg border border-primary/20 text-xs font-semibold whitespace-nowrap hover:bg-primary/10"
                                    >
                                      Suspend
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleActivateRider(row.id)}
                                      className="h-8 px-3 rounded-lg bg-primary text-background-dark text-xs font-bold whitespace-nowrap hover:brightness-110"
                                    >
                                      Activate
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}

                {tab === 'customers' && (
                  <>
                    {filteredCustomers.length === 0 ? (
                      <div className="p-10 text-center text-sm text-slate-500">No customers</div>
                    ) : (
                      <table className="w-full text-left table-auto">
                        <thead className="bg-slate-50 dark:bg-primary/10 text-xs uppercase text-slate-500 font-bold">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Active</th>
                            <th className="px-4 py-3">Deliveries</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                          {filteredCustomers.map(row => (
                            <tr key={row.id} className="text-sm hover:bg-primary/5 transition-colors">
                              <td className="px-4 py-3 font-medium whitespace-nowrap">{row.id}</td>
                              <td className="px-4 py-3 whitespace-nowrap max-w-[220px] truncate">{row.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap max-w-[240px] truncate">{row.email}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                                  {row.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3">{row.deliveries}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => handleToggleCustomer(row.id, row.active)}
                                    className="h-8 px-3 rounded-lg border border-primary/20 text-xs font-semibold whitespace-nowrap hover:bg-primary/10"
                                  >
                                    {row.active ? 'Disable' : 'Enable'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-primary text-background-dark shadow-xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Platform Balance</span>
                  <span className="material-symbols-outlined opacity-70">account_balance</span>
                </div>
                <h2 className="text-4xl font-black mb-2">₦2,450,000.00</h2>
                <p className="text-sm font-medium opacity-70 mb-8">Ready for payout</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-background-dark text-white rounded-xl font-bold text-sm hover:brightness-125 transition-all">
                    View Finance
                  </button>
                  <button className="flex-1 py-3 bg-white/20 text-background-dark rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5">
              <h4 className="font-bold mb-2">Admin Actions</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Perform common operational tasks.</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all">
                  Create Rider
                </button>
                <button className="px-4 py-2 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all">
                  Create Customer
                </button>
                <button className="px-4 py-2 bg-white dark:bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/10 transition-all">
                  Create Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-primary/10">
        <p>© 2024 Kinetix Admin Console. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
