import React, { useState } from 'react';

interface CustomerOnboardingProps {
  onClose: () => void;
}

const CustomerOnboarding: React.FC<CustomerOnboardingProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setStep1Data] = useState({
    fullName: '',
    phone: '',
    businessName: '',
  });

  const isStep1Valid = formData.fullName.trim() !== '' && formData.phone.trim() !== '';

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header Section */}
          <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-40 bg-background-light dark:bg-background-dark sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 bg-primary rounded-lg text-background-dark">
                <span className="material-symbols-outlined font-bold">bolt</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Kinetix</h2>
            </div>
            <button 
              onClick={onClose}
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 hover:bg-primary/20 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <main className="flex-1 flex flex-col items-center py-10 px-6">
            <div className="w-full max-w-[520px] flex flex-col gap-8">
              {/* Progress Section */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Step {step} of 3</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {step === 1 && "Personal Details"}
                    {step === 2 && "Verification"}
                    {step === 3 && "Complete"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-primary/10 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {step === 1 && (
                <>
                  {/* Step 1: Personal Details */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Personal Details</h1>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Let's start with some basic information about you and your business to customize your experience.</p>
                  </div>

                  <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Full Name Field */}
                    <div className="flex flex-col gap-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="full-name">
                        Full Name
                      </label>
                      <input 
                        className="flex h-12 w-full rounded-lg border border-slate-300 dark:border-primary/20 bg-white dark:bg-primary/5 px-4 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100" 
                        id="full-name" 
                        placeholder="e.g. Chinelo Adebayo" 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setStep1Data({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="flex flex-col gap-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="phone">
                        Phone Number
                      </label>
                      <div className="relative flex">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none gap-2 border-r border-slate-300 dark:border-primary/20 pr-3 my-2">
                          <div className="w-5 h-4 bg-gradient-to-r from-[#008751] via-white to-[#008751] rounded-sm"></div>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">+234</span>
                        </div>
                        <input 
                          className="flex h-12 w-full rounded-lg border border-slate-300 dark:border-primary/20 bg-white dark:bg-primary/5 pl-28 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:text-slate-100" 
                          id="phone" 
                          placeholder="801 234 5678" 
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setStep1Data({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Business Name Field (Optional) */}
                    <div className="flex flex-col gap-2 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="business-name">
                          Business Name
                        </label>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Optional</span>
                      </div>
                      <input 
                        className="flex h-12 w-full rounded-lg border border-slate-300 dark:border-primary/20 bg-white dark:bg-primary/5 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:text-slate-100" 
                        id="business-name" 
                        placeholder="e.g. Kinetix Solutions Ltd" 
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setStep1Data({ ...formData, businessName: e.target.value })}
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button 
                        disabled={!isStep1Valid}
                        onClick={() => setStep(2)}
                        className={`w-full h-12 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] ${
                          isStep1Valid 
                          ? 'bg-primary text-background-dark hover:bg-primary/90' 
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Continue
                        <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                </>
              )}

              {step > 1 && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Step {step} Coming Soon</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">We are building the next steps of your onboarding experience.</p>
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="text-primary font-bold hover:underline"
                  >
                    Go Back
                  </button>
                </div>
              )}

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 pt-4 opacity-60">
                <span className="material-symbols-outlined text-sm">lock</span>
                <p className="text-[12px] font-medium">Your data is secured with bank-grade encryption</p>
              </div>
            </div>
          </main>

          {/* Footer Section */}
          <footer className="mt-auto px-6 py-8 border-t border-primary/10 flex flex-col items-center gap-4 lg:px-40">
            <div className="flex gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Help Center</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;
