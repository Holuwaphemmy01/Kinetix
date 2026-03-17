import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface CustomerDashboardProps {
  onLogout: () => void;
}

type VehicleType = 'bicycle' | 'motorbike' | 'van' | 'truck';
interface LagosPlace { label: string; lat: number; lon: number }
const LAGOS_PLACES: LagosPlace[] = [
  { label: 'Ikeja, Lagos', lat: 6.6173, lon: 3.3515 },
  { label: 'Victoria Island, Lagos', lat: 6.4267, lon: 3.4281 },
  { label: 'Lekki Phase 1, Lagos', lat: 6.4397, lon: 3.4833 },
  { label: 'Ikoyi, Lagos', lat: 6.4541, lon: 3.4342 },
  { label: 'Yaba, Lagos', lat: 6.514, lon: 3.3869 },
  { label: 'Surulere, Lagos', lat: 6.5, lon: 3.35 },
  { label: 'Ajah, Lagos', lat: 6.467, lon: 3.6021 },
  { label: 'Apapa, Lagos', lat: 6.45, lon: 3.35 },
  { label: 'Magodo, Lagos', lat: 6.6352, lon: 3.3884 },
  { label: 'Maryland, Lagos', lat: 6.567, lon: 3.37 },
  { label: 'Oshodi, Lagos', lat: 6.555, lon: 3.338 },
  { label: 'Ilupeju, Lagos', lat: 6.5513, lon: 3.3564 },
  { label: 'Ojo, Lagos', lat: 6.465, lon: 3.197 },
  { label: 'Egbeda, Lagos', lat: 6.6026, lon: 3.3063 },
  { label: 'Festac Town, Lagos', lat: 6.4969, lon: 3.2519 },
  { label: 'Makoko, Lagos', lat: 6.5005, lon: 3.3939 },
  { label: 'Agege, Lagos', lat: 6.6259, lon: 3.325 },
  { label: 'Mushin, Lagos', lat: 6.541, lon: 3.326 },
  { label: 'Alimosho, Lagos', lat: 6.6238, lon: 3.2762 },
  { label: 'Badagry, Lagos', lat: 6.415, lon: 2.892 },
  { label: 'Epe, Lagos', lat: 6.5846, lon: 3.9833 },
  { label: 'Ibeju-Lekki, Lagos', lat: 6.493, lon: 3.7387 },
  { label: 'Isolo, Lagos', lat: 6.5373, lon: 3.3095 },
  { label: 'Ojota, Lagos', lat: 6.5883, lon: 3.391 },
  { label: 'Ogudu, Lagos', lat: 6.5912, lon: 3.3943 },
  { label: 'Gbagada, Lagos', lat: 6.572, lon: 3.393 },
  { label: 'Shomolu, Lagos', lat: 6.5403, lon: 3.3809 },
  { label: 'Oniru, Lagos', lat: 6.4278, lon: 3.4507 },
  { label: 'VGC, Lagos', lat: 6.4596, lon: 3.6136 },
  { label: 'Sangotedo, Lagos', lat: 6.4696, lon: 3.6405 },
  { label: 'Ikorodu, Lagos', lat: 6.6194, lon: 3.5105 },
  { label: 'Mile 2, Lagos', lat: 6.4878, lon: 3.2738 },
  { label: 'Ojuelegba, Lagos', lat: 6.509, lon: 3.355 },
  { label: 'Oyingbo, Lagos', lat: 6.4935, lon: 3.3846 },
];
interface GPlace {
  formatted_address?: string;
  geometry?: { location: { lat(): number; lng(): number } };
}
interface Autocomplete {
  addListener(eventName: 'place_changed', handler: () => void): void;
  getPlace(): GPlace;
}
interface GoogleMapsPlaces {
  Autocomplete: new (input: HTMLInputElement, opts: { fields: Array<'formatted_address' | 'geometry'> }) => Autocomplete;
}
interface GoogleMapsNamespace {
  places?: GoogleMapsPlaces;
}
declare global {
  interface Window {
    google?: { maps?: GoogleMapsNamespace };
    PaystackPop?: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref?: string;
        currency?: 'NGN';
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
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
          <div className="relative w-full max-w-[560px] sm:max-w-[600px] mx-4 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-primary/20 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
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
            <NewDeliveryForm onCancel={() => setShowNewDelivery(false)} onCreated={() => { setShowNewDelivery(false); toast.success('Delivery created'); }} />
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

function NewDeliveryForm({
  onCancel,
  onCreated,
}: { onCancel: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    pickupAddress: '',
    pickupLat: null as null | number,
    pickupLng: null as null | number,
    dropAddress: '',
    dropLat: null as null | number,
    dropLng: null as null | number,
    itemName: '',
    weightKg: '',
    valueNgn: '',
    paymentMethod: '' as '' | 'paystack' | 'cngn',
    vehicleType: '' as '' | 'bicycle' | 'motorbike' | 'van' | 'truck',
    offerAmount: '',
    payerEmail: '',
    notes: '',
    fragile: false,
  });
  const step1Valid =
    form.pickupAddress.trim() !== '' &&
    form.dropAddress.trim() !== '' &&
    form.itemName.trim() !== '' &&
    form.weightKg.trim() !== '' &&
    form.paymentMethod !== '' &&
    form.valueNgn.trim() !== '';

  const haversineKm = () => {
    if (form.pickupLat == null || form.pickupLng == null || form.dropLat == null || form.dropLng == null) return null;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(form.dropLat - form.pickupLat);
    const dLng = toRad(form.dropLng - form.pickupLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(form.pickupLat)) * Math.cos(toRad(form.dropLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const roughDistanceEstimate = () => {
    const h = haversineKm();
    if (h && h > 0) return Math.max(1, Math.round(h));
    const a = form.pickupAddress.trim();
    const b = form.dropAddress.trim();
    if (!a || !b) return 10;
    const diff = Math.abs(a.length - b.length);
    return Math.max(5, Math.min(30, 5 + diff));
  };
  const baseRates: Record<string, number> = { bicycle: 1500, motorbike: 2000, van: 4000, truck: 8000 };
  const perKm: Record<string, number> = { bicycle: 50, motorbike: 80, van: 120, truck: 180 };
  const km = roughDistanceEstimate();
  const vt = form.vehicleType || 'motorbike';
  const w = parseFloat(form.weightKg) || 0;
  const weightFactor = 1 + Math.max(0, w) * 0.05; // +5% per kg
  const minAmount = Math.round((baseRates[vt] + perKm[vt] * km) * weightFactor);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValid =
    form.pickupAddress.trim() !== '' &&
    form.dropAddress.trim() !== '' &&
    form.itemName.trim() !== '' &&
    form.weightKg.trim() !== '' &&
    form.valueNgn.trim() !== '' &&
    form.vehicleType !== '' &&
    (parseFloat(form.offerAmount) || 0) >= minAmount &&
    (form.paymentMethod !== 'paystack' || emailRegex.test(form.payerEmail));
  const ensurePaystack = async () => {
    if (window.PaystackPop) return;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://js.paystack.co/v1/inline.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Paystack'));
      document.head.appendChild(s);
    });
  };
  const startPaystackCheckout = async (amountNgn: number) => {
    await ensurePaystack();
    const key = import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY;
    if (!key) {
      toast.error('Missing Paystack public key');
      throw new Error('Missing Paystack key');
    }
    return new Promise<{ reference: string }>((resolve, reject) => {
      const handler = window.PaystackPop!.setup({
        key,
        email: form.payerEmail,
        amount: Math.round(amountNgn * 100),
        currency: 'NGN',
        ref: `KX-${Date.now()}`,
        metadata: {
          pickup: form.pickupAddress,
          drop: form.dropAddress,
          vehicle: form.vehicleType,
          item: form.itemName,
          weightKg: form.weightKg,
          fragile: form.fragile,
        },
        callback: (response) => resolve(response),
        onClose: () => reject(new Error('Payment closed')),
      });
      handler.openIframe();
    });
  };
  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (step === 1) {
          if (!step1Valid) return;
          setStep(2);
          return;
        }
        if (step === 2) {
          if (!isValid) return;
          if (form.paymentMethod === 'paystack') {
            try {
              const amt = parseFloat(form.offerAmount) || 0;
              const res = await startPaystackCheckout(amt);
              toast.success(`Payment successful: ${res.reference}`);
              onCreated();
            } catch {
              toast.error('Payment not completed');
            }
          } else {
            onCreated();
          }
        }
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-primary uppercase">Step {step} of 2</p>
        <div className="text-xs text-slate-500 dark:text-slate-400">All fields are required unless marked optional</div>
      </div>
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pickup Address</label>
              <AddressAutocomplete
                value={form.pickupAddress}
                onChange={(v) => setForm({ ...form, pickupAddress: v })}
                onPlace={(addr, lat, lng) => setForm({ ...form, pickupAddress: addr, pickupLat: lat, pickupLng: lng })}
                placeholder="Search address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drop-off Address</label>
              <AddressAutocomplete
                value={form.dropAddress}
                onChange={(v) => setForm({ ...form, dropAddress: v })}
                onPlace={(addr, lat, lng) => setForm({ ...form, dropAddress: addr, dropLat: lat, dropLng: lng })}
                placeholder="Search address"
              />
            </div>
          </div>
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
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.fragile}
              onChange={(e) => setForm({ ...form, fragile: e.target.checked })}
              className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
            />
            <span className="text-sm">Fragile item</span>
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vehicle Type</label>
              <select
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value as VehicleType })}
                className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
              >
                <option value="">Select vehicle</option>
                <option value="bicycle">Bicycle</option>
                <option value="motorbike">Motorbike</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Offer Amount (₦)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={minAmount}
                  value={form.offerAmount}
                  onChange={(e) => setForm({ ...form, offerAmount: e.target.value })}
                  placeholder={`≥ ₦${minAmount.toLocaleString()}`}
                  className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Minimum for selected vehicle and distance: <span className="font-semibold">₦{minAmount.toLocaleString()}</span>
              </p>
              {form.paymentMethod === 'paystack' && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payer Email</label>
                  <input
                    type="email"
                    value={form.payerEmail}
                    onChange={(e) => setForm({ ...form, payerEmail: e.target.value })}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {!emailRegex.test(form.payerEmail) && (
                    <p className="text-xs text-amber-600">Enter a valid email for Paystack</p>
                  )}
                </div>
              )}
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

