import React from 'react';
import { Sparkles, Flame, Image as ImageIcon } from 'lucide-react';
import { ShowcaseImage } from '../types/index.ts';

interface ShowcaseSectionProps {
  images?: ShowcaseImage[];
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ images = [] }) => {
  return (
    <div className="relative py-12 lg:py-16 text-slate-100 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ------------------------------------------------------------- */}
        {/* MANDATORY PROMPT SECTION: Something new in Season 6 builds */}
        {/* ------------------------------------------------------------- */}
        <section className="relative rounded-3xl overflow-hidden border border-purple-500/50 bg-gradient-to-b from-[#180E2F] via-[#110722] to-[#180B2E] p-8 sm:p-14 shadow-[0_0_60px_rgba(168,85,247,0.3)] animate-fade-in-up">
          {/* Neon Glow Beams */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

          {/* Section Header */}
          <div className="relative z-10 text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold uppercase tracking-widest mb-3 animate-pulse-glow">
              <Flame className="w-4 h-4 text-pink-400" />
              <span>NEXT GENERATION VOID SMP</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight void-glow-text-intense animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              SOMETHING NEW IN SEASON 6 BUILDS
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Season 6 introduces massive custom architecture, the world-destroying Orbital Cannon Sanctum, instanced dungeons with custom bosses, and custom Netherite tier-6 crafting components.
            </p>
          </div>

          {/* Season 6 Spotlight Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Spotlight 1: Nether Cathedral */}
            <div className="relative bg-[#120822] border border-purple-700/60 rounded-2xl overflow-hidden group shadow-2xl card-hover-lift animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src="/assets/aistudio/v6_f9647521.jpg"
                  alt="Nether Cathedral Season 6"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120822] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  01 • THE CATHEDRAL
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white font-heading group-hover:text-purple-300 transition-colors">
                  Cathedral of the Nether Fortress
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Surrounded by burning lava falls and nether mist, this colossal gothic stronghold will host weekly Clan Wars and the Nether Sovereign Throne.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-mono text-purple-300">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">🔥 Built by elite ansh</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">📍 Nether Coords: -420, 64, 180</span>
                </div>
              </div>
            </div>

            {/* Spotlight 2: Orbital Sanctum */}
            <div className="relative bg-[#120822] border border-purple-700/60 rounded-2xl overflow-hidden group shadow-2xl card-hover-lift animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src="/assets/aistudio/v3_cf034dff.jpg"
                  alt="Orbital Strike Chamber Season 6"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120822] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  02 • ORBITAL BEAM
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white font-heading group-hover:text-purple-300 transition-colors">
                  Orbital Strike Cannon Activation Array
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Deep below the bedrock floor, 8 crying obsidian towers focus cosmic solar rays into a singular beam capable of piercing enemy base defenses.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-mono text-purple-300">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">⚡ Engineered by DMM VOID</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">🛡️ Area: 10,000 m²</span>
                </div>
              </div>
            </div>

            {/* Spotlight 3: Dungeon Gateway */}
            <div className="relative bg-[#120822] border border-purple-700/60 rounded-2xl overflow-hidden group shadow-2xl card-hover-lift animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src="/assets/aistudio/v2_720863f6.jpg"
                  alt="Dungeon Portal Gateway"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120822] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600/80 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  03 • INSTANCED DUNGEONS
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white font-heading group-hover:text-purple-300 transition-colors">
                  The Rift Portal & Dungeon Master
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  "Click to Enter Dungeons" portal allowing teams of 1 to 4 players to venture through procedural dungeon chambers for mythic crates and gear.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-mono text-purple-300">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">🗝️ Requires Dungeon Key</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">⚔️ 5 Mob Chambers</span>
                </div>
              </div>
            </div>

            {/* Spotlight 4: Boss Raid */}
            <div className="relative bg-[#120822] border border-purple-700/60 rounded-2xl overflow-hidden group shadow-2xl card-hover-lift animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src="/assets/aistudio/v1_f2de36e8.jpg"
                  alt="Cultist of Cthulhu Boss"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120822] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-600/80 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  04 • WORLD BOSS
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white font-heading group-hover:text-purple-300 transition-colors">
                  Cultist of Cthulhu Summoning
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Full custom entity with dynamic health bars, blood particle bursts, and server announcements when defeated by squads.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-mono text-purple-300">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">👹 75,000 Boss HP</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">🎁 Void Core Loot</span>
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN UPLOAD GALLERY — photos uploaded from the admin panel */}
          {images.length > 0 && (
            <div className="relative z-10 mb-10">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-purple-300 font-bold">
                  Community &amp; Server Gallery
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {images.map((shot) => (
                  <figure
                    key={shot.id}
                    className="relative rounded-2xl overflow-hidden border border-purple-700/50 bg-[#120822] shadow-xl group"
                  >
                    <img
                      src={shot.dataUrl}
                      alt={shot.caption || 'VOIDMC showcase'}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {shot.caption && (
                      <figcaption className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#0B0713] to-transparent text-xs font-mono text-purple-100">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Custom Crafting Items Callout */}
          <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-[#0E061A]/90 border border-purple-600/40 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-14 h-14 rounded-xl bg-purple-950/90 border border-purple-500 p-1.5 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <img src="/assets/aistudio/v4_b45e6733.png" alt="Void Ingot" className="w-full h-full object-contain" />
                </div>
                <div className="w-14 h-14 rounded-xl bg-purple-950/90 border border-purple-500 p-1.5 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <img src="/assets/aistudio/v5_baac44f9.png" alt="Void Core" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">New Season 6 Crafting System</h4>
                <p className="text-xs text-slate-400">Combine Void Matter Ingot & Dark Singularity Core to craft Tier-6 Sovereign Gear.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-500 text-purple-200">
                IP: play.voidmc.fun:25674
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
