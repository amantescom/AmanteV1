import React, { useState } from 'react';
import { Search, MoreVertical, MessageCircle, Heart, Video } from 'lucide-react';
import { Message } from '../types';

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'Isabella Rose',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Obrigada pelos tokens na live! 😘',
    timestamp: '2m atrás',
    type: 'dm',
    unread: true
  },
  {
    id: 'm2',
    sender: 'Equipe Amantes',
    avatar: '',
    content: 'Você ganhou 2 tokens Crisex pelo seu comentário.',
    timestamp: '1h atrás',
    type: 'comment',
    unread: false
  },
  {
    id: 'm3',
    sender: 'Goddess Ana',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=150&q=80',
    content: 'Respondeu ao seu comentário: "Exatamente!"',
    timestamp: '3h atrás',
    type: 'comment',
    unread: false
  }
];

const Messages: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  return (
    <div className="pt-20 pb-24 max-w-lg mx-auto bg-rose-950 min-h-screen">
      <div className="fixed top-0 w-full z-40 bg-rose-950/80 backdrop-blur-xl border-b border-rose-900/50 max-w-lg">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-white">Mensagens</h2>
          <MoreVertical className="text-rose-400 hover:text-white transition cursor-pointer" />
        </div>
        
        <div className="px-4 pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-rose-500 group-focus-within:text-white transition" />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full bg-rose-900/20 border border-rose-800/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-rose-900/40 transition-all placeholder-rose-700/50"
            />
          </div>
        </div>
        
        <div className="flex px-6 space-x-6 text-sm font-medium">
          <button 
            onClick={() => setFilter('all')}
            className={`pb-3 relative transition ${filter === 'all' ? 'text-white' : 'text-rose-500/50'}`}
          >
            Todas
            {filter === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(255,15,79,0.5)]"></div>}
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`pb-3 relative transition ${filter === 'unread' ? 'text-white' : 'text-rose-500/50'}`}
          >
            Não lidas
            {filter === 'unread' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(255,15,79,0.5)]"></div>}
          </button>
        </div>
      </div>

      <div className="pt-32 px-2 space-y-1">
        {MOCK_MESSAGES.filter(m => filter === 'all' || m.unread).map(msg => (
          <div key={msg.id} className={`group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${msg.unread ? 'bg-rose-900/10 border border-rose-500/10' : 'hover:bg-white/5 border border-transparent'}`}>
            <div className="relative">
              {msg.sender === 'Equipe Amantes' ? (
                 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-800 to-rose-950 border border-rose-700 flex items-center justify-center shadow-lg">
                   <Heart className="w-6 h-6 text-rose-500 fill-current" />
                 </div>
              ) : (
                <div className="relative">
                    <img src={msg.avatar} alt={msg.sender} className="w-14 h-14 rounded-full object-cover border border-rose-500/20 group-hover:border-rose-500/50 transition" />
                    <div className="absolute inset-0 rounded-full bg-rose-500/0 group-hover:bg-rose-500/10 transition"></div>
                </div>
              )}
              
              {msg.type === 'live_interaction' && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-1.5 border-2 border-rose-950 shadow-lg">
                  <Video className="w-2.5 h-2.5 text-black" />
                </div>
              )}
              {msg.type === 'comment' && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full p-1.5 border-2 border-rose-950 shadow-lg">
                  <MessageCircle className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className={`text-sm truncate ${msg.unread ? 'font-bold text-white' : 'font-medium text-rose-200'}`}>
                  {msg.sender}
                </h4>
                <span className="text-[10px] text-rose-500/50 uppercase tracking-wide">{msg.timestamp}</span>
              </div>
              <p className={`text-sm truncate ${msg.unread ? 'text-rose-100 font-medium' : 'text-rose-400/60 font-light'}`}>
                {msg.content}
              </p>
            </div>
            
            {msg.unread && (
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(255,15,79,0.8)]"></div>
            )}
          </div>
        ))}
        
        {MOCK_MESSAGES.length === 0 && (
             <div className="text-center py-20 opacity-30">
                 <p>Nenhuma mensagem encontrada.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default Messages;