import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CustomerOnboarding from './pages/CustomerOnboarding';
import CustomerDashboard from './pages/CustomerDashboard';
import RiderOnboarding from './pages/RiderOnboarding';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'onboarding' | 'dashboard' | 'rider-onboarding'>('landing');

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
          onSignUpClick={() => setCurrentScreen('onboarding')}
          onLoginSuccess={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'onboarding' && (
        <CustomerOnboarding 
          onClose={() => setCurrentScreen('landing')} 
          onComplete={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'rider-onboarding' && (
        <RiderOnboarding onClose={() => setCurrentScreen('landing')} />
      )}
      {currentScreen === 'dashboard' && (
        <CustomerDashboard onLogout={() => setCurrentScreen('landing')} />
      )}
    </>
  );
}

export default App;
