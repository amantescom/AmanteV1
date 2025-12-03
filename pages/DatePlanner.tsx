import React, { useState } from 'react';
import { Disc, Heart, Coins, Lock, Eye, X } from 'lucide-react';
import { LiveStream } from '../types';
import CategoryFilter from '../components/CategoryFilter';
import { useApp } from '../context/AppContext';

const MOCK_LIVES: LiveStream[] = [
  {
    id: 'l1',
    modelId: 'm1',
    modelName: 'Bella Hot',
    modelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Mulher',
    viewers: 12503,
    title: 'Yoga da Manhã + Papo 🧘‍♀️',
    thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    isPrivate: false,
    costPerMinute: 0
  },
  {
    id: 'l2',
    modelId: 'm2',
    modelName: 'Goddess Ana',
    modelAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=150&q=80',
    category: 'Mulher',
    viewers: 450,
    title: 'Show VIP Exclusivo 💋',
    thumbnail: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?auto=format&fit=crop&w=800&q=80',
    isPrivate: true,
    costPerMinute: 100
  },
  {
    id: 'l3',
    modelId: 'm3',
    modelName: 'Max & Tom',
    modelAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    category: 'Gay',
    viewers: 2200,
    title: 'Treino Pesado 💪',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    isPrivate: false,
    costPerMinute: 0
  }
];

const MediaHub: React.FC = () => {
  const { spendTokens, selectedCategory, setCategory } = useApp();
  const [activeTab, setActiveTab] = useState<'reels' | 'lives'>('lives');
  const [activeLive, setActiveLive] = useState<LiveStream | null>(null);

  const filteredLives = selectedCategory === 'Todos' 
    ? MOCK_LIVES 
    : MOCK_LIVES.filter(l => l.category === selectedCategory);

  const handleEnterLive = (live: LiveStream) => {
    if (live.isPrivate) {
      if (confirm(`Live Privada: 100 CRX/min. (70% vai para o Modelo). Entrar?`)) {
        if (spendTokens(100, `Live Privada: ${live.modelName}`)) {
          setActiveLive(live);
          // Note: In a real app, we would start a timer here to deduct 100 CRX every minute.
        } else {
          alert("Saldo Crisex insuficiente! Compre mais na Carteira.");
        }
      }
    } else {
      setActiveLive(live);
    }
  };

  const handleTip = () => {
     if(!activeLive) return;
     if(spendTokens(50, `Presente para ${activeLive.modelName}`)) {
         alert("Gorjeta de 50 CRX enviada com sucesso!");
     } else {
         alert("Saldo insuficiente!");
     }
  };

  if (activeLive) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
        <div className="relative flex-1 bg-rose-950/20">
          <img src={activeLive.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Live" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pt-safe">
            <div className="flex items-center space-x-3 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
              <div className="relative">
                 <img src={activeLive.modelAvatar} className="w-10 h-10 rounded-full border-2 border-rose-500" alt="Avatar"/>
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
              </div>
              <div>
                <p className="text-white text-sm font-bold">{activeLive.modelName}</p>
                <div className="flex items-center space-x-2">
                    <span className="bg-rose-600 px-1.5 rounded text-[10px] font-bold text-white uppercase">AO VIVO</span>
                    <span className="text-rose-200 text-xs flex items-center gap-1"><Eye className="w-3 h-3" /> {activeLive.viewers.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setActiveLive(null)} className="p-3 bg-black/30 hover:bg-rose-900/50 rounded-full text-white backdrop-blur-md border border-white/5 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black via-black/60 to-transparent">
             <div className="h-64 overflow-y-auto mask-gradient-b space-y-3 mb-6 px-2">
                <p className="text-white/90 text-sm drop-shadow-md"><span className="font-bold text-gold-400 mr-2">User123:</span> Tão linda! 😍</p>
                <div className="flex items-center space-x-2 bg-rose-500/20 p-2 rounded-lg border-l-4 border-rose-500 w-fit">
                    <span className="font-bold text-rose-300 text-xs">Sistema:</span>
                    <span className="text-white text-xs">Bem-vindo. {activeLive.isPrivate && 'Sessão privada custa 100 CRX/min.'}</span>
                </div>
             </div>
             
             {/* Controls */}
             <div className="flex items-center space-x-3">
               <div className="flex-1 relative">
                    <input type="text" placeholder="Diga algo legal..." className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white text-sm placeholder-white/50 focus:outline-none focus:bg-black/50 focus:border-rose-500 transition" />
               </div>
               <button 
                  onClick={handleTip}
                  className="bg-gradient-to-r from-gold-400 to-gold-600 p-3 rounded-full text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-110 transition active:scale-95"
               >
                 <Coins className="w-6 h-6" />
               </button>
               <button className="bg-rose-600/80 p-3 rounded-full text-white backdrop-blur shadow-lg hover:bg-rose-500 transition">
                  <Heart className="w-6 h-6" />
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 bg-rose-950 min-h-screen max-w-lg mx-auto">
      <div className="fixed top-0 w-full z-40 bg-rose-950/80 backdrop-blur-xl border-b border-rose-900/50 max-w-lg">
        <div className="flex justify-center space-x-12 p-4">
          <button 
            onClick={() => setActiveTab('lives')}
            className={`font-serif text-lg font-bold transition-all duration-300 ${activeTab === 'lives' ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-rose-500/40 hover:text-rose-400'}`}
          >
            Ao Vivo
          </button>
          <button 
            onClick={() => setActiveTab('reels')}
            className={`font-serif text-lg font-bold transition-all duration-300 ${activeTab === 'reels' ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-rose-500/40 hover:text-rose-400'}`}
          >
            Reels
          </button>
        </div>
      </div>

      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />

      {activeTab === 'lives' ? (
        <div className="grid grid-cols-2 gap-3 p-3 animate-in slide-in-from-bottom-4 duration-500">
          {filteredLives.map(live => (
            <div key={live.id} onClick={() => handleEnterLive(live)} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-rose-900/40 cursor-pointer group shadow-lg border border-transparent hover:border-rose-500/50 transition-all">
              <img src={live.thumbnail} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90" alt={live.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
              
              <div className="absolute top-3 left-3 bg-rose-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase animate-pulse shadow-lg shadow-rose-900/50">
                Live
              </div>
              
              {live.isPrivate && (
                <div className="absolute top-3 right-3 bg-gold-500/90 p-1.5 rounded-full text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  <Lock className="w-3 h-3" />
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-sm truncate leading-tight mb-1">{live.title}</h3>
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-1.5">
                      <img src={live.modelAvatar} className="w-5 h-5 rounded-full border border-white/50" alt="Model" />
                      <span className="text-[10px] text-rose-200">{live.modelName}</span>
                  </div>
                  <span className="text-[10px] text-gold-400 flex items-center font-medium bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                    <Eye className="w-3 h-3 mr-1" />
                    {live.viewers}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredLives.length === 0 && (
              <div className="col-span-2 text-center py-20 text-rose-500/40">
                  <p>Nenhuma live nesta categoria no momento.</p>
              </div>
          )}
        </div>
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center text-rose-500/30">
          <div className="relative mb-6">
             <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full animate-pulse"></div>
             <Disc className="w-20 h-20 animate-[spin_3s_linear_infinite] relative z-10" />
          </div>
          <p className="font-serif text-xl tracking-widest uppercase">Reels em Breve</p>
        </div>
      )}
    </div>
  );
};

export default MediaHub;