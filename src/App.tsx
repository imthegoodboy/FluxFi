import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { FeaturesPage } from './components/FeaturesPage';
import { HelpPage } from './components/HelpPage';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('home');

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        const { data } = await supabase
          .from('users')
          .select('wallet_address')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setWalletAddress(data.wallet_address);
        }
      };
      loadUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (user && walletAddress) {
    return <Dashboard walletAddress={walletAddress} />;
  }

  if (currentPage === 'features') {
    return <FeaturesPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'help') {
    return <HelpPage onNavigate={setCurrentPage} />;
  }

  return <LandingPage onConnect={setWalletAddress} onNavigate={setCurrentPage} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
