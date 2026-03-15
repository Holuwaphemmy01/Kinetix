import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CustomerOnboarding from './pages/CustomerOnboarding';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'onboarding'>('landing');

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage 
          onLoginClick={() => setCurrentScreen('login')} 
          onOnboardingClick={() => setCurrentScreen('onboarding')}
        />
      )}
      {currentScreen === 'login' && (
        <LoginPage 
          onBack={() => setCurrentScreen('landing')} 
          onSignUpClick={() => setCurrentScreen('onboarding')}
        />
      )}
      {currentScreen === 'onboarding' && (
        <CustomerOnboarding onClose={() => setCurrentScreen('landing')} />
      )}
    </>
  );
}

export default App;
