import React, { useEffect, useState } from 'react';
import { Copy, ShoppingBag, Disc, Trophy, Server, Shield, ExternalLink, RefreshCw, Check, Sparkles } from 'lucide-react';

interface ContextMenuProps {
  onNavigate: (tab: string) => void;
  onCopyIp: () => void;
  copied: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ onNavigate, onCopyIp, copied }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Ensure the menu doesn't overflow screen edge
      const menuWidth = 240;
      const menuHeight = 320;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = () => {
      setVisible(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-[100] w-60 rounded-2xl bg-[#140B24]/95 border border-purple-500/50 shadow-[0_0_35px_rgba(168,85,247,0.4)] backdrop-blur-xl p-2 font-mono text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 border-b border-purple-900/40 flex items-center justify-between">
        <span className="font-bold text-[10px] tracking-wider uppercase text-purple-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          VOIDMC ACTIONS
        </span>
        <span className="text-[10px] text-slate-500">ESC to close</span>
      </div>

      <div className="py-1 space-y-0.5">
        <button
          onClick={() => {
            onCopyIp();
            setVisible(false);
          }}
          className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span>Copy Server IP</span>
          </div>
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-[10px] text-slate-500">:25674</span>}
        </button>

        <button
          onClick={() => {
            onNavigate('showcase');
            setVisible(false);
          }}
          className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Season 6 Showcase</span>
        </button>

        <button
          onClick={() => {
            onNavigate('store');
            setVisible(false);
          }}
          className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
          <span>Open VOID Store</span>
        </button>

        <button
          onClick={() => {
            onNavigate('events');
            setVisible(false);
          }}
          className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <Disc className="w-3.5 h-3.5 text-purple-400" />
          <span>Spin the Void Wheel</span>
        </button>

        <button
          onClick={() => {
            onNavigate('leaderboard');
            setVisible(false);
          }}
          className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Hall of Fame</span>
        </button>

        <button
          onClick={() => {
            onNavigate('status');
            setVisible(false);
          }}
          className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span>Server Status & Node</span>
        </button>

        <a
          href="https://discord.gg/J64n9aEsW"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setVisible(false)}
          className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-purple-950/60 text-left transition-colors text-slate-200 hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[#5865F2]">👾</span>
            <span>Join Discord</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        <div className="pt-1 border-t border-purple-900/40">
          <button
            onClick={() => {
              onNavigate('admin');
              setVisible(false);
            }}
            className="w-full px-3 py-1.5 rounded-xl flex items-center justify-between hover:bg-purple-900/30 text-left transition-colors text-purple-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Console (/voidogsite)</span>
            </div>
            <span className="text-[9px] bg-purple-950 px-1.5 py-0.5 rounded text-purple-400">STAFF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
