import React, { useState } from 'react';
import { Grid, Play, ShoppingBag, Edit3, Heart, MessageSquare, Sparkles, LogOut, Wallet, X, Camera, Lock, ShieldCheck, Star, Award, Zap, Image as ImageIcon, Users } from 'lucide-react';
import Button from '../components/Button';
import { generateBio } from '../services/ai';
import { useApp } from '../context/AppContext';
import { UserTier } from '../types';
import Affiliates from './Affiliates';

const Profile: React.FC = () => {
  const { user, logout, updateUser, spendTokens, upgradeTier } = useApp();
  const [activeTab, setActiveTab] = useState<'photos' | 'reels' | 'shop'>('photos');
  const [showSettings, setShowSettings] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showAffiliates, setShowAffiliates] = useState(false);
  
  // Settings State
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editCover, setEditCover] = useState(user?.coverImage || '');
  const [editPixKey, setEditPixKey] = useState(user?.pixKey || '');

  if (!user) return null;

  if (showAffiliates) {
    return <Affiliates onBack={() => setShowAffiliates(false)} />;
  }

  const handleGenerateBio = async () => {
    const newBio = await generateBio(user.name, user.role === 'model' ? 'Modelo misteriosa e elegante' : 'Fã apaixonado');
    alert("Bio Gerada: " + newBio);
  };

  const handleSaveSettings = () => {
    updateUser({
        avatar: editAvatar,
        coverImage: editCover,
        pixKey: editPixKey
    });
    setShowSettings(false);
  };

  const handleBuyPack = (packId: number, cost: number) => {
    if(confirm(`Comprar Pack #${packId} por ${cost} CRX?`)) {
      if(spendTokens(cost, `Compra: Pack Exclusivo #${packId}`)) {
        alert("Compra realizada com sucesso! Conteúdo desbloqueado.");
      } else {
        alert("Saldo insuficiente.");
      }
    }
  };

  const handleBecomeModel = () => {
      const COST = 100;
      
      if (user.crisexBalance < COST) {
          alert(`Saldo insuficiente! Você precisa de ${COST} CRX para ativar a conta de Modelo.`);
          return;
      }

      if (confirm(`Tem certeza? Isso transformará sua conta em um Perfil de Criador (Modelo) por ${COST} CRX.`)) {
          if(spendTokens(COST, "Taxa de Adesão: Conta de Modelo")) {
              updateUser({
                  role: 'model',
                  category: user.preference || 'Mulher', // Default category
                  stats: { photosCount: 0, reelsCount: 0, livesCount: 0, salesCount: 0 }
              });
              alert("Bem-vindo(a) ao time de criadores! Configure seu perfil, cadastre sua chave PIX e comece a faturar.");
              setShowLevels(false);
          }
      }
  };

  const isModel = user.role === 'model';

  // Badge Logic Helpers
  const TierBadge = ({ tier }: { tier: UserTier }) => {
    if (tier === 'vip') return <span className="bg-gradient-to-r from-gold-300 to-gold-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded border border-gold-600 flex items-center gap-1"><Star className="w-2 h-2 fill-black" /> VIP</span>;
    if (tier === 'premium') return <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-400 flex items-center gap-1"><Award className="w-2 h-2" /> PREMIUM</span>;
    return null;
  };

  const renderBadgeIcon = (badge: string) => {
      if (badge === 'verified') return <ShieldCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />;
      if (badge === 'influencer') return <Zap className="w-4 h-4 text-pink-500 fill-pink-500/20" />;
      return null;
  };

  return (
    <div className="pt-8 pb-24 max-w-lg mx-auto bg-rose-950 min-h-screen relative">
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a0307] w-full max-w-sm rounded-3xl border border-rose-500/20 p-6 shadow-2xl relative overflow-y-auto max-h-[90vh] no-scrollbar">
                <button 
                    onClick={() => setShowSettings(false)}
                    className="absolute top-4 right-4 text-rose-500 hover:text-rose-300"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-serif text-white mb-6 text-center">Editar Perfil</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-rose-300 uppercase font-bold tracking-wider mb-2 block">Foto de Perfil (URL)</label>
                        <div className="flex items-center space-x-3">
                            <img src={editAvatar} alt="Preview" className="w-12 h-12 rounded-full border border-rose-500/30 object-cover" />
                            <input 
                                type="text" 
                                value={editAvatar}
                                onChange={(e) => setEditAvatar(e.target.value)}
                                className="flex-1 bg-rose-900/20 border border-rose-800 rounded-xl p-3 text-white text-sm focus:border-rose-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-rose-300 uppercase font-bold tracking-wider mb-2 block">Capa do Perfil (URL)</label>
                        <div className="flex flex-col space-y-2">
                             {editCover && <img src={editCover} alt="Cover Preview" className="w-full h-20 object-cover rounded-lg border border-rose-500/20" />}
                            <input 
                                type="text" 
                                value={editCover}
                                onChange={(e) => setEditCover(e.target.value)}
                                className="w-full bg-rose-900/20 border border-rose-800 rounded-xl p-3 text-white text-sm focus:border-rose-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {isModel && (
                        <div className="bg-gold-500/5 p-4 rounded-xl border border-gold-500/20">
                            <label className="text-xs text-gold-400 uppercase font-bold tracking-wider mb-2 block flex items-center gap-2">
                                <Lock className="w-3 h-3" /> Chave PIX (Para Saques)
                            </label>
                            <input 
                                type="text" 
                                value={editPixKey}
                                onChange={(e) => setEditPixKey(e.target.value)}
                                className="w-full bg-black/40 border border-gold-500/30 rounded-xl p-3 text-white text-sm focus:border-gold-500 outline-none"
                                placeholder="CPF, Email ou Telefone"
                            />
                            <p className="text-[10px] text-gray-400 mt-2">
                                Esta chave será usada para transferir seus ganhos. Verifique com atenção.
                            </p>
                        </div>
                    )}

                    <Button onClick={handleSaveSettings} className="w-full mt-4">
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Levels & Badges Modal */}
      {showLevels && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
              <div className="bg-[#1a0307] w-full max-w-sm rounded-3xl border border-gold-500/30 p-6 shadow-2xl relative overflow-hidden overflow-y-auto max-h-[90vh] no-scrollbar">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                  <button onClick={() => setShowLevels(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-5 h-5"/></button>

                  <div className="text-center mb-6">
                      <h3 className="text-2xl font-serif text-white font-bold">Níveis Amantes</h3>
                      <p className="text-gold-400/80 text-xs uppercase tracking-widest mt-1">Evolua e ganhe benefícios</p>
                  </div>

                  <div className="space-y-4 mb-6">
                      <div className={`p-4 rounded-xl border ${user.tier === 'vip' ? 'bg-gold-500/20 border-gold-500' : 'bg-white/5 border-white/10'}`}>
                          <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-gold-400 flex items-center gap-2"><Star className="w-4 h-4 fill-current"/> VIP Mensal</h4>
                              {user.tier === 'vip' && <span className="text-[10px] bg-gold-500 text-black px-2 rounded-full font-bold">ATUAL</span>}
                          </div>
                          <p className="text-xs text-gray-400 mb-3">Bônus de 5% em recargas e destaque no feed.</p>
                          {user.tier !== 'vip' && user.tier !== 'premium' && (
                              <button onClick={() => upgradeTier('vip')} className="w-full py-2 bg-gold-600/20 border border-gold-500/50 rounded text-gold-400 text-xs font-bold hover:bg-gold-500 hover:text-black transition">
                                  Virar VIP
                              </button>
                          )}
                      </div>

                      <div className={`p-4 rounded-xl border ${user.tier === 'premium' ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10'}`}>
                          <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-purple-400 flex items-center gap-2"><Award className="w-4 h-4 fill-current"/> Premium Anual</h4>
                              {user.tier === 'premium' && <span className="text-[10px] bg-purple-500 text-white px-2 rounded-full font-bold">ATUAL</span>}
                          </div>
                          <p className="text-xs text-gray-400 mb-3">Bônus de 10% em recargas, taxas reduzidas e acesso exclusivo.</p>
                          {user.tier !== 'premium' && (
                              <button onClick={() => upgradeTier('premium')} className="w-full py-2 bg-purple-600/20 border border-purple-500/50 rounded text-purple-400 text-xs font-bold hover:bg-purple-500 hover:text-white transition">
                                  Virar Premium
                              </button>
                          )}
                      </div>

                      {/* User to Model Switch Option */}
                      {!isModel && (
                          <div className="p-4 rounded-xl border bg-gradient-to-br from-rose-900/40 to-black border-rose-500/50 mt-6 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                              <div className="flex justify-between items-center mb-1 relative z-10">
                                  <h4 className="font-bold text-rose-200 flex items-center gap-2">
                                      <Camera className="w-4 h-4 text-rose-500"/> Tornar-se Criador
                                  </h4>
                              </div>
                              <p className="text-xs text-gray-400 mb-3 relative z-10">
                                  Comece a vender conteúdo, fazer lives e faturar com presentes.
                              </p>
                              <button 
                                  onClick={handleBecomeModel}
                                  className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-lg text-xs font-bold transition flex justify-center items-center gap-2 shadow-lg shadow-rose-900/50 relative z-10"
                              >
                                  Ativar Modo Modelo <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] ml-1">100 CRX</span>
                              </button>
                          </div>
                      )}
                  </div>
                  
                  {isModel && (
                      <div className="pt-4 border-t border-white/10">
                          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-pink-500" /> Progresso Influencer
                          </h4>
                          <div className="space-y-3">
                              <div>
                                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                      <span>Fotos (Meta: 50)</span>
                                      <span>{user.stats.photosCount}/50</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-pink-500" style={{ width: `${Math.min((user.stats.photosCount / 50) * 100, 100)}%` }}></div>
                                  </div>
                              </div>
                              <div>
                                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                      <span>Reels (Meta: 20)</span>
                                      <span>{user.stats.reelsCount}/20</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-pink-500" style={{ width: `${Math.min((user.stats.reelsCount / 20) * 100, 100)}%` }}></div>
                                  </div>
                              </div>
                          </div>
                          {!user.badges.includes('influencer') && (
                              <p className="text-[10px] text-gray-500 mt-3 text-center italic">Complete as metas para ganhar o selo Influencer.</p>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Cover Image/Gradient */}
      <div className="h-40 relative mb-12 group/cover">
          {user.coverImage ? (
               <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-rose-900 to-black relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>
          )}
          
          {/* Change Cover Button */}
          <button 
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-14 bg-black/40 p-2 rounded-full text-white/80 backdrop-blur-sm border border-white/10 hover:bg-rose-600 hover:text-white transition"
            title="Alterar Capa"
          >
              <ImageIcon className="w-5 h-5" />
          </button>

          <div className="absolute top-4 right-4 flex space-x-2">
             <Button variant="secondary" onClick={logout} className="px-2 py-2 h-auto rounded-full bg-black/30 border-none text-white hover:bg-black/50">
               <LogOut className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute -bottom-10 left-4">
               <div className="relative group cursor-pointer" onClick={() => setShowSettings(true)}>
                 <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className={`w-24 h-24 rounded-full border-4 border-rose-950 p-0.5 object-cover ${isModel ? 'bg-gradient-to-tr from-gold-400 to-rose-500' : 'bg-rose-800'}`}
                />
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Camera className="w-8 h-8 text-white/80" />
                </div>
                <div className="absolute bottom-0 right-0 bg-rose-950 p-1.5 rounded-full border border-rose-500 text-rose-500 pointer-events-none">
                    <Edit3 className="w-3 h-3" />
                </div>
               </div>
          </div>
      </div>

      {/* Info Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-end mb-4 items-center gap-3">
             <button onClick={() => setShowLevels(true)} className="flex flex-col items-end">
                  <div className="flex gap-1 mb-1">
                      {user.badges.map(b => renderBadgeIcon(b))}
                  </div>
                  <TierBadge tier={user.tier} />
             </button>

             {/* Balance Display */}
             <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${isModel ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' : 'bg-rose-900/30 border-rose-800 text-white'}`}>
                 <Wallet className={`w-4 h-4 ${isModel ? 'text-gold-500' : 'text-rose-500'}`}/> 
                 <div>
                     <p className="text-[10px] uppercase font-bold opacity-70 leading-none mb-0.5">{isModel ? 'Saldo Sacável' : 'Seus Tokens'}</p>
                     <p className="text-sm font-bold">{user.crisexBalance} CRX</p>
                 </div>
             </div>
        </div>

        <div>
          <h2 className="text-white font-serif font-bold text-2xl flex items-center gap-2">
            {user.name} 
            {isModel && <span className="text-[10px] bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded uppercase border border-gold-500/30">Modelo</span>}
          </h2>
          <p className="text-rose-200/80 text-sm mb-4 font-light leading-relaxed max-w-[90%] mt-2">
             {/* Static bio for now, or generated via AI */}
             {isModel ? "Vivendo momentos inesquecíveis. Assine meu pack VIP. ✨" : "Apaixonado por conteúdos exclusivos."}
          </p>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    className="flex-1 py-2 text-xs font-bold uppercase tracking-wider h-10 border-rose-500/30 hover:bg-rose-500/10"
                    onClick={handleGenerateBio}
                >
                <Sparkles className="w-3 h-3 mr-1 text-gold-500" /> Bio IA
                </Button>
                {isModel ? (
                    <Button variant="primary" className="flex-1 py-2 text-xs font-bold uppercase tracking-wider h-10">
                    Novo Post
                    </Button>
                ) : (
                    <Button onClick={() => setShowLevels(true)} variant="gold" className="flex-1 py-2 text-xs font-bold uppercase tracking-wider h-10">
                        Evoluir Nível
                    </Button>
                )}
            </div>
            
            {/* Affiliates Button */}
            <button 
                onClick={() => setShowAffiliates(true)}
                className="w-full py-2 bg-gradient-to-r from-gray-900 to-black border border-rose-800/50 rounded-xl text-xs font-bold uppercase tracking-wider text-gold-400 hover:border-gold-500/50 hover:text-white transition flex items-center justify-center gap-2"
            >
                <Users className="w-4 h-4" /> Programa de Afiliados
            </button>
          </div>
        </div>
      </div>

      {isModel && (
      <>
        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-8">
            <div className="bg-gradient-to-br from-rose-900/40 to-black/40 p-3 rounded-xl border border-rose-500/10 text-center">
                <Heart className="w-5 h-5 mx-auto text-rose-500 mb-1" />
                <p className="text-white font-bold text-sm">54K</p>
            </div>
            <div className="bg-gradient-to-br from-rose-900/40 to-black/40 p-3 rounded-xl border border-rose-500/10 text-center">
                <MessageSquare className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <p className="text-white font-bold text-sm">1.2K</p>
            </div>
            <div className="bg-gradient-to-br from-rose-900/40 to-black/40 p-3 rounded-xl border border-rose-500/10 text-center">
                <ShoppingBag className="w-5 h-5 mx-auto text-gold-500 mb-1" />
                <p className="text-white font-bold text-sm">85</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-rose-800/30 mb-1 sticky top-0 bg-rose-950/95 backdrop-blur z-30">
            <button 
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-4 flex justify-center transition-all ${activeTab === 'photos' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-rose-600/50 hover:text-rose-400'}`}
            >
            <Grid className="w-5 h-5" />
            </button>
            <button 
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-4 flex justify-center transition-all ${activeTab === 'reels' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-rose-600/50 hover:text-rose-400'}`}
            >
            <Play className="w-5 h-5" />
            </button>
            <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-4 flex justify-center transition-all ${activeTab === 'shop' ? 'border-b-2 border-rose-500 text-rose-500' : 'text-rose-600/50 hover:text-rose-400'}`}
            >
            <ShoppingBag className="w-5 h-5" />
            </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-0.5 pb-20">
            {activeTab === 'photos' && [1,2,3,4,5,6].map((i) => (
            <div key={i} className="aspect-square bg-rose-900/20 relative group overflow-hidden">
                <img 
                    src={`https://picsum.photos/300/300?random=${i}`} 
                    alt="Post" 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
            </div>
            ))}
            
            {activeTab === 'reels' && (
                <div className="col-span-3 py-20 text-center text-rose-500/30">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="font-serif">Nenhum reel ainda</p>
                </div>
            )}
            
            {activeTab === 'shop' && (
                <div className="col-span-3 p-4 space-y-4">
                    <h3 className="text-white font-serif font-bold text-lg mb-2">Minha Loja</h3>
                    {[1, 2].map((pack) => (
                        <div key={pack} className="bg-gradient-to-r from-rose-900/40 to-black p-4 rounded-xl border border-rose-500/20 flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center text-black shadow-lg">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold font-serif">Pack Exclusivo #{pack}</h4>
                                    <p className="text-rose-400 text-xs mt-1">15 Fotos • 3 Vídeos 4K</p>
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-green-400">
                                        <Sparkles className="w-3 h-3" /> Disponível
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-gold-500 font-bold text-lg">500 CRX</span>
                                <button onClick={() => handleBuyPack(pack, 500)} className="mt-1 text-xs text-rose-300 underline hover:text-white">Editar</button>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-rose-500/40">
                        + Criar Novo Pack
                    </Button>
                </div>
            )}
        </div>
      </>
      )}

      {!isModel && (
        <div className="px-6 space-y-4 mt-8">
             <div className="p-6 bg-rose-900/20 border border-rose-800 rounded-2xl text-center">
                 <h3 className="text-rose-200 font-serif text-lg mb-2">Área do Fã</h3>
                 <p className="text-sm text-rose-400/80 mb-4">Acompanhe seus modelos favoritos e gerencie seus tokens.</p>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black/30 p-3 rounded-xl">
                         <p className="text-xs text-rose-500 uppercase font-bold">Favoritos</p>
                         <p className="text-xl font-bold text-white">12</p>
                     </div>
                     <div className="bg-black/30 p-3 rounded-xl">
                         <p className="text-xs text-rose-500 uppercase font-bold">Compras</p>
                         <p className="text-xl font-bold text-white">4</p>
                     </div>
                 </div>
             </div>
             
             {/* Shop View for Users */}
             <div className="mt-8">
                 <h3 className="text-white font-serif font-bold text-lg mb-4">Packs Sugeridos</h3>
                 {[1, 2].map((pack) => (
                    <div key={pack} className="bg-gradient-to-r from-rose-900/40 to-black p-4 rounded-xl border border-rose-500/20 flex items-center justify-between shadow-lg mb-3">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-rose-800 rounded-lg flex items-center justify-center text-white shadow-lg">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold font-serif">Pack Surpresa #{pack}</h4>
                                <p className="text-rose-400 text-xs mt-1">Isabella Rose</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Button variant="gold" className="py-2 px-4 text-xs h-8" onClick={() => handleBuyPack(pack, 200)}>
                                200 CRX
                            </Button>
                        </div>
                    </div>
                 ))}
             </div>
        </div>
      )}
    </div>
  );
};

export default Profile;