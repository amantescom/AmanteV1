import React from 'react';
import { Home, Play, MessageCircle, User, Wallet } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  unreadCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, unreadCount = 0 }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Feed' },
    { id: 'media', icon: Play, label: 'Mídia' },
    { id: 'wallet', icon: Wallet, label: 'Carteira' },
    { id: 'messages', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 w-full z-50 pb-safe">
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950 via-rose-950/95 to-transparent h-24 -z-10 pointer-events-none" />
        
        <div className="glass-panel mx-4 mb-4 rounded-2xl h-16 max-w-lg md:mx-auto flex justify-around items-center border border-rose-500/10 shadow-2xl shadow-black/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                  isActive ? 'text-rose-500 scale-110' : 'text-rose-400/50 hover:text-rose-300'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
                )}
                
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.id === 'messages' && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg shadow-gold-500/50">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;