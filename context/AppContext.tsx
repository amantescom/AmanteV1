import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Transaction, Category, UserTier } from '../types';

// Initial Mock Data
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    modelId: 'm1',
    modelName: 'Isabella Rose',
    modelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    category: 'Mulher',
    modelTier: 'premium',
    modelBadges: ['verified', 'influencer'],
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    caption: 'Esperando por você... 🌹 #amantes #crisex',
    likes: 1240,
    comments: 85,
    type: 'photo'
  },
  {
    id: '2',
    modelId: 'm2',
    modelName: 'Sophia Gold',
    modelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    category: 'Mulher',
    modelTier: 'vip',
    modelBadges: ['verified'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    caption: 'Posso ser sua distração favorita?',
    likes: 3502,
    comments: 210,
    type: 'photo'
  },
  {
    id: '3',
    modelId: 'm3',
    modelName: 'Elena V',
    modelAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    category: 'Trans',
    modelTier: 'standard',
    modelBadges: [],
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    caption: 'Pensamentos da madrugada 🌙',
    likes: 890,
    comments: 45,
    type: 'photo'
  },
  {
    id: '4',
    modelId: 'm4',
    modelName: 'Lucas & Ana',
    modelAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    category: 'Casal',
    modelTier: 'standard',
    modelBadges: ['verified'],
    image: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00?auto=format&fit=crop&w=800&q=80',
    caption: 'Problema em dobro esta noite 😉',
    likes: 5400,
    comments: 320,
    type: 'photo'
  }
];

interface AppContextType {
  user: User | null;
  posts: Post[];
  transactions: Transaction[];
  selectedCategory: Category | 'Todos';
  setCategory: (cat: Category | 'Todos') => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  interactWithPost: (postId: string, type: 'like' | 'comment') => void;
  spendTokens: (amount: number, description: string) => boolean;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  upgradeTier: (tier: UserTier) => void;
  likedPosts: Set<string>; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_DURATION = 14 * 60 * 60 * 1000; // 14 hours in milliseconds

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('amantes_user');
    const sessionStart = localStorage.getItem('amantes_session_start');
    
    if (savedUser && sessionStart) {
      const now = Date.now();
      const startTime = parseInt(sessionStart, 10);
      
      // Check if session expired
      if (now - startTime > SESSION_DURATION) {
        localStorage.removeItem('amantes_user');
        localStorage.removeItem('amantes_session_start');
        return null;
      }
      return JSON.parse(savedUser);
    }
    return null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('amantes_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('amantes_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('amantes_liked');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  useEffect(() => {
    if (user) {
      // Ensure user has updated structure if loaded from old state
      const updatedUser = {
          ...user,
          affiliateStats: user.affiliateStats || { earnings: 0, referrals: 0 },
          affiliateCode: user.affiliateCode || user.name.toLowerCase().replace(/\s/g, '').substring(0,5) + '123'
      };
      // Only update state if something changed to avoid loop
      if (!user.affiliateCode || !user.affiliateStats) {
          setUser(updatedUser);
      }
      localStorage.setItem('amantes_user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('amantes_user');
      localStorage.removeItem('amantes_session_start');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('amantes_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('amantes_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('amantes_liked', JSON.stringify(Array.from(likedPosts)));
  }, [likedPosts]);

  // Session Check Interval
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionStart = localStorage.getItem('amantes_session_start');
      if (user && sessionStart) {
        if (Date.now() - parseInt(sessionStart, 10) > SESSION_DURATION) {
          logout();
          alert("Sua sessão de 14 horas expirou. Por favor, faça login novamente.");
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  const setCategory = (cat: Category | 'Todos') => setSelectedCategory(cat);

  const login = (newUser: User) => {
    const now = Date.now();
    localStorage.setItem('amantes_session_start', now.toString());
    setUser(newUser);
    setSelectedCategory(newUser.preference || 'Todos');
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    setLikedPosts(new Set());
    localStorage.removeItem('amantes_session_start');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      description,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const interactWithPost = (postId: string, type: 'like' | 'comment') => {
    if (!user) return;
    
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        likes: type === 'like' ? p.likes + 1 : p.likes,
        comments: type === 'comment' ? p.comments + 1 : p.comments
      };
    }));

    if (user.role === 'user') {
      if (type === 'like') {
        if (likedPosts.has(postId)) return; 
        setLikedPosts(prev => new Set(prev).add(postId));
      }

      const reward = type === 'like' ? 1 : 2;
      updateUser({ crisexBalance: user.crisexBalance + reward });
      addTransaction('earn', reward, `Interação: ${type === 'like' ? 'Curtida' : 'Comentário'}`);
    }
  };

  const spendTokens = (amount: number, description: string): boolean => {
    if (!user || user.crisexBalance < amount) return false;
    updateUser({ crisexBalance: user.crisexBalance - amount });
    addTransaction('spend', amount, description);
    return true;
  };

  const addFunds = (amount: number) => {
    if (!user) return;
    
    // Tier Bonus Logic
    let bonus = 0;
    if (user.tier === 'vip') bonus = Math.floor(amount * 0.05); // 5% Bonus
    if (user.tier === 'premium') bonus = Math.floor(amount * 0.10); // 10% Bonus

    const total = amount + bonus;
    
    updateUser({ crisexBalance: user.crisexBalance + total });
    
    addTransaction('purchase', amount, 'Compra de Tokens (PIX)');
    if (bonus > 0) {
      addTransaction('earn', bonus, `Bônus Nível ${user.tier.toUpperCase()}`);
    }
  };

  const withdrawFunds = (amount: number) => {
    if (!user || user.crisexBalance < amount) return;
    updateUser({ crisexBalance: user.crisexBalance - amount });
    addTransaction('withdrawal', amount, 'Saque via PIX');
  };

  const upgradeTier = (tier: UserTier) => {
    if (!user) return;
    updateUser({ tier });
    alert(`Parabéns! Você agora é nível ${tier.toUpperCase()}.`);
  };

  return (
    <AppContext.Provider value={{
      user,
      posts,
      transactions,
      selectedCategory,
      setCategory,
      login,
      logout,
      updateUser,
      interactWithPost,
      spendTokens,
      addFunds,
      withdrawFunds,
      upgradeTier,
      likedPosts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};