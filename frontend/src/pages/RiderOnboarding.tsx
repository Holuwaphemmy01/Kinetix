import React, { useState } from 'react';

interface RiderOnboardingProps {
  onClose: () => void;
}

const RiderOnboarding: React.FC<RiderOnboardingProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    vehicleType: '',
    plateNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isStep1Valid =
    formData.fullName.trim() !== '' &&
    formData.dob.trim() !== '' &&
    formData.vehicleType.trim() !== '' &&
    formData.plateNumber.trim() !== '';

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-20 bg-background-light dark:bg-background-dark sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">Kinetix Rider</h2>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors sm:hidden"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                <img className="h-full w-full object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2kue-i6IhwOzQ3c5_7TymA34b520scFoGCu4Lk2HW43fX0zZU7wy0FaVEPlqzN9vi4VMA1L5GD-_RCDEMRpRFetErX1gGfZoVnleqNkUsEUECBVoo8wfQSKvsf7FEYukWKI4l3YNoukFloEsebIxpUQbuISofX0pBP7JA-5iQK2Uja4TUNP7mJRzmN6QPFOaKj1j1JgYaSJRk_0jS9TyRLbrYXtFt-to6XrmShGLhwzhIHY8BOxRQ5G8EYdbmNmALO0EO-rVbPZM"/>
              </div>
            </div>
          </header>

          <main className="flex flex-1 justify-center py-10 px-6 lg:px-20">
            <div className="flex w-full max-w-6xl flex-col lg:flex-row gap-8">
              {/* Sidebar: Rider Benefits */}
              <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                <div className="rounded-xl bg-slate-800/50 dark:bg-primary/5 p-6 border border-primary/10">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary">Rider Benefits</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Why join Kinetix?</p>
                  </div>
                  <nav className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 border border-primary/30 text-primary">
                      <span className="material-symbols-outlined">payments</span>
                      <span className="text-sm font-medium">Instant Payouts</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined">ev_station</span>
                      <span className="text-sm font-medium">Fuel Liquidity</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined">schedule</span>
                      <span className="text-sm font-medium">Flexible Hours</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined">trending_up</span>
                      <span className="text-sm font-medium">Trust Score Growth</span>
                    </div>
                  </nav>
                </div>
                {/* Trust Badge */}
                <div className="p-6 border border-primary/10 rounded-xl bg-slate-800/20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Secure Provider Portal</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">Your data is encrypted and handled according to our global fintech safety standards.</p>
                </div>
              </aside>

              {/* Main Application Form */}
              <section className="flex-1 min-w-0">
                <div className="bg-white dark:bg-slate-900/40 border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                  {/* Progress Section */}
                  <div className="mb-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-3">
                      <div>
                        <p className="text-primary text-sm font-bold uppercase tracking-widest">Step {step} of 3</p>
                        <h1 className="text-2xl sm:text-3xl font-black mt-1">
                          {step === 1 && "Identity & Vehicle Details"}
                          {step === 2 && "License & Insurance"}
                          {step === 3 && "Final Review"}
                        </h1>
                      </div>
                      <p className="text-slate-400 text-sm font-medium whitespace-nowrap">{Math.round((step / 3) * 100)}% Complete</p>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                  </div>

                  {step === 1 && (
                    <form
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isStep1Valid) return;
                        setStep(2);
                      }}
                    >
                      {/* Full Name */}
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500" 
                          placeholder="Enter your full legal name" 
                          type="text"
                          required
                        />
                      </div>
                      {/* Date of Birth */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                        <div className="relative">
                          <input 
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all [color-scheme:dark]" 
                            type="date"
                            required
                          />
                        </div>
                      </div>
                      {/* Vehicle Type */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vehicle Type</label>
                        <div className="relative">
                          <select 
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none pr-10"
                            required
                          >
                            <option disabled value="">Select vehicle type</option>
                            <option value="bicycle">Bicycle</option>
                            <option value="motorbike">Motorbike</option>
                            <option value="van">Van</option>
                            <option value="truck">Truck</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            expand_more
                          </span>
                        </div>
                      </div>
                      {/* Vehicle Plate Number */}
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vehicle Plate Number</label>
                        <input 
                          name="plateNumber"
                          value={formData.plateNumber}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500" 
                          placeholder="e.g. ABC-1234" 
                          type="text"
                          required
                        />
                        <p className="text-xs text-slate-500 mt-1 italic">Enter 'N/A' if using a bicycle.</p>
                      </div>
                      {/* Action Buttons */}
                      <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-8">
                        <button 
                          type="button"
                          className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-slate-400 hover:text-primary transition-colors order-2 sm:order-1"
                        >
                          Save Draft
                        </button>
                        <button 
                          type="submit"
                          disabled={!isStep1Valid}
                          className={`w-full sm:w-auto px-10 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-[0.98] ${
                            isStep1Valid
                              ? 'bg-primary hover:bg-primary/90 text-background-dark shadow-lg shadow-primary/20'
                              : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                          }`}
                        >
                          Continue to Step 2
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {step > 1 && (
                    <div className="py-20 text-center space-y-4">
                      <span className="material-symbols-outlined text-6xl text-primary animate-pulse">construction</span>
                      <h2 className="text-2xl font-bold">Step {step} Coming Soon</h2>
                      <p className="text-slate-400">We're still setting up the rest of the rider application flow.</p>
                      <button onClick={() => setStep(step - 1)} className="text-primary hover:underline font-bold transition-all">Go Back</button>
                    </div>
                  )}
                </div>
                {/* Info Footer */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-500 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    256-bit SSL Encryption
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                    24/7 Priority Support
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RiderOnboarding;
