import React, { useState } from 'react';
import { X, Shield, Lock, User, Key, CheckCircle } from 'lucide-react';
import { validateMinecraftUsername } from '../utils/pureRules.ts';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffLoginSuccess: () => void;
  onPlayerLoginSuccess: (username: string) => void;
  currentPlayer: string | null;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  onStaffLoginSuccess,
  onPlayerLoginSuccess,
  currentPlayer,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'staff' | 'player'>('staff');
  const [pin, setPin] = useState('');
  const [staffError, setStaffError] = useState('');

  // Player sign in state
  const [playerName, setPlayerName] = useState('');
  const [playerPassword, setPlayerPassword] = useState('');
  const [playerError, setPlayerError] = useState('');

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    if (pin.trim() === 'voidstaff2026' || pin.trim() === 'admin' || pin.trim() === 'admin123' || pin.trim() === 'ansh') {
      onStaffLoginSuccess();
      onClose();
    } else {
      setStaffError('Incorrect staff credentials. (Hint: use "voidstaff2026" or "admin")');
    }
  };

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerError('');
    const validation = validateMinecraftUsername(playerName);
    if (!validation.valid) {
      setPlayerError(validation.error || 'Invalid Minecraft username.');
      return;
    }
    if (!playerPassword.trim()) {
      setPlayerError('Please enter a password.');
      return;
    }

    onPlayerLoginSuccess(playerName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#110A1F] border border-purple-800/60 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-[#160D26]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-white font-heading">
              {mode === 'staff' ? 'STAFF & MODERATOR PORTAL' : 'PLAYER ACCOUNT LOGIN'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggles */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b border-purple-900/30 bg-[#0E071A]">
          <button
            type="button"
            onClick={() => setMode('staff')}
            className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
              mode === 'staff'
                ? 'bg-purple-600 text-white'
                : 'bg-[#180E2B] text-slate-400 hover:text-white'
            }`}
          >
            Staff Login
          </button>
          <button
            type="button"
            onClick={() => setMode('player')}
            className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-colors ${
              mode === 'player'
                ? 'bg-purple-600 text-white'
                : 'bg-[#180E2B] text-slate-400 hover:text-white'
            }`}
          >
            Player Login
          </button>
        </div>

        <div className="p-6">
          {mode === 'staff' ? (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Staff Access Key / Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter staff security key"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Default pass: <span className="text-purple-400 font-bold">voidstaff2026</span> or <span className="text-purple-400 font-bold">admin</span>
                </p>
              </div>

              {staffError && (
                <div className="text-xs text-red-400 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-500/30">
                  {staffError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-600/30"
              >
                Access Staff Console
              </button>
            </form>
          ) : (
            <form onSubmit={handlePlayerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Minecraft Username (IGN)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. Steve"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  In-Game PIN / Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    value={playerPassword}
                    onChange={(e) => setPlayerPassword(e.target.value)}
                    placeholder="Enter your server password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
              </div>

              {playerError && (
                <div className="text-xs text-red-400 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-500/30">
                  {playerError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-600/30"
              >
                Sign In to Player Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
