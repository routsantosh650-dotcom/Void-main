import React from 'react';
import { Copy, Check, Disc, Zap, Trophy, ShoppingBag, ShieldCheck, Server, Sparkles } from 'lucide-react';
import { WorldMap } from './WorldMap.tsx';

interface HeroSectionProps {
  onlineCount: number;
  maxPlayers: number;
  copied: boolean;
  onCopyIp: () => void;
  onNavigate: (tab: string) => void;
  announcement: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onlineCount,
  maxPlayers,
  copied,
  onCopyIp,
  onNavigate,
  announcement,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Background with Minecraft Cherry Blossom Scene */}
      <div className="absolute inset-0 z-0">
        <img
          src="/cherry_blossom.webp"
          alt="VOIDMC Cherry Blossom World"
          className="w-full h-full object-cover object-center opacity-60 select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0713]/50 via-[#0B0713]/40 to-[#0B0713]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Season Announcement Ticker */}
        {announcement && (
          <div className="mb-8 flex justify-center animate-fade-in-down opacity-0-start" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.25)] animate-glow-pulse">
              <Zap className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
              <span className="truncate">{announcement}</span>
            </div>
          </div>
        )}

        {/* Main Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Centered Large Official Logo */}
          <div className="mb-6 flex justify-center animate-scale-in opacity-0-start" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.5)] bg-black/60 p-1 hover:scale-105 transition-transform animate-glow-pulse">
              <img
                src="/assets/aistudio/voidopppp_5e12ad16.png"
                alt="VOID SMP Official Logo"
                className="w-full h-full object-cover rounded-2xl select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Subtitle tag */}
          <div className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold mb-3 animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            SEASON 5 • SINGAPORE 50+GB DEDICATED NODE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-heading animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            ENTER THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 shimmer-text-glow" style={{ backgroundImage: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8, #c084fc)', backgroundSize: '200% auto' }}>VOID.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            Where creativity, competition, and community come together in one evolving Minecraft universe.
          </p>

          {/* Server IP Copy Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <div className="flex items-center bg-[#130C22]/95 border border-purple-600/50 rounded-2xl p-2 sm:p-2.5 shadow-[0_0_35px_rgba(168,85,247,0.3)] backdrop-blur-xl animate-border-glow">
              <div className="px-4 py-2 text-left">
                <div className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  JAVA & BEDROCK IP
                </div>
                <div className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
                  play.voidmc.fun <span className="text-purple-400 font-normal">:25674</span>
                </div>
              </div>
              <button
                onClick={onCopyIp}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy IP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <button
              onClick={() => onNavigate('store')}
              className="btn-press inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(147,51,234,0.45)] transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Store</span>
            </button>

            <button
              onClick={() => onNavigate('events')}
              className="btn-press inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1A102C] hover:bg-[#261742] border border-purple-500/50 text-purple-200 hover:text-white font-bold text-sm tracking-wide shadow-md transition-all hover:-translate-y-1"
            >
              <Disc className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Spin the Void</span>
            </button>

            <button
              onClick={() => onNavigate('showcase')}
              className="btn-press inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(236,72,153,0.45)] transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-pink-200" />
              <span>Season 6 Showcase</span>
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className="btn-press inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#130C22] hover:bg-[#1E1235] border border-purple-900/60 text-slate-300 hover:text-white font-semibold text-sm tracking-wide transition-all"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Live Server Specifications Bar */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="card-hover-lift bg-[#130C22]/85 border border-purple-900/50 rounded-2xl p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  {onlineCount} <span className="text-slate-500 text-sm font-normal">/ {maxPlayers}</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Players Online</div>
              </div>
            </div>
          </div>

          <div className="card-hover-lift bg-[#130C22]/85 border border-purple-900/50 rounded-2xl p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  20.0 <span className="text-emerald-400 text-xs font-semibold">MAX</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">TPS Stable</div>
              </div>
            </div>
          </div>

          <div className="card-hover-lift bg-[#130C22]/85 border border-purple-900/50 rounded-2xl p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                  50+ GB
                </div>
                <div className="text-xs text-slate-400 font-medium">Singapore Node</div>
              </div>
            </div>
          </div>

          <div className="card-hover-lift bg-[#130C22]/85 border border-purple-900/50 rounded-2xl p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                  1.20 - 1.21.x
                </div>
                <div className="text-xs text-slate-400 font-medium">Java & Bedrock</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Network Map */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 animate-fade-in-up opacity-0-start" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mb-2">
            GLOBAL SERVER NETWORK
          </h2>
          <p className="text-sm text-slate-400">
            30+ locations worldwide • 50 players per node • Ultra-low latency
          </p>
        </div>
        <WorldMap />
      </div>
    </section>
  );
};
