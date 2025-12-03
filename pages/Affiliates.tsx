import React, { useState } from 'react';
import { ArrowLeft, Copy, Users, DollarSign, TrendingUp, CheckCircle, Share2, Award } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { FEE_RATES } from '../types';

interface AffiliatesProps {
  onBack: () => void;
}

const MOCK_REFERRALS = [
  { id: 1, name: 'Usuário ****', date: 'Hoje', status: 'Ativo', earnings: 50 },
  { id: 2, name: 'Pedro S.', date: 'Ontem', status: 'Ativo', earnings: 120 },
  { id: 3, name: 'Ana ***', date: '2 dias atrás', status: 'Pendente', earnings: 0 },
];

const Affiliates: React.FC<AffiliatesProps> = ({ onBack }) => {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const commissionRate = user.role === 'model' ? 20 : 10;
  const affiliateLink = `amantes.com/register?ref=${user.affiliateCode || user.id}`;
  const totalEarningsCRX = user.affiliateStats?.earnings || 0;
  const totalEarningsBRL = (totalEarningsCRX * FEE_RATES.exchangeRate).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0102] overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-rose-950/50 backdrop-blur-md border-b border-rose-900/50 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-rose-400 hover:text-white transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-serif font-bold text-white">Programa de Afiliados</h2>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="max-w-lg mx-auto p-6 space-y-8 pb-20">
        
        {/* Intro Banner */}
        <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-4">
                <Users className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">Convide & Lucre</h1>
            <p className="text-rose-200/60 text-sm max-w-xs mx-auto">
                Ganhe <span className="text-gold-400 font-bold">{commissionRate}% de comissão</span> vitalícia sobre todas as recargas dos seus indicados.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-900/20 border border-rose-800/50 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
                    <DollarSign className="w-12 h-12 text-gold-500" />
                </div>
                <p className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Ganhos Totais</p>
                <p className="text-2xl font-bold text-white">{user.affiliateStats?.earnings || 0} <span className="text-sm text-gold-500">CRX</span></p>
                <p className="text-[10px] text-green-400 mt-1">≈ {totalEarningsBRL}</p>
            </div>

            <div className="bg-rose-900/20 border border-rose-800/50 p-4 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
                    <Users className="w-12 h-12 text-blue-500" />
                </div>
                <p className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Indicados</p>
                <p className="text-2xl font-bold text-white">{user.affiliateStats?.referrals || 0}</p>
                <p className="text-[10px] text-rose-400/50 mt-1">Usuários ativos</p>
            </div>
        </div>

        {/* Link Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-2xl border border-gold-500/30 shadow-lg">
            <label className="text-xs text-gold-400 font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                <Share2 className="w-3 h-3" /> Seu Link Exclusivo
            </label>
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 p-2 rounded-xl">
                <input 
                    type="text" 
                    readOnly 
                    value={affiliateLink} 
                    className="bg-transparent flex-1 text-sm text-white px-2 focus:outline-none"
                />
                <button 
                    onClick={handleCopy}
                    className={`p-2 rounded-lg font-bold transition-all text-xs flex items-center gap-1 ${
                        copied ? 'bg-green-500 text-white' : 'bg-gold-500 text-black hover:bg-gold-400'
                    }`}
                >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Copiar'}
                </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-3 text-center">
                Compartilhe no Instagram, WhatsApp e Telegram para maximizar seus ganhos.
            </p>
        </div>

        {/* Tiers Info */}
        <div className="bg-rose-900/10 rounded-xl p-4 border border-rose-800/30">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" /> Níveis de Comissão
            </h3>
            <div className="space-y-2">
                <div className={`flex justify-between items-center p-3 rounded-lg border ${user.role === 'user' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-transparent border-transparent opacity-50'}`}>
                    <span className="text-rose-200 text-sm">Usuário Comum</span>
                    <span className="font-bold text-white">10%</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg border ${user.role === 'model' ? 'bg-gold-500/10 border-gold-500/30' : 'bg-transparent border-transparent opacity-50'}`}>
                    <span className="text-gold-200 text-sm flex items-center gap-1">Modelo / Criador {user.role !== 'model' && <span className="text-[9px] text-rose-500 bg-rose-950 px-1 rounded ml-1">(Você não é)</span>}</span>
                    <span className="font-bold text-gold-400">20%</span>
                </div>
            </div>
            {user.role !== 'model' && (
                <button className="w-full mt-3 text-xs text-rose-400 hover:text-white underline">
                    Torne-se Modelo para ganhar o dobro
                </button>
            )}
        </div>

        {/* Referrals List */}
        <div>
            <h3 className="text-white font-serif font-bold text-lg mb-4">Últimos Indicados</h3>
            <div className="space-y-3">
                {MOCK_REFERRALS.map(ref => (
                    <div key={ref.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-800 to-black flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                {ref.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{ref.name}</p>
                                <p className="text-[10px] text-gray-400">{ref.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-green-400 font-bold text-sm">+{ref.earnings} CRX</span>
                            <span className={`text-[10px] ${ref.status === 'Ativo' ? 'text-blue-400' : 'text-gray-500'}`}>{ref.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Affiliates;