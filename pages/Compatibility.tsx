import React from 'react';
import { Coins, ArrowUpRight, ArrowDownLeft, History, CreditCard, ShieldCheck, Lock, Wallet as WalletIcon, Star, Award } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const Wallet: React.FC = () => {
  const { user, transactions, addFunds, withdrawFunds } = useApp();

  if (!user) return null;

  const isModel = user.role === 'model';

  const handleWithdrawClick = () => {
    if (!isModel) return;
    if (!user.pixKey) {
        alert("Você precisa cadastrar uma chave PIX no seu Perfil antes de sacar.");
        return;
    }
    const amount = 100; // Example amount
    if (confirm(`Deseja sacar ${amount} CRX para a chave PIX: ${user.pixKey}?`)) {
        withdrawFunds(amount);
        alert("Solicitação de saque enviada com sucesso!");
    }
  };

  const handleBuyClick = () => {
      const amount = 500;
      let bonusText = '';
      if(user.tier === 'vip') bonusText = ' (+5% Bônus VIP)';
      if(user.tier === 'premium') bonusText = ' (+10% Bônus Premium)';

      if(confirm(`Comprar ${amount} Tokens${bonusText} por R$ 50,00 via PIX?`)) {
          addFunds(amount);
          alert("Tokens adicionados com sucesso!");
      }
  };

  return (
    <div className="pt-20 pb-28 max-w-lg mx-auto px-4 bg-rose-950 min-h-screen">
      <header className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-3xl font-serif font-bold text-white">Carteira</h2>
            <p className="text-rose-400 text-xs tracking-wider uppercase">
                {isModel ? 'Painel Financeiro (Modelo)' : 'Saldo de Consumo'}
            </p>
         </div>
         <div className="w-10 h-10 rounded-full bg-rose-900/40 border border-rose-500/20 flex items-center justify-center">
            <WalletIcon className="w-5 h-5 text-gold-500" />
         </div>
      </header>

      {/* Premium Card */}
      <div className="relative h-56 rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 mb-8 border border-white/5 group">
        {/* Card Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isModel ? 'from-gold-900 via-yellow-950 to-black' : 'from-[#1a0307] via-[#2b0510] to-black'}`}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        
        {/* Chip */}
        <div className="absolute top-6 left-6 w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-80 shadow-inner border border-yellow-600/50"></div>
        
        {/* Contactless Icon */}
        <div className="absolute top-6 right-6 opacity-50">
           <div className="border-r-2 border-white/50 h-6 w-6 rounded-full transform -rotate-45"></div>
        </div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
          <div className="mb-4">
             <span className={`text-xs font-medium uppercase tracking-widest ${isModel ? 'text-gold-200' : 'text-rose-400/80'}`}>
                {isModel ? 'Saldo Sacável' : 'Saldo Disponível'}
             </span>
             <div className="flex items-baseline space-x-2 mt-1">
                <h1 className="text-4xl font-mono font-bold text-white drop-shadow-md tracking-wider">
                    {user.crisexBalance.toLocaleString()}
                </h1>
                <span className="text-gold-500 font-bold text-sm">CRX</span>
             </div>
          </div>

          <div className="flex justify-between items-end border-t border-white/10 pt-4">
             <div>
                <p className={`text-[9px] uppercase font-bold tracking-[0.2em] mb-0.5 ${isModel ? 'text-gold-500/50' : 'text-rose-500/50'}`}>Titular</p>
                <p className="text-white font-medium font-mono uppercase text-sm">{user.name}</p>
             </div>
             <div className="flex flex-col items-end">
                <p className="text-white/50 text-[10px] font-mono mb-1 flex items-center gap-1">
                    {user.tier === 'vip' && <span className="text-gold-400">VIP</span>}
                    {user.tier === 'premium' && <span className="text-purple-400">PREMIUM</span>}
                    {user.tier === 'standard' && (isModel ? 'CRIADOR' : 'MEMBRO')}
                </p>
                <div className="flex space-x-1">
                  <div className={`w-6 h-4 rounded-sm ${isModel ? 'bg-gold-500/50' : 'bg-rose-500/50'}`}></div>
                  <div className="w-6 h-4 bg-white/20 rounded-sm -ml-3 mix-blend-screen"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Active Bonus Notification */}
      {user.tier !== 'standard' && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-900 to-black border border-white/10 flex items-center gap-3">
              {user.tier === 'vip' ? <Star className="text-gold-500 w-5 h-5" /> : <Award className="text-purple-500 w-5 h-5" />}
              <div>
                  <h4 className="text-white text-sm font-bold">Bônus {user.tier.toUpperCase()} Ativo</h4>
                  <p className="text-xs text-gray-400">Você ganha +{user.tier === 'vip' ? '5%' : '10%'} tokens em todas as recargas.</p>
              </div>
          </div>
      )}

      {/* Actions based on Role */}
      {isModel ? (
          /* MODEL ACTIONS */
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Button variant="gold" onClick={handleWithdrawClick} className="h-14 w-full shadow-gold-500/20">
               <ArrowUpRight className="w-5 h-5 mr-1" /> Sacar via PIX
            </Button>
            {!user.pixKey && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-3">
                    <Lock className="w-5 h-5 text-red-500" />
                    <p className="text-xs text-red-300">
                        Chave PIX não cadastrada. Vá ao seu <span className="font-bold underline cursor-pointer" onClick={() => alert("Vá para o Perfil > Clique na Foto")}>Perfil</span> para configurar.
                    </p>
                </div>
            )}
            <p className="text-center text-[10px] text-gray-500">
                Saques processados em até 24h úteis. Taxa de saque: 2%.
            </p>
          </div>
      ) : (
          /* USER ACTIONS */
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Button variant="primary" onClick={handleBuyClick} className="h-14 w-full shadow-rose-500/20">
               <CreditCard className="w-5 h-5 mr-1" /> Recarregar Tokens (PIX)
            </Button>
          </div>
      )}

      {/* History Section */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-900/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-serif font-bold text-lg">Extrato Recente</h3>
          <button className="text-rose-500 text-xs font-bold uppercase tracking-wider hover:text-white transition">Completo</button>
        </div>
        
        <div className="space-y-4">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  tx.type === 'earn' || tx.type === 'purchase' ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' : 
                  tx.type === 'spend' || tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20' : 'bg-gold-500/10 text-gold-500 group-hover:bg-gold-500/20'
                }`}>
                  {(tx.type === 'earn' || tx.type === 'purchase') ? <ArrowDownLeft className="w-6 h-6" /> : 
                   (tx.type === 'spend' || tx.type === 'withdrawal') ? <ArrowUpRight className="w-6 h-6" /> : <Coins className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{tx.description}</p>
                  <p className="text-rose-500/50 text-xs mt-0.5">{tx.date}</p>
                </div>
              </div>
              <span className={`font-mono font-bold text-sm ${
                tx.type === 'earn' || tx.type === 'purchase' ? 'text-green-400' : 'text-rose-100'
              }`}>
                {tx.type === 'earn' || tx.type === 'purchase' ? '+' : '-'}{tx.amount}
              </span>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8">
               <History className="w-12 h-12 text-rose-900/50 mx-auto mb-2" />
               <p className="text-rose-500/30 text-sm">Nenhuma movimentação.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;