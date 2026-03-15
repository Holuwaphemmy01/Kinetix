import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login'>('landing');

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage onLoginClick={() => setCurrentScreen('login')} />
      )}
      {currentScreen === 'login' && (
        <LoginPage onBack={() => setCurrentScreen('landing')} />
      )}
    </>
  );
}

export default App;
