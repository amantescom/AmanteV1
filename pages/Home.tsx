import React, { useState } from 'react';
import { Heart, MessageCircle, X, Sparkles, Share2, ShieldCheck, Zap, Star, TrendingUp, Clock, MessageSquare, Filter } from 'lucide-react';
import { generateWittyComment } from '../services/ai';
import CategoryFilter from '../components/CategoryFilter';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { posts, selectedCategory, setCategory, interactWithPost, likedPosts, user } = useApp();
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'discussed'>('recent');

  // Filter posts based on selection
  const filteredPosts = selectedCategory === 'Todos' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  // Sort posts logic
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'discussed') return b.comments - a.comments;
    // Default 'recent' uses ID desc assuming higher ID is newer for mock data
    return parseInt(b.id) - parseInt(a.id);
  });

  const handleLike = (id: string) => {
    interactWithPost(id, 'like');
  };

  const handleComment = (id: string) => {
    if (!commentText[id]) return;
    interactWithPost(id, 'comment');
    setCommentText({ ...commentText, [id]: '' });
  };

  const generateAIComment = async (postId: string, caption: string) => {
    setCommentText({ ...commentText, [postId]: '...' });
    const comment = await generateWittyComment(caption);
    setCommentText({ ...commentText, [postId]: comment });
  };

  return (
    <div className="pb-24 max-w-lg mx-auto bg-gradient-to-b from-rose-950 to-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-rose-950/95 backdrop-blur-xl border-b border-rose-900/50 pt-4 pb-2 px-4 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
             AMANTES
           </h1>
        </div>
        {user?.role === 'user' && (
          <div className="bg-rose-900/30 px-3 py-1 rounded-full border border-rose-800/30 flex items-center gap-2">
            <span className="text-[10px] text-rose-300 font-bold uppercase">Modo Ganho</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </header>

      <CategoryFilter selected={selectedCategory} onSelect={setCategory} />

      {/* Sort Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-rose-900/20 bg-black/20">
        <div className="flex items-center gap-1 text-rose-500/50">
            <Filter className="w-3 h-3" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Ordenar</span>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => setSortBy('recent')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${sortBy === 'recent' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' : 'text-rose-400 hover:text-white bg-rose-900/10'}`}
            >
                <Clock className="w-3 h-3" /> Recentes
            </button>
            <button 
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${sortBy === 'popular' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-rose-400 hover:text-white bg-rose-900/10'}`}
            >
                <TrendingUp className="w-3 h-3" /> Em Alta
            </button>
            <button 
                onClick={() => setSortBy('discussed')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${sortBy === 'discussed' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-rose-400 hover:text-white bg-rose-900/10'}`}
            >
                <MessageSquare className="w-3 h-3" /> Debates
            </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-8 pt-4 px-0 md:px-4">
        {sortedPosts.map((post) => {
          const isLiked = likedPosts.has(post.id);
          
          return (
            <div key={post.id} className="relative bg-[#0f0204] md:rounded-3xl border-y md:border border-rose-900/30 shadow-2xl overflow-hidden group">
              
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-rose-950/50 to-transparent">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={post.modelAvatar} alt={post.modelName} className="w-10 h-10 rounded-full border border-rose-500/50 p-[2px]" />
                    <div className="absolute inset-0 rounded-full border border-rose-500 opacity-50 blur-[2px]"></div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-rose-50 text-base leading-none flex items-center gap-1">
                        {post.modelName}
                        {post.modelBadges?.includes('verified') && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                        {post.modelBadges?.includes('influencer') && <Zap className="w-3 h-3 text-pink-500" />}
                    </h3>
                    <span className="text-[10px] text-rose-400/70 tracking-wide uppercase bg-rose-900/30 px-1 rounded flex items-center gap-1 w-fit mt-0.5">
                        {post.category} 
                        {post.modelTier === 'vip' && <span className="text-gold-400 flex items-center"><Star className="w-2 h-2 fill-current"/> VIP</span>}
                        {post.modelTier === 'premium' && <span className="text-purple-400 flex items-center">✦ PREMIUM</span>}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-rose-900/30 rounded-full transition">
                  <X className="w-5 h-5 text-rose-600/50 hover:text-rose-500" />
                </button>
              </div>

              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-rose-950/50">
                <img 
                  src={post.image} 
                  alt={post.caption} 
                  className="w-full h-full object-cover opacity-90 transition duration-700 group-hover:opacity-100 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />

                {/* Earning Hints */}
                {!isLiked && user?.role === 'user' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-500">
                      <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-gold-500/30">
                          <p className="text-gold-400 text-xs font-bold">+1 CRX ao Curtir</p>
                      </div>
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute bottom-0 right-0 p-4 flex flex-col items-end space-y-4">
                  
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl border border-white/10 group/btn ${isLiked ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(255,15,79,0.5)]' : 'bg-black/40 text-white hover:bg-rose-600'}`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current animate-pulse' : 'group-hover/btn:scale-110'}`} />
                  </button>
                  
                  <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-900/60 transition shadow-xl border border-white/10">
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-rose-900/60 transition shadow-xl border border-white/10">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="px-5 pb-6 pt-2 bg-gradient-to-b from-black to-[#0f0204]">
                <div className="flex items-center mb-2 space-x-4">
                  <span className="text-sm font-medium text-rose-200">{post.likes.toLocaleString()} curtidas</span>
                  <span className="text-sm font-medium text-rose-400/60">{post.comments} comentários</span>
                </div>
                
                <p className="text-sm text-rose-100/90 leading-relaxed mb-4 font-light">
                  <span className="font-bold text-white font-serif mr-2 text-base">{post.modelName}</span>
                  {post.caption}
                </p>

                {/* Input Area */}
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-md opacity-0 group-focus-within/input:opacity-100 transition duration-500"></div>
                  <div className="relative flex items-center bg-rose-900/20 border border-rose-800/50 rounded-full px-1 py-1 focus-within:border-rose-500/50 focus-within:bg-black/60 transition-colors">
                    <input 
                      type="text" 
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                      placeholder="Ganhe +2 CRX comentando..."
                      className="flex-1 bg-transparent border-none text-sm text-white placeholder-gold-500/50 px-4 py-2 focus:ring-0"
                    />
                    
                    {commentText[post.id] ? (
                      <button 
                        onClick={() => handleComment(post.id)}
                        className="bg-rose-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-rose-500 transition shadow-[0_0_10px_rgba(255,15,79,0.4)]"
                      >
                        ENVIAR
                      </button>
                    ) : (
                      <button 
                        onClick={() => generateAIComment(post.id, post.caption)}
                        className="p-2 text-gold-500 hover:text-gold-300 transition hover:rotate-12"
                      >
                        <Sparkles className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {sortedPosts.length === 0 && (
            <div className="text-center py-20 text-rose-500/40">
                <p>Nenhum post encontrado nesta categoria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;