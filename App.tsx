import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Messages from './pages/MessageWriter';
import MediaHub from './pages/DatePlanner';
import Wallet from './pages/Compatibility';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import AdminPanel from './pages/AdminPanel';
import { ShieldCheck } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';

const MainLayout: React.FC = () => {
  const { user } = useApp();
  const [currentView, setCurrentView] = useState('home');

  // Auto-redirect to admin if role is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  }, [user]);

  if (!user) {
    return <Onboarding />;
  }

  const renderView = () => {
    // If user is admin, they are locked to admin panel or can toggle (logic handled below)
    if (currentView === 'admin') return <AdminPanel />;

    switch (currentView) {
      case 'home':
        return <Home />;
      case 'messages':
        return <Messages />;
      case 'media':
        return <MediaHub />;
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-rose-950 text-rose-50 font-sans selection:bg-rose-500 selection:text-white">
      {/* Admin Toggle for Admin Users only */}
      {user.role === 'admin' && (
        <div className="fixed top-2 right-2 z-[60]">
          <button 
              onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
              className="px-3 py-1 bg-rose-600 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-rose-500 transition"
          >
              <ShieldCheck className="w-3 h-3" /> 
              {currentView === 'admin' ? 'Ver App' : 'Voltar Admin'}
          </button>
        </div>
      )}

      <main className="min-h-screen">
        {renderView()}
      </main>
      
      {/* Show Navbar only for non-admins OR if admin is viewing the app */}
      {currentView !== 'admin' && (
        <Navbar currentView={currentView} setView={setCurrentView} unreadCount={1} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;