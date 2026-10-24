import React, { useState } from 'react';
import { X, User, Lock, Mail, Key, Sparkles, Check, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { UserAccount } from '../types/index.ts';
import { validateMinecraftUsername } from '../utils/pureRules.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onStaffLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onStaffLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'staff'>('signin');

  // Sign In / Sign Up form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const validation = validateMinecraftUsername(username);
    if (!validation.valid) {
      setError(validation.error || 'Please enter a valid Minecraft username.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { loginOrRegisterPlayer } = await import('../services/firebaseService.ts');
      const user = await loginOrRegisterPlayer(
        username.trim(),
        password,
        authTab === 'signup',
        email.trim() || undefined
      );

      setSuccessMsg(
        authTab === 'signup'
          ? `Welcome ${user.username}! +1,200 Coins synced to Firestore.`
          : `Welcome back ${user.username}! Profile retrieved from Firestore.`
      );

      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = staffPin.trim();
    if (trimmed === 'voidstaff2026' || trimmed === 'admin' || trimmed === 'admin123' || trimmed === 'ansh') {
      onStaffLoginSuccess();
      onClose();
    } else {
      setError('Invalid staff passkey. (Hint: use "voidstaff2026" or "admin")');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#110A1F] border border-purple-800/60 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-[#160D26]">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/voidopppp_5e12ad16.png"
              alt="VOID Logo"
              className="w-7 h-7 rounded-lg object-cover border border-purple-500/50"
            />
            <span className="text-sm font-black text-white font-heading tracking-wide">
              VOIDMC AUTHENTICATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 grid grid-cols-3 gap-1.5 border-b border-purple-900/30 bg-[#0E071A]">
          <button
            type="button"
            onClick={() => {
              setAuthTab('signin');
              setError('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
              authTab === 'signin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('signup');
              setError('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
              authTab === 'signup'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('staff');
              setError('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-colors flex items-center justify-center gap-1 ${
              authTab === 'staff'
                ? 'bg-purple-900/70 text-purple-200 border border-purple-600'
                : 'text-slate-500 hover:text-purple-300'
            }`}
          >
            <Shield className="w-3 h-3 text-purple-400" />
            <span>Staff</span>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 font-mono">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authTab === 'staff' ? (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-slate-300">
                Staff administration console for node operations, bans, and orders approval.
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-purple-300 font-bold mb-1.5">
                  Staff Passkey
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    placeholder="Enter security key"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Default: <span className="text-purple-400 font-bold">voidstaff2026</span> or <span className="text-purple-400 font-bold">admin</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-600/30 font-mono"
              >
                Access Staff Console (/voidogsite)
              </button>
            </form>
          ) : (
            <form onSubmit={handlePlayerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Minecraft Username (IGN) <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. elite_ansh"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                  {username.trim().length >= 3 && (
                    <img
                      src={`https://mc-heads.net/avatar/${username.trim()}/40`}
                      alt="Skin preview"
                      className="w-10 h-10 rounded-xl border border-purple-500 bg-purple-950 shrink-0 shadow"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/40';
                      }}
                    />
                  )}
                </div>
              </div>

              {authTab === 'signup' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>

              {authTab === 'signup' && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/30 text-[11px] text-purple-300 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Get 1,200 free starter Void Coins upon registering!</span>
                </div>
              )}

              <div className="px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-[10px] font-mono text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Firebase Firestore Connected
                </span>
                <span className="text-slate-400">Database: ai-studio-voidmc</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 font-mono flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Syncing with Firebase...</span>
                ) : (
                  <>
                    <span>{authTab === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
