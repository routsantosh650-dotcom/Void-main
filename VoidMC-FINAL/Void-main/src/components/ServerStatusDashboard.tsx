import React, { useState } from 'react';
import { Server, Activity, Cpu, Wifi, Users, Shield, Copy, Check, Terminal } from 'lucide-react';
import { ServerConfig, LeaderboardPlayer } from '../types/index.ts';

interface ServerStatusDashboardProps {
  config: ServerConfig;
  onlinePlayers: LeaderboardPlayer[];
  onCopyIp: () => void;
  copied: boolean;
}

export const ServerStatusDashboard: React.FC<ServerStatusDashboardProps> = ({
  config,
  onlinePlayers,
  onCopyIp,
  copied,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<'java' | 'bedrock'>('java');

  const activePlayers = onlinePlayers.filter((p) => p.isOnline);

  return (
    <div className="py-16 bg-[#0B0713]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold">
            LIVE TELEMETRY
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-1 font-heading tracking-tight">
            SERVER STATUS & <span className="text-purple-400">VITALS.</span>
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            High performance Singapore dedicated hardware monitoring for VOIDMC Season 5.
          </p>
        </div>

        {/* Server State Header Card */}
        <div className="bg-[#110A1F] border border-purple-900/50 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-purple-900/40">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
                  <Server className="w-7 h-7" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#110A1F] animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white font-heading">{config.serverName} NETWORK</h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-purple-300 font-mono mt-0.5">
                  Node: {config.nodeLocation}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onCopyIp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-purple-600/30"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'IP Copied' : 'Copy Server IP'}</span>
              </button>
            </div>
          </div>

          {/* MOTD Display Box */}
          <div className="mt-6 p-4 rounded-xl bg-[#09050F] border border-purple-900/40 font-mono text-xs text-slate-300">
            <div className="text-[10px] uppercase text-purple-400 tracking-wider mb-1 font-bold">
              Message of the Day (MOTD):
            </div>
            <div className="text-purple-200">
              §d§lVOIDMC §8• §7Season 5: THE VOID AWAITS §8• §bplay.voidmc.fun:25674
            </div>
          </div>

          {/* Hardware & Metric Cards */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span>PLAYERS</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                284 <span className="text-xs text-slate-500">/ {config.maxPlayers}</span>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-purple-950 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: '56.8%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>TPS RATE</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                20.0 <span className="text-xs text-slate-400">STABLE</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">100% Tick Efficiency</div>
            </div>

            <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>MEMORY LOAD</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                32.8 <span className="text-xs text-slate-500">/ 54 GB</span>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-purple-950 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60.7%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
                <Wifi className="w-4 h-4 text-purple-400" />
                <span>PING LATENCY</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300 tabular-nums">
                24ms <span className="text-xs text-emerald-400">OPTIMAL</span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">Singapore Node Direct</div>
            </div>
          </div>
        </div>

        {/* Connection Instructions (Java & Bedrock toggle) */}
        <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white font-heading">HOW TO JOIN VOIDMC</h3>
            <div className="flex items-center gap-1 p-1 bg-[#1A102C] rounded-lg border border-purple-900/50">
              <button
                onClick={() => setSelectedVersion('java')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  selectedVersion === 'java' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Java Edition
              </button>
              <button
                onClick={() => setSelectedVersion('bedrock')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  selectedVersion === 'bedrock' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bedrock / PE
              </button>
            </div>
          </div>

          {selectedVersion === 'java' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
                <span className="text-purple-400 font-bold">STEP 01</span>
                <p className="text-slate-300 mt-1">Open Minecraft Java Edition (Version 1.20 - 1.21.x).</p>
              </div>
              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
                <span className="text-purple-400 font-bold">STEP 02</span>
                <p className="text-slate-300 mt-1">Click Multiplayer → Add Server → Enter Name: "VOIDMC".</p>
              </div>
              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
                <span className="text-purple-400 font-bold">STEP 03</span>
                <p className="text-slate-300 mt-1">Server Address: <span className="text-purple-300 font-bold">play.voidmc.fun:25674</span> & Connect!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
                <span className="text-purple-400 font-bold">STEP 01</span>
                <p className="text-slate-300 mt-1">Launch Minecraft Bedrock (Mobile, Windows 10/11, Console).</p>
              </div>
              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
                <span className="text-purple-400 font-bold">STEP 02</span>
                <p className="text-slate-300 mt-1">Go to Servers tab → Scroll down & click "Add Server".</p>
              </div>
              <div className="p-4 rounded-xl bg-[#160D26] border border-purple-900/30">
                <span className="text-purple-400 font-bold">STEP 03</span>
                <p className="text-slate-300 mt-1">IP: <span className="text-purple-300 font-bold">play.voidmc.fun</span> | Port: <span className="text-purple-300 font-bold">19132</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Live Active Online Players Grid */}
        <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">ACTIVE PLAYERS ONLINE</h3>
              <p className="text-xs text-slate-400">Players currently connected to the Singapore Node</p>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold">{activePlayers.length} Active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {activePlayers.map((player) => (
              <div
                key={player.username}
                className="p-3 rounded-xl bg-[#160D26] border border-purple-900/30 flex items-center gap-2.5 hover:border-purple-600/50 transition-colors"
              >
                <img
                  src={`https://mc-heads.net/avatar/${player.username}/32`}
                  alt={player.username}
                  className="w-8 h-8 rounded border border-purple-800/60 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/32';
                  }}
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate font-mono">{player.username}</div>
                  <div className="text-[10px] text-purple-400 font-semibold">{player.serverRank}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
