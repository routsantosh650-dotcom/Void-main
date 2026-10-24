import React from 'react';
import { ExternalLink, Copy, Check, Heart } from 'lucide-react';
import { PlatformLinks } from '../types/index.ts';
import { DEFAULT_LINKS } from '../data/defaults.ts';

interface FooterProps {
  onCopyIp: () => void;
  copied: boolean;
  onNavigate: (tab: string) => void;
  links?: PlatformLinks;
}

export const Footer: React.FC<FooterProps> = ({ onCopyIp, copied, onNavigate, links = DEFAULT_LINKS }) => {
  return (
    <footer className="bg-[#07040D] border-t border-purple-900/30 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-purple-950/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl text-white tracking-wider">VOIDMC</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-xs border border-purple-800/40">
                SEASON 5
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
              Where creativity, competition and community come together in one evolving Minecraft universe.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <button onClick={() => onNavigate('home')} className="hover:text-purple-300 transition-colors">Home</button>
            <button onClick={() => onNavigate('store')} className="hover:text-purple-300 transition-colors">Store</button>
            <button onClick={() => onNavigate('events')} className="hover:text-purple-300 transition-colors">Spin Wheel</button>
            <button onClick={() => onNavigate('leaderboard')} className="hover:text-purple-300 transition-colors">Leaderboard</button>
            <button onClick={() => onNavigate('status')} className="hover:text-purple-300 transition-colors">Status</button>
            <button onClick={() => onNavigate('about')} className="hover:text-purple-300 transition-colors">About Us</button>
          </div>

          {/* IP Copy pill */}
          <button
            onClick={onCopyIp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#140B24] border border-purple-800/40 text-xs font-mono text-purple-200 hover:border-purple-600 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>play.voidmc.fun:25674</span>
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 VOIDMC Network. Not affiliated with or approved by Mojang Studios or Microsoft.
          </div>
          <div className="flex items-center gap-4">
            {links.discord && (
              <a href={links.discord} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">Discord</a>
            )}
            {links.youtube && (
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">YouTube</a>
            )}
            {links.instagram && (
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">Instagram</a>
            )}
            {links.whatsapp && (
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">WhatsApp</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
