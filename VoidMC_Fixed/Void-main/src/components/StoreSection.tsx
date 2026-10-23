import React, { useState } from 'react';
import { Sparkles, Gift, Swords, Coins, ShoppingCart, ArrowRight, Zap, Flame, Shield } from 'lucide-react';
import { StoreItem, Currency, Coupon } from '../types/index.ts';
import { formatCurrency } from '../utils/pureRules.ts';

interface StoreSectionProps {
  items: StoreItem[];
  currency: Currency;
  onAddToCart: (item: StoreItem) => void;
  onBuyNow: (item: StoreItem) => void;
  activeCoupons: Coupon[];
  onApplyCouponCode: (code: string) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  items,
  currency,
  onAddToCart,
  onBuyNow,
  activeCoupons,
  onApplyCouponCode,
}) => {
  const [selectedCoinPkg, setSelectedCoinPkg] = useState<string>('coin_7880');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const ranks = items.filter((i) => i.category === 'rank');
  const crateKeys = items.filter((i) => i.category === 'crate_key');
  const coinPackages = items.filter((i) => i.category === 'coins');
  const ranksWithCoins = items.filter((i) => i.category === 'rank_coins');
  const keysWithCoins = items.filter((i) => i.category === 'key_coins');

  const getDisplayPrice = (item: StoreItem) => {
    return formatCurrency(currency === 'USD' ? item.priceUSD : item.priceINR, currency);
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    onApplyCouponCode(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div className="py-12 bg-[#0B0713]">
      {/* Store Hero Banner */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-r from-purple-950/80 via-[#130C22] to-purple-950/80 shadow-[0_0_45px_rgba(168,85,247,0.25)]">
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src="/src/assets/images/void_store_banner_1792693303537.jpg"
              alt="VOIDMC Store Vault"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0713] via-[#0B0713]/85 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/aistudio/voidopppp_5e12ad16.png"
                alt="VOID SMP"
                className="w-10 h-10 rounded-xl object-cover border border-purple-500 shadow"
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>OFFICIAL VOIDMC SERVER STORE</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading leading-tight mb-4">
              UPGRADE YOUR <span className="text-purple-400">VOID JOURNEY.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Unlock exclusive ranks, mythic crate keys, and cosmetics. Instant automated delivery via Google Pay & UPI QR code with instant Discord receipt.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#ranks-section"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
              >
                View Ranks
              </a>
              <a
                href="#crate-keys-section"
                className="px-5 py-2.5 rounded-xl bg-[#1A102C] hover:bg-[#25173E] border border-purple-700/40 text-purple-200 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Crate Keys
              </a>
              <a
                href="#free-rewards-section"
                className="px-5 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Earn For Free
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 01 — RANKS (Screenshot 993) */}
      <section id="ranks-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            01 — RANKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
            CHOOSE YOUR RANKS.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Choose your premium rank and dominate the VOIDMC server.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ranks.map((rank) => (
            <div
              key={rank.id}
              className={`relative bg-[#110A1F] border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                rank.id === 'rank_void'
                  ? 'border-purple-500/70 shadow-[0_0_40px_rgba(168,85,247,0.35)] bg-gradient-to-b from-[#180E2C] to-[#110A1F]'
                  : 'border-purple-900/40 hover:border-purple-600/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]'
              }`}
            >
              <div>
                {/* Visual Rank Glyphs */}
                <div className="flex justify-center mb-6 pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-purple-950/70 border border-purple-600/30 flex items-center justify-center shadow-inner group">
                    {rank.id === 'rank_void' && (
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full border-2 border-purple-300 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#fff]"></span>
                        </div>
                      </div>
                    )}
                    {rank.id === 'rank_vip' && (
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full border-2 border-violet-400 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-yellow-300" />
                        </div>
                      </div>
                    )}
                    {rank.id === 'rank_elite' && (
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full border border-purple-400 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-purple-400/80"></div>
                        </div>
                      </div>
                    )}
                    {rank.id === 'rank_abyss' && (
                      <Sparkles className="w-7 h-7 text-cyan-300" />
                    )}
                  </div>
                </div>

                {/* Rank Name & Price */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-white tracking-wider font-heading">
                    {rank.name}
                  </h3>
                  <div className="mt-2 text-2xl font-black text-purple-300 font-mono tabular-nums">
                    {getDisplayPrice(rank)}
                    <span className="text-xs font-normal text-slate-400 font-sans ml-1">{rank.duration}</span>
                  </div>
                </div>

                {/* Feature Bullet List */}
                <div className="space-y-2.5 border-t border-purple-900/40 pt-5 mb-8 text-left">
                  {rank.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-purple-400 font-bold shrink-0">✓</span>
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => onBuyNow(rank)}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-purple-600/30 active:scale-98"
                >
                  Buy Rank
                </button>
                <button
                  onClick={() => onAddToCart(rank)}
                  className="w-full py-2 rounded-lg bg-[#1A102C] hover:bg-[#25173E] text-purple-300 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIAL DISCOUNTS (Screenshot 994) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
            SPECIAL DISCOUNTS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Explore the latest additions to our store, featuring exclusive items and limited-time offers.
          </p>
        </div>

        {activeCoupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-[#130C22] border border-purple-700/50 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-xs tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{coupon.discountPercent}% OFF</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{coupon.description}</p>
                </div>
                <button
                  onClick={() => copyCoupon(coupon.code)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
                >
                  {copiedCoupon === coupon.code ? 'Applied!' : 'Copy Code'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-10 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-700/40 flex items-center justify-center mx-auto mb-3 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">NO SPECIAL OFFERS</h3>
            <p className="text-xs text-slate-400 mt-1">No special offers are available right now. Please apply promo code VOID50 in checkout!</p>
          </div>
        )}
      </section>

      {/* 02 — CRATE KEYS (Screenshot 994) */}
      <section id="crate-keys-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            02 — CRATE KEYS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
            UNLOCK REWARDS.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Unlock exclusive rewards, rare items and exciting surprises using premium crate keys.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crateKeys.map((keyItem) => (
            <div
              key={keyItem.id}
              className="bg-[#110A1F] border border-purple-900/40 hover:border-purple-600/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:-translate-y-2 text-center"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center mx-auto mb-4 text-purple-300 shadow-inner">
                  {keyItem.id === 'key_void' && <div className="text-2xl">🔮</div>}
                  {keyItem.id === 'key_vip' && <div className="text-2xl">⚡</div>}
                  {keyItem.id === 'key_elite' && <div className="text-2xl">💠</div>}
                  {keyItem.id === 'key_abyss' && <div className="text-2xl">🌀</div>}
                </div>

                <h3 className="text-xl font-black text-white font-heading tracking-wide mb-1">
                  {keyItem.name}
                </h3>
                <div className="text-xl font-bold text-purple-300 font-mono mb-4 tabular-nums">
                  {getDisplayPrice(keyItem)}
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 mb-6 border-t border-purple-900/30 pt-4">
                  {keyItem.features.map((feat, fIdx) => (
                    <div key={fIdx} className="font-mono text-purple-300">
                      ➤ {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onBuyNow(keyItem)}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-purple-600/30"
                >
                  Buy Key
                </button>
                <button
                  onClick={() => onAddToCart(keyItem)}
                  className="w-full py-1.5 rounded-lg bg-[#1A102C] hover:bg-[#25173E] text-purple-300 text-xs font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EARN FOR FREE (Screenshot 995) */}
      <section id="free-rewards-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold">
            03 — FREE PERKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
            EARN FOR FREE.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Complete simple tasks and claim exciting free rewards on VOIDMC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Invite Reward Card */}
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider font-heading">
                INVITE REWARD
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 20 invites</span>
                <span className="text-purple-300 font-bold">= VOID KEY</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 15 invites</span>
                <span className="text-violet-300 font-bold">= VIP KEY</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 10 invites</span>
                <span className="text-indigo-300 font-bold">= ELITE KEY</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 5 invites</span>
                <span className="text-cyan-300 font-bold">= ABYSS KEY</span>
              </div>
            </div>

            <a
              href="https://discord.gg/J64n9aEsW"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Get Discord Invite Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Boosters-Plans Card */}
          <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider font-heading">
                BOOSTERS-PLANS
              </h3>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 1x boost</span>
                <span className="text-purple-300 font-bold">= ELITE RANK</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 1x boost</span>
                <span className="text-violet-300 font-bold">= 2x ELITE KEYS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 1x boost</span>
                <span className="text-cyan-300 font-bold">= 4x ABYSS KEYS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 2x boost</span>
                <span className="text-amber-300 font-bold">= VIP RANK</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 2x boost</span>
                <span className="text-indigo-300 font-bold">= 3 VIP KEYS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#160D26] border border-purple-900/30">
                <span className="text-slate-300">➤ 2x boost</span>
                <span className="text-purple-400 font-bold">= 2x VOID KEYS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-600/40">
                <span className="text-white font-bold">➤ 4x boost</span>
                <span className="text-purple-300 font-black">= VOID RANK (MAX)</span>
              </div>
            </div>

            <a
              href="https://discord.gg/J64n9aEsW"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Boost Discord Server</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 04 — BUY COINS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            04 — COINS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
            BUY COINS.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Choose a coin package and use your coins across the VOIDMC store.
          </p>
        </div>

        <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl divide-y divide-purple-950/60">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedCoinPkg(pkg.id)}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                selectedCoinPkg === pkg.id
                  ? 'bg-purple-950/40 border-l-4 border-l-purple-500'
                  : 'hover:bg-purple-950/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="coin-pkg"
                  checked={selectedCoinPkg === pkg.id}
                  onChange={() => setSelectedCoinPkg(pkg.id)}
                  className="accent-purple-600 w-4 h-4 cursor-pointer"
                />
                <span className="font-mono text-base sm:text-lg font-bold text-white tabular-nums">
                  {getDisplayPrice(pkg)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-base sm:text-lg font-bold text-purple-300">
                  → {pkg.coinsReward?.toLocaleString()} ⬡
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyNow(pkg);
                  }}
                  className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              const pkg = coinPackages.find((p) => p.id === selectedCoinPkg);
              if (pkg) onBuyNow(pkg);
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-colors"
          >
            Buy Coins
          </button>
        </div>
      </section>

      {/* 05 — RANKS WITH COINS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            05 — RANK COINS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
            RANKS WITH COINS.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Purchase your favourite rank using VOIDMC coins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ranksWithCoins.map((rc) => (
            <div
              key={rc.id}
              className="bg-[#110A1F] border border-purple-900/40 hover:border-purple-600/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-2 text-center"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center mx-auto mb-4 text-purple-300">
                  <Coins className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 font-heading">{rc.name}</h3>
                <div className="text-xs text-slate-500 line-through mb-1">
                  {getDisplayPrice(rc)}
                </div>
                <div className="text-xl font-mono font-black text-purple-300 mb-4">
                  → {rc.priceCoins?.toLocaleString()} ⬡
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  {rc.features[0]}
                </p>
              </div>

              <button
                onClick={() => onBuyNow(rc)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Buy Rank
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — KEYS WITH COINS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            06 — KEY COINS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-heading">
            KEYS WITH COINS.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Use VOIDMC coins to purchase premium crate keys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keysWithCoins.map((kc) => (
            <div
              key={kc.id}
              className="bg-[#110A1F] border border-purple-900/40 hover:border-purple-600/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] text-center"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center mx-auto mb-4 text-purple-300">
                  <Flame className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 font-heading">{kc.name}</h3>
                <div className="text-xs text-slate-500 line-through mb-1">
                  {getDisplayPrice(kc)}
                </div>
                <div className="text-xl font-mono font-black text-purple-300 mb-4">
                  → {kc.priceCoins?.toLocaleString()} ⬡
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  {kc.features[0]}
                </p>
              </div>

              <button
                onClick={() => onBuyNow(kc)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Buy Key
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
