import React, { useState } from 'react';
import { ShieldCheck, Camera, Heart, Lock, ArrowLeft, Mail, Key, LogIn, Chrome, Users } from 'lucide-react';
import Button from '../components/Button';
import { Category, UserRole, User as UserType } from '../types';
import { useApp } from '../context/AppContext';

type AuthMode = 'age_gate' | 'selection' | 'register' | 'login' | 'forgot_password';

const Onboarding: React.FC = () => {
  const { login } = useApp();
  const [mode, setMode] = useState<AuthMode>('age_gate');
  const [role, setRole] = useState<UserRole>('user');
  const [categoryPreference, setCategoryPreference] = useState<Category>('Mulher');
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: '',
  });

  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Dev Backdoor: If name is "Admin", create an admin account
    const finalRole = formData.name.toLowerCase() === 'admin' ? 'admin' : role;
    
    // Generate Affiliate Code
    const affiliateCode = formData.name.toLowerCase().replace(/\s/g, '').substring(0, 5) + Math.floor(Math.random() * 1000);

    const newUser: UserType = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: finalRole,
      tier: 'standard',
      badges: [],
      preference: categoryPreference,
      category: finalRole === 'model' ? categoryPreference : undefined, 
      avatar: finalRole === 'model' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' 
        : 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      crisexBalance: finalRole === 'user' ? 50 : 0, // Bonus for joining
      isVerified: false,
      ageVerified: true,
      stats: {
        photosCount: 0,
        reelsCount: 0,
        livesCount: 0,
        salesCount: 0
      },
      affiliateCode: affiliateCode,
      referredBy: formData.referralCode || undefined,
      affiliateStats: {
        earnings: 0,
        referrals: 0
      }
    };
    
    login(newUser);
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      alert("Informe e-mail e senha.");
      return;
    }
    
    // Simulate Login (In prototype, we accept any credentials but "Admin" triggers admin role)
    const isAdmin = formData.email.toLowerCase().includes('admin');
    
    // Simulate existing user data retrieval
    const existingUser: UserType = {
        id: 'user-existing',
        name: isAdmin ? 'Admin User' : 'Usuário Retornante',
        email: formData.email,
        role: isAdmin ? 'admin' : 'user',
        tier: isAdmin ? 'premium' : 'standard',
        badges: isAdmin ? ['verified'] : [],
        preference: undefined,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        coverImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1200&q=80',
        crisexBalance: isAdmin ? 99999 : 120,
        isVerified: true,
        ageVerified: true,
        stats: { photosCount: 0, reelsCount: 0, livesCount: 0, salesCount: 0 },
        affiliateCode: isAdmin ? 'admin123' : 'user123',
        affiliateStats: {
            earnings: 1500,
            referrals: 12
        }
    };
    
    login(existingUser);
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const googleUser: UserType = {
        id: 'google-user-' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'user',
        tier: 'standard',
        badges: [],
        preference: undefined,
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
        crisexBalance: 50,
        isVerified: true,
        ageVerified: true,
        stats: { photosCount: 0, reelsCount: 0, livesCount: 0, salesCount: 0 },
        affiliateCode: 'goog' + Math.floor(Math.random() * 1000),
        affiliateStats: { earnings: 0, referrals: 0 }
    };
    login(googleUser);
  };

  const handleForgotPassword = () => {
    if(!formData.email) {
        alert("Por favor, digite seu e-mail para recuperar a senha.");
        return;
    }
    alert(`Um link de recuperação foi enviado para ${formData.email}.`);
    setMode('login');
  };

  // ---------------- UI COMPONENTS ---------------- //

  // 1. Age Gate
  if (mode === 'age_gate') {
    return (
      <div className="min-h-screen bg-[#0a0102] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="w-full max-w-md relative z-10 text-center animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 bg-rose-900/40 rounded-full flex items-center justify-center mx-auto border border-rose-500/30 mb-8 shadow-[0_0_30px_rgba(255,15,79,0.3)]">
             <ShieldCheck className="w-12 h-12 text-rose-500" />
           </div>
           <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-rose-200 mb-4">
            AMANTES.COM
          </h1>
          <h2 className="text-xl font-serif text-white mb-4">Verificação de Idade</h2>
          <p className="text-rose-200/60 text-sm mb-8 px-4">
            Esta plataforma contém conteúdo adulto e exclusivo. Ao entrar, você confirma ter pelo menos 18 anos.
          </p>
          <div className="space-y-4">
            <Button onClick={() => setMode('login')} className="w-full shadow-rose-500/20">
              ENTRAR
            </Button>
            <button onClick={() => setMode('selection')} className="text-rose-400 text-sm hover:text-white transition">
               Não tenho conta. <span className="underline">Criar agora.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Selection (Role & Preference) - Only for Registration
  if (mode === 'selection') {
    return (
        <div className="min-h-screen bg-[#0a0102] flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in slide-in-from-right duration-500">
                <button onClick={() => setMode('age_gate')} className="text-rose-500 mb-6 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Voltar</button>
                <h2 className="text-2xl font-serif text-white mb-2">Personalize sua experiência</h2>
                <p className="text-gray-400 text-sm mb-6">Como você deseja usar a plataforma?</p>

                {/* Preference */}
                <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-3">O que você busca?</h3>
                <div className="grid grid-cols-3 gap-2 mb-8">
                    {(['Homem', 'Mulher', 'Casal', 'Gay', 'Trans'] as Category[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategoryPreference(cat)}
                        className={`p-2 rounded-lg text-xs font-bold border transition ${
                            categoryPreference === cat ? 'bg-rose-600 border-rose-500 text-white' : 'bg-rose-900/20 border-rose-800 text-gray-400'
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>

                {/* Role */}
                <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-3">Seu Perfil</h3>
                <div className="space-y-3 mb-8">
                    <button onClick={() => setRole('user')} className={`w-full p-4 rounded-xl border flex items-center justify-between transition ${role === 'user' ? 'bg-rose-900/40 border-rose-500' : 'bg-transparent border-rose-800/50'}`}>
                        <div className="text-left">
                            <span className="text-white font-bold block">Fã / Usuário</span>
                            <span className="text-xs text-gray-400">Assistir e interagir</span>
                        </div>
                        <Heart className={`w-6 h-6 ${role === 'user' ? 'text-rose-500' : 'text-gray-600'}`} />
                    </button>
                    <button onClick={() => setRole('model')} className={`w-full p-4 rounded-xl border flex items-center justify-between transition ${role === 'model' ? 'bg-gold-900/20 border-gold-500' : 'bg-transparent border-rose-800/50'}`}>
                        <div className="text-left">
                            <span className={`font-bold block ${role === 'model' ? 'text-gold-400' : 'text-white'}`}>Criador(a)</span>
                            <span className="text-xs text-gray-400">Vender conteúdo</span>
                        </div>
                        <Camera className={`w-6 h-6 ${role === 'model' ? 'text-gold-500' : 'text-gray-600'}`} />
                    </button>
                </div>

                <Button onClick={() => setMode('register')} className="w-full">Continuar para Cadastro</Button>
            </div>
        </div>
    )
  }

  // 3. Register Form
  if (mode === 'register') {
      return (
        <div className="min-h-screen bg-[#0a0102] flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in slide-in-from-right duration-500">
                <button onClick={() => setMode('selection')} className="text-rose-500 mb-6 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Voltar</button>
                <h2 className="text-3xl font-serif text-white mb-6">Criar Conta</h2>

                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Nome Completo / Artístico" 
                            className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-4 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none"
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-rose-700" />
                        <input 
                            type="email" 
                            placeholder="Seu E-mail" 
                            className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none"
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-rose-700" />
                        <input 
                            type="password" 
                            placeholder="Senha Segura" 
                            className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none"
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Users className="absolute left-3 top-3.5 w-5 h-5 text-rose-700" />
                        <input 
                            type="text" 
                            placeholder="Código de Indicação (Opcional)" 
                            className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none"
                            onChange={e => setFormData({...formData, referralCode: e.target.value})}
                        />
                    </div>
                </div>

                <Button onClick={handleRegister} className="w-full mb-4">Finalizar Cadastro</Button>
                
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-rose-800/50"></div>
                    <span className="flex-shrink-0 mx-4 text-rose-700 text-xs uppercase">Ou continue com</span>
                    <div className="flex-grow border-t border-rose-800/50"></div>
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black font-medium py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:bg-gray-100 transition"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </button>
            </div>
        </div>
      );
  }

  // 4. Login Form
  if (mode === 'login') {
    return (
        <div className="min-h-screen bg-[#0a0102] flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in slide-in-from-bottom duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-white mb-1">Bem-vindo de volta</h1>
                    <p className="text-rose-400 text-sm">Acesse sua conta para continuar.</p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-rose-700" />
                        <input 
                            type="email" 
                            placeholder="Seu E-mail" 
                            className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none placeholder-rose-700/50"
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Key className="absolute left-3 top-3.5 w-5 h-5 text-rose-700" />
                        <input 
                            type="password" 
                            placeholder="Sua Senha" 
                            className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none placeholder-rose-700/50"
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setMode('forgot_password')} className="text-xs text-rose-400 hover:text-white transition">
                            Esqueceu a senha?
                        </button>
                    </div>
                </div>

                <Button onClick={handleLogin} className="w-full mb-6">
                    <LogIn className="w-4 h-4 mr-2" /> ENTRAR
                </Button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-rose-800/50"></div>
                    <span className="flex-shrink-0 mx-4 text-rose-700 text-xs uppercase">ou</span>
                    <div className="flex-grow border-t border-rose-800/50"></div>
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black font-medium py-3 rounded-xl flex items-center justify-center gap-2 mb-6 hover:bg-gray-100 transition"
                >
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar com Google
                </button>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        Ainda não é membro? <button onClick={() => setMode('selection')} className="text-rose-500 font-bold hover:underline">Cadastre-se</button>
                    </p>
                </div>
            </div>
        </div>
    );
  }

  // 5. Forgot Password
  if (mode === 'forgot_password') {
      return (
        <div className="min-h-screen bg-[#0a0102] flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in fade-in duration-500">
                <button onClick={() => setMode('login')} className="text-rose-500 mb-6 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Voltar</button>
                <h2 className="text-2xl font-serif text-white mb-4">Recuperar Senha</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Digite seu e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.
                </p>

                <div className="relative mb-6">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-rose-700" />
                    <input 
                        type="email" 
                        placeholder="Seu E-mail" 
                        className="w-full bg-rose-900/10 border border-rose-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 focus:outline-none placeholder-rose-700/50"
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <Button onClick={handleForgotPassword} className="w-full">
                    Enviar Link de Recuperação
                </Button>
            </div>
        </div>
      );
  }

  return null;
};

export default Onboarding;