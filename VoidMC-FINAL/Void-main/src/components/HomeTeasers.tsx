import React from 'react';
import { ShoppingBag, ArrowRight, Disc, Users, Sparkles, Shield, Trophy, Flame, Zap, Crown } from 'lucide-react';
import { StoreItem, Currency } from '../types/index.ts';
import { formatCurrency } from '../utils/pureRules.ts';

interface HomeTeasersProps {
  featuredItems: StoreItem[];
  currency: Currency;
  discountEnabled?: boolean;
  onNavigate: (tab: string) => void;
  onAddToCart: (item: StoreItem) => void;
  onBuyNow: (item: StoreItem) => void;
}

export const HomeTeasers: React.FC<HomeTeasersProps> = ({
  featuredItems,
  currency,
  discountEnabled = false,
  onNavigate,
  onAddToCart,
  onBuyNow,
}) => {
  const previewRanks = featuredItems.filter((i) => i.category === 'rank').slice(0, 3);

  const dealPrice = (item: StoreItem) => {
    const off = currency === 'USD' ? item.discountUSD : item.discountINR;
    return discountEnabled && typeof off === 'number' && off > 0 ? off : null;
  };

  return (
    <div className="py-16 space-y-28 bg-[#0B0713]">
      {/* 1. STORE INTRO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-b from-[#150D24] via-[#0E071A] to-[#120822] p-8 sm:p-14 shadow-[0_0_45px_rgba(168,85,247,0.2)]">
          {/* Ambient Cosmic Lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>OFFICIAL NETWORK STORE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight">
                DOMINATE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300">PREMIUM RANKS.</span>
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
                Elevate your gameplay with exclusive kits, custom cosmetic prefixes, weekly crate keys, and instant automated delivery via Google Pay & UPI.
              </p>
            </div>

            <button
              onClick={() => onNavigate('store')}
              className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 shrink-0"
            >
              <span>View Full Store (All Ranks & Keys)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured 3 Ranks Preview Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {previewRanks.map((rank) => (
              <div
                key={rank.id}
                className="group relative bg-[#180E2B]/90 hover:bg-[#1E1236] border border-purple-800/50 hover:border-purple-500 rounded-2xl p-6 transition-all duration-300 shadow-xl hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                      {rank.badge || 'TIER'}
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-400">Monthly Pass</span>
                  </div>

                  <h3 className="text-2xl font-black text-white font-heading group-hover:text-purple-300 transition-colors">
                    {rank.name}
                  </h3>
                  <div className="mt-1 text-2xl font-black text-purple-300 font-mono flex flex-wrap items-center gap-2">
                    {dealPrice(rank) !== null && (
                      <span className="text-sm font-mono text-slate-500 line-through">
                        {formatCurrency(currency === 'USD' ? rank.priceUSD : rank.priceINR, currency)}
                      </span>
                    )}
                    {formatCurrency(dealPrice(rank) ?? (currency === 'USD' ? rank.priceUSD : rank.priceINR), currency)}
                    <span className="text-xs font-normal text-slate-400 ml-1">/m</span>
                  </div>
                  {rank.popular && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-[#1A0E00] text-[9px] font-mono font-black uppercase">
                      <Crown className="w-3 h-3" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="mt-4 space-y-2 border-t border-purple-900/40 pt-4 text-xs text-slate-300">
                    {rank.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold">✓</span>
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                    <div className="text-[11px] text-purple-400/80 font-mono pt-1">
                      + {rank.features.length - 4} more exclusive perks
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <button
                    onClick={() => onBuyNow(rank)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    Buy Rank
                  </button>
                  <button
                    onClick={() => onAddToCart(rank)}
                    className="p-2.5 rounded-xl bg-[#25173E] hover:bg-[#321F54] text-purple-300 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('store')}
              className="text-xs font-mono text-purple-300 hover:text-white underline tracking-wider inline-flex items-center gap-1.5"
            >
              <span>Explore Crate Keys, Buy Coins & Earn Free Rewards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. EVENTS & SPIN WHEEL INTRO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-r from-[#110A1F] via-[#160D28] to-[#110A1F] p-8 sm:p-14 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold mb-3">
                <Disc className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>INTERACTIVE MINECRAFT ARENA</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
                SPIN THE <span className="text-purple-400">VOID.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Test your skills with random PvP practice modes! From Crystal & Anchor combat to Mace smash attacks, Sword combos, and Axe shield-breaking.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-purple-300">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-800/50">⚔️ SWORD</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-800/50">💎 CRYSTAL</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-800/50">🔨 MACE</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-800/50">🪓 AXE</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-800/50">⚡ COMBO</span>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onNavigate('events')}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Disc className="w-4 h-4" />
                  <span>Launch Wheel & Spin to Start</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                onClick={() => onNavigate('events')}
                className="relative cursor-pointer group p-6 rounded-3xl bg-[#180E2B] border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all hover:scale-105 text-center"
              >
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-purple-900 via-indigo-800 to-purple-600 border-4 border-purple-400 flex items-center justify-center relative shadow-inner animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="w-20 h-20 rounded-full bg-[#120626] border-2 border-white flex items-center justify-center text-white font-black font-heading text-sm">
                    SPIN
                  </div>
                </div>
                <div className="mt-4 font-mono text-xs text-purple-300 font-bold group-hover:text-white transition-colors">
                  ▶ Click here to Spin the Wheel
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 SHOWCASE & SEASON 6 BUILDS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-r from-[#170B2E] via-[#100720] to-[#15092B] p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>NEW IN SEASON 6</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
                SOMETHING NEW IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">SEASON 6 BUILDS.</span>
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Take a first look at the Nether Fortress Cathedral, the world-destroying Orbital Cannon Sanctum, and instanced dungeon portals crafted for Season 6.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('showcase')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
                >
                  <span>Explore Season 6 Showcase</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Preview collage */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 max-w-md">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/40 shadow-lg">
                <img src="/assets/aistudio/v6_f9647521.jpg" alt="Nether Cathedral" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">Nether Spire</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/40 shadow-lg">
                <img src="/assets/aistudio/v3_cf034dff.jpg" alt="Orbital Array" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">Orbital Array</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/40 shadow-lg">
                <img src="/assets/aistudio/v2_720863f6.jpg" alt="Dungeons" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">Dungeon Gate</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/40 shadow-lg">
                <img src="/assets/aistudio/v1_f2de36e8.jpg" alt="Boss Raid" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">Cthulhu Boss</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT VOIDMC INTRO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-b from-[#130C22] to-[#0E0818] p-8 sm:p-14 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
              01 — OUR STORY & IDENTITY
            </span>
            <div className="text-xs font-mono uppercase text-slate-500 mt-1">
              MORE THAN A SERVER
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading mt-2">
              WE ARE <span className="text-purple-400">VOIDMC.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              VoidMC is built around a simple idea — create a Minecraft experience where creativity, competition and community come together in one evolving world.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              From a 2GB RAM Aternos server to a 50+GB RAM dedicated Singapore node server, we keep improving ourselves every season to provide the best player experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:scale-105"
              >
                <span>Meet The Team & Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Led by:</span>
                <span className="text-purple-300 font-bold">elite ansh</span>
                <span>•</span>
                <span className="text-purple-300 font-bold">DMM VOID</span>
                <span>•</span>
                <span className="text-purple-300 font-bold">Santosh rout</span>
                <span>•</span>
                <span className="text-purple-300 font-bold">Ayeshaa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
