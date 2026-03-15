import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CustomerOnboarding from './pages/CustomerOnboarding';
import CustomerDashboard from './pages/CustomerDashboard';
import RiderOnboarding from './pages/RiderOnboarding';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'onboarding' | 'dashboard' | 'rider-onboarding'>('landing');
  const [showRolePrompt, setShowRolePrompt] = useState(false);

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage 
          onLoginClick={() => setCurrentScreen('login')} 
          onOnboardingClick={() => setCurrentScreen('onboarding')}
          onRiderOnboardingClick={() => setCurrentScreen('rider-onboarding')}
        />
      )}
      {currentScreen === 'login' && (
        <LoginPage 
          onBack={() => setCurrentScreen('landing')} 
          onSignUpClick={() => setShowRolePrompt(true)}
          onLoginSuccess={() => {
            setCurrentScreen('dashboard');
            toast.success('Welcome back!');
          }}
        />
      )}
      {currentScreen === 'onboarding' && (
        <CustomerOnboarding 
          onClose={() => setCurrentScreen('landing')} 
          onComplete={() => {
            setCurrentScreen('dashboard');
            toast.success('Registration complete');
          }}
        />
      )}
      {currentScreen === 'rider-onboarding' && (
        <RiderOnboarding onClose={() => setCurrentScreen('landing')} />
      )}
      {currentScreen === 'dashboard' && (
        <CustomerDashboard onLogout={() => setCurrentScreen('landing')} />
      )}
      {showRolePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-primary/20 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Choose Your Path</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sign up as a customer or a logistics rider.</p>
              </div>
              <button
                onClick={() => setShowRolePrompt(false)}
                className="h-10 w-10 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowRolePrompt(false);
                  setCurrentScreen('onboarding');
                  toast.info('Customer onboarding');
                }}
                className="rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 p-4 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">shopping_cart</span>
                  <div>
                    <p className="font-bold">Customer</p>
                    <p className="text-xs text-slate-500">Book and manage deliveries</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowRolePrompt(false);
                  setCurrentScreen('rider-onboarding');
                  toast.info('Rider onboarding');
                }}
                className="rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 p-4 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">pedal_bike</span>
                  <div>
                    <p className="font-bold">Logistics Rider</p>
                    <p className="text-xs text-slate-500">Apply to deliver and earn</p>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRolePrompt(false)}
                className="text-sm font-semibold text-slate-600 hover:text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="dark" />
    </>
  );
}

export default App;
