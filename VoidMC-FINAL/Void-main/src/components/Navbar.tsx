import React, { useState } from 'react';
import { ShoppingBag, Copy, Check, Menu, X, Sparkles } from 'lucide-react';
import { Currency } from '../types/index.ts';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  cartCount: number;
  openCart: () => void;
  onCopyIp: () => void;
  copied: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  cartCount,
  openCart,
  onCopyIp,
  copied,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'showcase', label: 'Showcase' },
    { id: 'store', label: 'Store' },
    { id: 'events', label: 'Events' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'status', label: 'Status' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0B0713]/85 border-b border-purple-900/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: VOIDMC Official Logo using /public/assets/aistudio/voidopppp_5e12ad16.png */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl p-1 transition-transform hover:scale-102"
          aria-label="VOIDMC Network Home"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(192,132,252,0.6)] transition-all bg-black/40">
            <img
              src="/assets/aistudio/voidopppp_5e12ad16.png"
              alt="VOIDMC Official Logo"
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-2xl tracking-wider text-white group-hover:text-purple-300 transition-colors">
                VOID<span className="text-purple-400">MC</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc] animate-pulse"></span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300/80">Minecraft Network</span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-1 transition-all text-xs uppercase tracking-wider font-bold whitespace-nowrap shrink-0 hover:text-white ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_8px_#c084fc]" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Controls (Currency: INR/USD only, Auth Profile, Cart, Play Now) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Dropdown: ONLY INR and USD as requested */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              aria-label="Select Currency"
              className="bg-[#180E2B] hover:bg-[#23153C] text-purple-200 border border-purple-800/50 rounded-xl px-2.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer transition-colors shadow-sm"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
            </select>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            aria-label={`View Cart with ${cartCount} items`}
            className="relative p-2.5 rounded-xl bg-[#180E2B] hover:bg-[#24163E] border border-purple-800/50 text-purple-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* PLAY NOW Primary CTA button */}
          <button
            onClick={onCopyIp}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all whitespace-nowrap shrink-0 active:scale-95 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>IP COPIED!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>PLAY NOW</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 rounded-xl bg-[#180E2B] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-900/40 bg-[#0B0713]/98 px-4 pt-3 pb-5 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-purple-900/30">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-900/60 text-white border border-purple-600/50 shadow-md'
                    : 'text-slate-300 hover:bg-purple-950/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-purple-300 font-mono">play.voidmc.fun:25674</span>
            <button
              onClick={onCopyIp}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-lg shadow-md"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy IP'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
