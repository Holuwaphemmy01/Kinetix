import React, { useState, useRef } from 'react';

interface CustomerOnboardingProps {
  onClose: () => void;
  onComplete: () => void;
}

const CustomerOnboarding: React.FC<CustomerOnboardingProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    paymentMethod: 'paystack' as 'paystack' | 'cngn',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isStep1Valid = formData.fullName.trim() !== '' && emailRegex.test(formData.email) && formData.phone.trim() !== '';
  const isOtpComplete = otp.every(digit => digit !== '');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const maskEmail = (email: string) => {
    if (!email) return 'u***@example.com';
    const [user, domain] = email.split('@');
    if (user.length <= 2) return `${user}***@${domain}`;
    return `${user.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-40">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-background-dark">
                <span className="material-symbols-outlined text-xl">shield_person</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Kinetix</h2>
            </div>
            <button 
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              <span className="material-symbols-outlined">help</span>
            </button>
          </header>

          {/* Main Content Container */}
          <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-40">
            <div className="w-full max-w-[480px] space-y-8">
              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-primary">Step {step} of 3</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {step === 1 && "33%"}
                    {step === 2 && "66%"}
                    {step === 3 && "100% Complete"}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
                  <div
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={(step / 3) * 100}
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    role="progressbar"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
                {step === 3 && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Final Security Check</p>
                )}
                {step === 2 && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Payment Preference</p>
                )}
                {step === 1 && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Personal Details</p>
                )}
              </div>

              {step === 1 && (
                <>
                  {/* Header Section */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Personal Details</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      Let's start with some basic information about you and your business to customize your experience.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Full Name Field */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="full-name">
                        Full Name
                      </label>
                      <input 
                        className="flex h-12 w-full rounded-lg border border-primary/30 bg-white dark:bg-primary/5 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white outline-none transition-all" 
                        id="full-name" 
                        placeholder="e.g. Chinelo Adebayo" 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    {/* Email Address Field */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">
                        Email Address
                      </label>
                      <input 
                        className={`flex h-12 w-full rounded-lg border bg-white dark:bg-primary/5 px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white outline-none transition-all ${
                          formData.email && !emailRegex.test(formData.email) ? 'border-red-500' : 'border-primary/30 focus:border-primary'
                        }`} 
                        id="email" 
                        placeholder="e.g. name@example.com" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      {formData.email && !emailRegex.test(formData.email) && (
                        <p className="text-[10px] text-red-500 ml-1">Please enter a valid email address.</p>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="phone">
                        Phone Number
                      </label>
                      <div className="relative flex">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none gap-2 border-r border-primary/30 pr-3 my-2">
                          <div className="w-5 h-4 bg-gradient-to-r from-[#008751] via-white to-[#008751] rounded-sm"></div>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">+234</span>
                        </div>
                        <input 
                          className="flex h-12 w-full rounded-lg border border-primary/30 bg-white dark:bg-primary/5 pl-28 pr-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white outline-none transition-all" 
                          id="phone" 
                          placeholder="801 234 5678" 
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Business Name Field (Optional) */}
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="business-name">
                          Business Name
                        </label>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Optional</span>
                      </div>
                      <input 
                        className="flex h-12 w-full rounded-lg border border-primary/30 bg-white dark:bg-primary/5 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white outline-none transition-all" 
                        id="business-name" 
                        placeholder="e.g. Kinetix Solutions Ltd" 
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button 
                        disabled={!isStep1Valid}
                        onClick={() => setStep(2)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition-all active:scale-[0.98] ${
                          isStep1Valid 
                          ? 'bg-primary text-background-dark hover:brightness-110 shadow-lg' 
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Continue
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Header Section */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Payment Preference</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      How will you fund your deliveries? Select your preferred payment method.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Paystack Option */}
                    <label className={`group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-6 transition-all hover:bg-primary/10 ${
                      formData.paymentMethod === 'paystack' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-primary/10 bg-white dark:bg-primary/5'
                    }`}>
                      <input 
                        className="sr-only" 
                        name="payment_method" 
                        type="radio" 
                        value="paystack"
                        checked={formData.paymentMethod === 'paystack'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'paystack' })}
                      />
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-3xl">credit_card</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">Paystack</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Naira Bank Transfer/Card. Secure and instant payments.</span>
                      </div>
                      <div className={`absolute right-6 top-6 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.paymentMethod === 'paystack'
                        ? 'border-primary bg-primary'
                        : 'border-slate-300 dark:border-primary/40'
                      }`}>
                        {formData.paymentMethod === 'paystack' && (
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        )}
                      </div>
                    </label>

                    {/* cNGN Option */}
                    <label className={`group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-6 transition-all hover:bg-primary/10 ${
                      formData.paymentMethod === 'cngn' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-primary/10 bg-white dark:bg-primary/5'
                    }`}>
                      <input 
                        className="sr-only" 
                        name="payment_method" 
                        type="radio" 
                        value="cngn"
                        checked={formData.paymentMethod === 'cngn'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cngn' })}
                      />
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-3xl">currency_bitcoin</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">Direct cNGN Wallet</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Connect your blockchain wallet for fast, low-fee settlements.</span>
                      </div>
                      <div className={`absolute right-6 top-6 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.paymentMethod === 'cngn'
                        ? 'border-primary bg-primary'
                        : 'border-slate-300 dark:border-primary/40'
                      }`}>
                        {formData.paymentMethod === 'cngn' && (
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button 
                      onClick={() => setStep(3)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-sm font-bold text-background-dark hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
                    >
                      Continue
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Header Section */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Verify Email Address</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      We've sent a 6-digit verification code to <span className="font-semibold text-slate-900 dark:text-slate-100">{maskEmail(formData.email)}</span>. Please enter it below to secure your account.
                    </p>
                  </div>

                  {/* OTP Input Section */}
                  <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex justify-between gap-2 sm:gap-4">
                      {/* 6-Slot OTP Input simulating Shadcn UI InputOTP */}
                      {otp.map((digit, index) => (
                        <React.Fragment key={index}>
                          <input 
                            ref={(el) => { otpRefs.current[index] = el; }}
                            className="h-12 w-10 sm:h-14 sm:w-14 rounded-lg border border-primary/30 bg-white dark:bg-primary/5 text-center text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white outline-none transition-all" 
                            maxLength={1} 
                            required 
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                          />
                          {index === 2 && (
                            <div className="flex items-center text-slate-400">—</div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Didn't receive the code? 
                        <button className="font-semibold text-primary hover:underline transition-all" type="button">Resend Code</button>
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 flex flex-col gap-4">
                      <button 
                        disabled={!isOtpComplete}
                        onClick={onComplete}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition-all active:scale-[0.98] ${
                          isOtpComplete 
                          ? 'bg-primary text-background-dark hover:brightness-110 shadow-lg' 
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                        }`}
                        type="submit"
                      >
                        <span>Complete Registration</span>
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </button>
                      <button 
                        onClick={() => setStep(2)}
                        className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  </form>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/10 bg-primary/5 py-3 text-xs font-medium text-primary/80">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>End-to-end encrypted verification</span>
                  </div>
                </>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="px-6 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
            <p>© 2024 Kinetix Secure Systems. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;
