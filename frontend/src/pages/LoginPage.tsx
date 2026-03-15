import React from 'react';

interface LoginPageProps {
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Pattern Decoration */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/40 rounded-full blur-[120px]"></div>
        <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #14b8a5 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Back Button */}
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
        )}

        {/* Logo Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Kinetix</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Decentralized Logistics Protocol</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[460px] bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-primary/20 rounded-xl shadow-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">Welcome back</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Input Fields */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 text-left block">Email or Phone Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-500" 
                  placeholder="Enter your credentials" 
                  type="text"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                <input 
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-500" 
                  placeholder="••••••••" 
                  type="password"
                />
                <button className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg hover:text-primary transition-colors" type="button">visibility</button>
              </div>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4">
              Sign In 
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-900 dark:text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-900 dark:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign Up Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account? 
              <a className="text-primary font-bold hover:underline ml-1" href="#">Sign Up</a>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 text-slate-500 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">verified_user</span>
              <span className="text-xs font-semibold tracking-widest uppercase">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">link</span>
              <span className="text-xs font-semibold tracking-widest uppercase">Secured by Somnia L1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">encrypted</span>
              <span className="text-xs font-semibold tracking-widest uppercase">E2E Encrypted</span>
            </div>
          </div>
          <div className="flex gap-4 text-slate-400 dark:text-slate-600 text-xs font-medium">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <span className="select-none">•</span>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <span className="select-none">•</span>
            <a className="hover:text-primary transition-colors" href="#">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