function AddressAutocomplete({
  value,
  onChange,
  onPlace,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onPlace: (addr: string, lat: number, lng: number) => void;
  placeholder?: string;
}) {
  const key = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
  const forceOsm = import.meta.env?.VITE_USE_OSM === '1';
  const useOsm = forceOsm || !key;
  const [loaded, setLoaded] = useState<boolean>(!!window.google?.maps?.places);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Array<{ label: string; lat: number; lon: number }>>([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value);
  const [active, setActive] = useState<number | null>(null);
  const fix = (s: string) => {
    let x = s;
    x = x.replace(/mauclay/gi, 'Macaulay');
    x = x.replace(/\bave\b/gi, 'Avenue');
    x = x.replace(/\brd\b/gi, 'Road');
    x = x.replace(/\bst\b/gi, 'Street');
    x = x.replace(/\bdr\b/gi, 'Drive');
    x = x.replace(/\bcl\b/gi, 'Close');
    x = x.replace(/\bcr\b/gi, 'Crescent');
    x = x.replace(/\bln\b/gi, 'Lane');
    x = x.replace(/\bblvd\b/gi, 'Boulevard');
    return x;
  };
  React.useEffect(() => {
    setQ(value);
  }, [value]);
  React.useEffect(() => {
    if (useOsm) return;
    if (loaded || window.google?.maps?.places) return;
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.async = true;
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, [loaded, useOsm, key]);
  React.useEffect(() => {
    if (useOsm) return;
    if (!window.google?.maps?.places || !inputRef.current) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry'],
    });
    ac.addListener('place_changed', () => {
      const p = ac.getPlace();
      const addr = p.formatted_address || inputRef.current?.value || '';
      const lat = p.geometry?.location?.lat?.() ?? null;
      const lng = p.geometry?.location?.lng?.() ?? null;
      if (lat != null && lng != null) onPlace(addr, lat, lng);
      else onChange(addr);
    });
  }, [loaded, useOsm, onChange, onPlace]);
  React.useEffect(() => {
    if (!useOsm) return;
    const controller = new AbortController();
    const run = async () => {
      const qq = q.trim();
      if (!qq) {
        setItems([]);
        setOpen(false);
        return;
      }
      try {
        const hasNum = /\d/.test(qq);
        const hasStreetWord = /\b(road|rd|street|st|avenue|ave|way|drive|dr|close|cl|crescent|cr|lane|ln|boulevard|blvd|place|court)\b/i.test(qq);
        const doStructured = hasNum || hasStreetWord;

        const searchGeneral = async () => {
          const u = new URL('https://nominatim.openstreetmap.org/search');
          u.searchParams.set('format', 'jsonv2');
          u.searchParams.set('addressdetails', '1');
          u.searchParams.set('limit', '8');
          u.searchParams.set('countrycodes', 'ng');
          const qParam = qq.toLowerCase().includes('lagos') ? qq : `${qq}, Lagos, Nigeria`;
          u.searchParams.set('q', qParam);
          u.searchParams.set('viewbox', '3.1,6.7,3.6,6.3');
          u.searchParams.set('bounded', '1');
          const r = await fetch(u.toString(), { signal: controller.signal, headers: { 'Accept-Language': 'en' } });
          if (!r.ok) throw new Error('search failed');
          const data = (await r.json()) as Array<{ display_name: string; lat: string; lon: string }>;
          return (data || []).map((d) => ({ label: d.display_name, lat: parseFloat(d.lat), lon: parseFloat(d.lon) }));
        };

        const searchStructured = async () => {
          const u2 = new URL('https://nominatim.openstreetmap.org/search');
          u2.searchParams.set('format', 'jsonv2');
          u2.searchParams.set('addressdetails', '1');
          u2.searchParams.set('limit', '8');
          u2.searchParams.set('countrycodes', 'ng');
          u2.searchParams.set('street', fix(qq));
          u2.searchParams.set('city', 'Lagos');
          u2.searchParams.set('state', 'Lagos');
          u2.searchParams.set('country', 'Nigeria');
          const r2 = await fetch(u2.toString(), { signal: controller.signal, headers: { 'Accept-Language': 'en' } });
          if (!r2.ok) throw new Error('search failed');
          const data2 = (await r2.json()) as Array<{ display_name: string; lat: string; lon: string }>;
          return (data2 || []).map((d) => ({ label: d.display_name, lat: parseFloat(d.lat), lon: parseFloat(d.lon) }));
        };
        const searchPhoton = async () => {
          const u3 = new URL('https://photon.komoot.io/api/');
          u3.searchParams.set('q', `${fix(qq)}, Lagos, Nigeria`);
          u3.searchParams.set('limit', '8');
          u3.searchParams.set('lang', 'en');
          u3.searchParams.set('lat', '6.5');
          u3.searchParams.set('lon', '3.4');
          const r3 = await fetch(u3.toString(), { signal: controller.signal, headers: { 'Accept-Language': 'en' } });
          if (!r3.ok) throw new Error('search failed');
          const data3 = await r3.json();
          const feats: Array<{
            properties?: { housenumber?: string; street?: string; name?: string; city?: string; locality?: string };
            geometry?: { coordinates?: [number, number] };
          }> = (data3 && data3.features) || [];
          const next3 = feats
            .map((f) => {
              const p = f.properties || {};
              const parts = [p.housenumber, p.street || p.name, p.city || p.locality, 'Lagos', 'Nigeria'].filter(Boolean);
              const label = parts.join(', ');
              const coords = f.geometry?.coordinates;
              const lon = Array.isArray(coords) ? Number(coords[0]) : NaN;
              const lat = Array.isArray(coords) ? Number(coords[1]) : NaN;
              if (Number.isFinite(lat) && Number.isFinite(lon) && label) {
                return { label, lat, lon };
              }
              return null;
            })
            .filter((v): v is { label: string; lat: number; lon: number } => !!v);
          return next3;
        };

        const primary = doStructured ? await searchStructured() : await searchGeneral();
        let results = primary;
        if (results.length === 0) {
          const general = await searchGeneral();
          results = general;
        }
        if (results.length === 0) {
          const photon = await searchPhoton();
          results = photon;
        }

        if (results.length > 0) {
          setItems(results);
          setOpen(true);
        } else {
          const qn = qq.toLowerCase();
          const local = LAGOS_PLACES.filter((p) => p.label.toLowerCase().includes(qn)).slice(0, 8);
          setItems(local);
          setOpen(local.length > 0);
        }
      } catch {
        const qn = qq.toLowerCase();
        const local = LAGOS_PLACES.filter((p) => p.label.toLowerCase().includes(qn)).slice(0, 8);
        setItems(local);
        setOpen(local.length > 0);
      }
    };
    const t = setTimeout(run, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q, useOsm]);
  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onChange(e.target.value);
          if (useOsm) setOpen(true);
        }}
        onFocus={() => {
          if (useOsm && items.length > 0) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!useOsm || !open || items.length === 0) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((p) => {
              if (p == null) return 0;
              return Math.min(items.length - 1, p + 1);
            });
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((p) => {
              if (p == null) return items.length - 1;
              return Math.max(0, p - 1);
            });
          } else if (e.key === 'Enter' && active != null) {
            e.preventDefault();
            const it = items[active];
            const addr = it.label;
            setQ(addr);
            setOpen(false);
            onPlace(addr, it.lat, it.lon);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        placeholder={placeholder || 'Search address'}
        className="h-11 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
      {useOsm && open && items.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-primary/20 bg-white dark:bg-background-dark shadow-lg max-h-72 overflow-auto">
          {items.map((it, i) => (
            <button
              key={`${it.label}-${i}`}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => {
                const addr = it.label;
                setQ(addr);
                setOpen(false);
                onPlace(addr, it.lat, it.lon);
              }}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-primary/10 ${
                active === i ? 'bg-primary/10' : ''
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
