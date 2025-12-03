export type Category = 'Homem' | 'Mulher' | 'Casal' | 'Gay' | 'Trans';
export type UserRole = 'user' | 'model' | 'admin';
export type UserTier = 'standard' | 'vip' | 'premium';

export const FEE_RATES = {
  deposit: 0.10, // 10%
  withdrawal: 0.10, // 10%
  exchangeRate: 0.10, // 1 CRX = R$ 0.10
};

export interface UserStats {
  photosCount: number;
  reelsCount: number;
  livesCount: number;
  salesCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  badges: string[]; // 'verified', 'influencer'
  category?: Category; // For models
  preference?: Category; // For users
  avatar: string;
  coverImage?: string; // Custom header image
  crisexBalance: number; 
  isVerified: boolean; // Maps to 'verified' badge
  ageVerified: boolean;
  pixKey?: string;
  stats: UserStats;
  
  // Affiliate System
  affiliateCode?: string;
  referredBy?: string;
  affiliateStats?: {
    earnings: number;
    referrals: number;
  };
}

export interface Post {
  id: string;
  modelId: string;
  modelName: string;
  modelAvatar: string;
  modelTier?: UserTier; // Denormalized for feed display
  modelBadges?: string[]; // Denormalized
  category: Category;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  type: 'photo' | 'reel';
  isLocked?: boolean; 
  price?: number;
}

export interface LiveStream {
  id: string;
  modelId: string;
  modelName: string;
  modelAvatar: string;
  category: Category;
  viewers: number;
  title: string;
  thumbnail: string;
  isPrivate: boolean;
  costPerMinute: number;
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'dm' | 'comment' | 'live_interaction';
  unread: boolean;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'purchase' | 'withdrawal' | 'revenue';
  amount: number;
  description: string;
  date: string;
}

export interface AdminStats {
  totalUsers: number;
  totalModels: number;
  activeLives: number;
  platformRevenue: number;
  pendingApprovals: number;
}