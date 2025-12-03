import React, { useState } from 'react';
import { Users, Video, ShieldAlert, DollarSign, BarChart3, Lock, CheckCircle, Ban } from 'lucide-react';
import { AdminStats, User } from '../types';

const MOCK_STATS: AdminStats = {
  totalUsers: 14502,
  totalModels: 320,
  activeLives: 12,
  platformRevenue: 45000,
  pendingApprovals: 5
};

const MOCK_PENDING_MODELS = [
  { id: '1', name: 'Nova Modelo 1', email: 'modelo1@teste.com', status: 'pending' },
  { id: '2', name: 'Novo Modelo 2', email: 'modelo2@teste.com', status: 'pending' },
];

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'finance' | 'content'>('dashboard');

  return (
    <div className="pt-20 pb-24 max-w-4xl mx-auto px-4 min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-white mb-6">Painel de Controle</h1>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto mb-8 pb-2">
        {[
            { id: 'dashboard', icon: BarChart3, label: 'Painel' },
            { id: 'users', icon: Users, label: 'Usuários' },
            { id: 'finance', icon: DollarSign, label: 'Finanças' },
            { id: 'content', icon: ShieldAlert, label: 'Moderação' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all ${
                    activeTab === tab.id 
                    ? 'bg-rose-600 border-rose-500 text-white' 
                    : 'bg-rose-950/40 border-rose-800/30 text-rose-400 hover:bg-rose-900/60'
                }`}
            >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
            </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
           {/* KPI Cards */}
           <div className="bg-rose-900/20 border border-rose-800/50 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-rose-400 text-xs font-bold uppercase tracking-wider">Receita Total (30%)</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{MOCK_STATS.platformRevenue.toLocaleString()} CRX</h3>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div className="w-full bg-rose-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[70%]"></div>
              </div>
           </div>

           <div className="bg-rose-900/20 border border-rose-800/50 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-rose-400 text-xs font-bold uppercase tracking-wider">Usuários Ativos</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{MOCK_STATS.totalUsers.toLocaleString()}</h3>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
              </div>
           </div>

           <div className="bg-rose-900/20 border border-rose-800/50 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <p className="text-rose-400 text-xs font-bold uppercase tracking-wider">Ao Vivo Agora</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{MOCK_STATS.activeLives}</h3>
                  </div>
                  <Video className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
           </div>
        </div>
      )}

      {activeTab === 'users' && (
          <div className="bg-rose-900/20 border border-rose-800/50 rounded-2xl overflow-hidden animate-in fade-in">
              <div className="p-6 border-b border-rose-800/50">
                  <h3 className="text-white font-bold text-lg">Modelos Pendentes</h3>
              </div>
              <div className="divide-y divide-rose-800/30">
                  {MOCK_PENDING_MODELS.map(model => (
                      <div key={model.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                              <div>
                                  <p className="text-white font-medium">{model.name}</p>
                                  <p className="text-rose-400 text-xs">{model.email}</p>
                              </div>
                          </div>
                          <div className="flex space-x-2">
                              <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                                  <CheckCircle className="w-5 h-5" />
                              </button>
                              <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                                  <Ban className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'finance' && (
          <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-r from-gold-900/20 to-black border border-gold-500/30 p-6 rounded-2xl">
                  <h3 className="text-gold-400 font-bold mb-4">Configuração de Tokens</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Custo Live (CRX/min)</label>
                          <input type="number" value={100} className="bg-black/40 border border-gray-700 rounded p-2 text-white w-full" readOnly />
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Taxa Plataforma (%)</label>
                          <input type="number" value={30} className="bg-black/40 border border-gray-700 rounded p-2 text-white w-full" readOnly />
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'content' && (
          <div className="text-center py-20 text-gray-500">
              <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhum conteúdo sinalizado para revisão.</p>
          </div>
      )}
    </div>
  );
};

export default AdminPanel;