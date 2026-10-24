import React from 'react';
import { ExternalLink, Users, Play, Camera } from 'lucide-react';
import { Language, PlatformLinks } from '../types/index.ts';
import { DEFAULT_LINKS } from '../data/defaults.ts';
import { TRANSLATIONS } from '../data/translations.ts';

interface SocialCardsProps {
  language?: Language;
  links?: PlatformLinks;
}

export const SocialCards: React.FC<SocialCardsProps> = ({ language = 'en', links = DEFAULT_LINKS }) => {
  const t = TRANSLATIONS[language]?.socials || TRANSLATIONS.en.socials;

  return (
    <section className="py-14 bg-[#0E0818] border-y border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
            CONNECT WITH US
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
            JOIN THE VOID COMMUNITY
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Stay updated with server tournaments, giveaways, player clips, and community voice events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discord Card */}
          <div className="group relative bg-[#130C22] hover:bg-[#180E2B] border border-purple-900/50 hover:border-[#5865F2]/60 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(88,101,242,0.25)] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] shadow-inner group-hover:scale-105 transition-transform">
                {/* Real Discord Clyde Logo SVG */}
                <svg className="w-7 h-7 fill-current" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[11px] text-[#8ea1e1] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active 5,000+</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                {t.discordTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.discordSub}
              </p>
            </div>

            <a
              href={links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md group-hover:shadow-[0_0_20px_rgba(88,101,242,0.4)]"
            >
              <span>{t.discordBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* YouTube Card */}
          <div className="group relative bg-[#130C22] hover:bg-[#180E2B] border border-purple-900/50 hover:border-[#FF0000]/60 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,0,0,0.25)] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000] shadow-inner group-hover:scale-105 transition-transform">
                {/* Real YouTube Logo SVG */}
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/20 text-[11px] text-[#ff8080] font-mono">
                <Play className="w-3 h-3 fill-current" />
                <span>@voidsmp-r7i</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                {t.youtubeTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.youtubeSub}
              </p>
            </div>

            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md group-hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
              <span>{t.youtubeBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Instagram Card */}
          <div className="group relative bg-[#130C22] hover:bg-[#180E2B] border border-purple-900/50 hover:border-[#E1306C]/60 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(225,48,108,0.25)] flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F58529]/20 via-[#DD2A7B]/20 to-[#8134AF]/20 border border-[#DD2A7B]/40 flex items-center justify-center text-[#E1306C] shadow-inner group-hover:scale-105 transition-transform">
                {/* Real Instagram Logo SVG */}
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/20 text-[11px] text-[#f782ab] font-mono">
                <Camera className="w-3 h-3" />
                <span>@play.voidmc.fun</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                {t.instaTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t.instaSub}
              </p>
            </div>

            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider transition-opacity shadow-md group-hover:shadow-[0_0_20px_rgba(221,42,123,0.4)]"
            >
              <span>{t.instaBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
