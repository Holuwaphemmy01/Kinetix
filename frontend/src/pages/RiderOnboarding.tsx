import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface RiderOnboardingProps {
  onClose: () => void;
  onComplete?: () => void;
}

const RiderOnboarding: React.FC<RiderOnboardingProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    vehicleType: '',
    plateNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
    insuranceProvider: '',
    insurancePolicy: '',
    insuranceExpiry: '',
    licenseFileName: '',
    insuranceFileName: '',
    vehicleRegFileName: '',
    password: '',
    confirmPassword: '',
  });
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files && files[0];
    setFormData(prev => ({ ...prev, [name]: file ? file.name : '' }));
  };

  const isStep1Valid =
    formData.fullName.trim() !== '' &&
    formData.dob.trim() !== '' &&
    formData.vehicleType.trim() !== '' &&
    formData.plateNumber.trim() !== '';

  const isStep2Valid =
    formData.licenseNumber.trim() !== '' &&
    formData.licenseExpiry.trim() !== '' &&
    formData.insuranceProvider.trim() !== '' &&
    formData.insurancePolicy.trim() !== '' &&
    formData.insuranceExpiry.trim() !== '' &&
    formData.licenseFileName.trim() !== '' &&
    formData.insuranceFileName.trim() !== '' &&
    formData.vehicleRegFileName.trim() !== '';

  const isStep3Valid =
    consentAccepted &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.password === formData.confirmPassword;

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
                        <div className="relative group">
                          <select 
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleInputChange}
                            className="peer w-full rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 pr-12 text-slate-900 dark:text-white hover:bg-primary/10 focus:bg-white dark:focus:bg-background-dark/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all appearance-none shadow-sm"
                            required
                          >
                            <option disabled value="">Select vehicle type</option>
                            <option value="bicycle">Bicycle</option>
                            <option value="motorbike">Motorbike</option>
                            <option value="van">Van</option>
                            <option value="truck">Truck</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60 group-focus-within:text-primary transition-transform duration-200 peer-focus:rotate-180">expand_more</span>
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

                  {step === 2 && (
                    <form
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isStep2Valid) return;
                        setStep(3);
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Driver’s License Number</label>
                        <input
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500"
                          placeholder="e.g. DL-0123-4567"
                          type="text"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">License Expiry Date</label>
                        <input
                          name="licenseExpiry"
                          value={formData.licenseExpiry}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all [color-scheme:dark]"
                          type="date"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Driver’s License</label>
                        <input
                          name="licenseFileName"
                          onChange={handleFileChange}
                          className="block w-full rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10 p-3 text-sm text-slate-700 dark:text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background-dark file:font-bold hover:file:brightness-110 cursor-pointer"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        {formData.licenseFileName && (
                          <p className="text-xs text-slate-500">Selected: {formData.licenseFileName}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Insurance Provider</label>
                        <input
                          name="insuranceProvider"
                          value={formData.insuranceProvider}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500"
                          placeholder="e.g. Allied Insurance Ltd"
                          type="text"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Policy Number</label>
                        <input
                          name="insurancePolicy"
                          value={formData.insurancePolicy}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500"
                          placeholder="e.g. PL-9087-XYZ"
                          type="text"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Insurance Expiry Date</label>
                        <input
                          name="insuranceExpiry"
                          value={formData.insuranceExpiry}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all [color-scheme:dark]"
                          type="date"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Insurance Document</label>
                        <input
                          name="insuranceFileName"
                          onChange={handleFileChange}
                          className="block w-full rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10 p-3 text-sm text-slate-700 dark:text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background-dark file:font-bold hover:file:brightness-110 cursor-pointer"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        {formData.insuranceFileName && (
                          <p className="text-xs text-slate-500">Selected: {formData.insuranceFileName}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Vehicle Registration</label>
                        <input
                          name="vehicleRegFileName"
                          onChange={handleFileChange}
                          className="block w-full rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10 p-3 text-sm text-slate-700 dark:text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background-dark file:font-bold hover:file:brightness-110 cursor-pointer"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        {formData.vehicleRegFileName && (
                          <p className="text-xs text-slate-500">Selected: {formData.vehicleRegFileName}</p>
                        )}
                      </div>
                      <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-4 mt-8">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-slate-500 hover:text-primary transition-colors"
                        >
                          Go Back
                        </button>
                        <div className="flex w-full sm:w-auto gap-4">
                          <button
                            type="button"
                            className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-slate-400 hover:text-primary transition-colors"
                          >
                            Save Draft
                          </button>
                          <button
                            type="submit"
                            disabled={!isStep2Valid}
                            className={`w-full sm:w-auto px-10 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                              isStep2Valid
                                ? 'bg-primary hover:bg-primary/90 text-background-dark shadow-lg shadow-primary/20'
                                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                          >
                            Continue to Step 3
                            <span className="material-symbols-outlined">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto w-full">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold">Final Review</h2>
                          <p className="text-slate-500 dark:text-slate-400 mt-2">Confirm your details and create your password.</p>
                        </div>
                        <div className="space-y-4 mb-8">
                          <div className="flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 p-4">
                            <p className="text-sm">
                              <span className="font-semibold">{formData.fullName || '—'}</span>
                              <span className="mx-2 text-slate-400">•</span>
                              <span className="text-slate-600">{formData.vehicleType || '—'}</span>
                              <span className="mx-2 text-slate-400">•</span>
                              <span className="text-slate-600">{formData.plateNumber || '—'}</span>
                            </p>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="text-primary text-xs font-bold hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                              <span className="material-symbols-outlined text-green-600">check_circle</span>
                              <div className="text-xs">
                                <p className="font-semibold">License</p>
                                <p className="text-slate-500">{formData.licenseFileName ? 'Provided' : 'Missing'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                              <span className="material-symbols-outlined text-green-600">check_circle</span>
                              <div className="text-xs">
                                <p className="font-semibold">Insurance</p>
                                <p className="text-slate-500">{formData.insuranceFileName ? 'Provided' : 'Missing'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                              <span className="material-symbols-outlined text-green-600">check_circle</span>
                              <div className="text-xs">
                                <p className="font-semibold">Registration</p>
                                <p className="text-slate-500">{formData.vehicleRegFileName ? 'Provided' : 'Missing'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setStep(2)}
                              className="text-primary text-xs font-bold hover:underline"
                            >
                              Edit documents
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Create Password</label>
                            <input
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500"
                              placeholder="Enter a secure password"
                              type="password"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <input
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/50 p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500"
                              placeholder="Re-enter your password"
                              type="password"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-start gap-3 mb-6">
                          <div className="mt-1">
                            <input
                              id="consent"
                              type="checkbox"
                              checked={consentAccepted}
                              onChange={(e) => setConsentAccepted(e.target.checked)}
                              className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-transparent"
                            />
                          </div>
                          <label htmlFor="consent" className="text-sm text-slate-600 dark:text-slate-400">
                            I confirm the details are accurate and the documents provided are authentic.
                          </label>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-slate-500 hover:text-primary transition-colors"
                          >
                            Go Back
                          </button>
                          <button
                            onClick={() => {
                              if (!isStep3Valid) return;
                              toast.success('Application submitted successfully.');
                              if (typeof onComplete === 'function') onComplete();
                            }}
                            disabled={!isStep3Valid}
                            className={`w-full sm:w-auto py-4 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                              isStep3Valid
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]'
                                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                          >
                            Submit Application
                            <span className="material-symbols-outlined">send</span>
                          </button>
                        </div>
                      </div>
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
