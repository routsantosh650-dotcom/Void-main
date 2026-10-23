import React, { useState } from 'react';
import { Trophy, Search, Swords, Clock, Coins, Box, Award, Shield } from 'lucide-react';
import { LeaderboardPlayer } from '../types/index.ts';
import { calculateLeaderboardRanking } from '../utils/pureRules.ts';

interface LeaderboardSectionProps {
  players: LeaderboardPlayer[];
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ players }) => {
  const [category, setCategory] = useState<'kills' | 'playtime' | 'balance' | 'crates' | 'elo'>('kills');
  const [search, setSearch] = useState('');

  const rankedPlayers = calculateLeaderboardRanking(players, category);
  const filteredPlayers = rankedPlayers.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase().trim())
  );

  const topThree = rankedPlayers.slice(0, 3);

  return (
    <div className="py-16 bg-[#0B0713]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            VOIDMC HALL OF FAME
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-1 font-heading tracking-tight animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            REAL-TIME <span className="text-purple-400 void-glow-text">LEADERBOARD.</span>
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Live competitive rankings synced directly from Singapore node season 5 database.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setCategory('kills')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              category === 'kills'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Top Kills</span>
          </button>

          <button
            onClick={() => setCategory('elo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              category === 'elo'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>PvP Elo</span>
          </button>

          <button
            onClick={() => setCategory('balance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              category === 'balance'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Wealth (Coins)</span>
          </button>

          <button
            onClick={() => setCategory('playtime')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              category === 'playtime'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Playtime</span>
          </button>

          <button
            onClick={() => setCategory('crates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              category === 'crates'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-[#150D24] text-slate-400 hover:text-white border border-purple-900/40'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Crates Opened</span>
          </button>
        </div>

        {/* Podium for Top 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 items-end">
          {/* #2 Silver */}
          {topThree[1] && (
            <div className="order-2 sm:order-1 bg-[#130C22] border border-slate-400/40 rounded-2xl p-5 text-center shadow-lg relative">
              <div className="w-8 h-8 rounded-full bg-slate-400 text-slate-900 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow">
                2
              </div>
              <img
                src={`https://mc-heads.net/avatar/${topThree[1].username}/64`}
                alt={topThree[1].username}
                className="w-14 h-14 rounded-xl mx-auto mb-2 border border-slate-500/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/64';
                }}
              />
              <div className="font-bold text-white text-sm font-mono truncate">{topThree[1].username}</div>
              <div className="text-xs text-purple-400 font-bold mt-0.5">{topThree[1].serverRank}</div>
              <div className="mt-2 text-base font-black font-mono text-slate-200 tabular-nums">
                {category === 'kills' && `${topThree[1].kills.toLocaleString()} Kills`}
                {category === 'elo' && `${topThree[1].pvpElo.toLocaleString()} Elo`}
                {category === 'balance' && `${topThree[1].balanceCoins.toLocaleString()} ⬡`}
                {category === 'playtime' && `${topThree[1].playtimeHours} Hours`}
                {category === 'crates' && `${topThree[1].cratesOpened} Crates`}
              </div>
            </div>
          )}

          {/* #1 Gold */}
          {topThree[0] && (
            <div className="order-1 sm:order-2 bg-[#180E2B] border-2 border-amber-400/70 rounded-2xl p-6 text-center shadow-[0_0_35px_rgba(251,191,36,0.25)] relative sm:-translate-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-base flex items-center justify-center mx-auto mb-3 shadow">
                👑 1
              </div>
              <img
                src={`https://mc-heads.net/avatar/${topThree[0].username}/64`}
                alt={topThree[0].username}
                className="w-16 h-16 rounded-xl mx-auto mb-2 border-2 border-amber-400 shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/64';
                }}
              />
              <div className="font-black text-white text-base font-mono truncate">{topThree[0].username}</div>
              <div className="text-xs text-amber-400 font-bold mt-0.5">{topThree[0].serverRank}</div>
              <div className="mt-2 text-lg font-black font-mono text-amber-300 tabular-nums">
                {category === 'kills' && `${topThree[0].kills.toLocaleString()} Kills`}
                {category === 'elo' && `${topThree[0].pvpElo.toLocaleString()} Elo`}
                {category === 'balance' && `${topThree[0].balanceCoins.toLocaleString()} ⬡`}
                {category === 'playtime' && `${topThree[0].playtimeHours} Hours`}
                {category === 'crates' && `${topThree[0].cratesOpened} Crates`}
              </div>
              <div className="text-[10px] font-mono text-purple-300 mt-1 uppercase tracking-wider">{topThree[0].tier}</div>
            </div>
          )}

          {/* #3 Bronze */}
          {topThree[2] && (
            <div className="order-3 bg-[#130C22] border border-amber-700/50 rounded-2xl p-5 text-center shadow-lg relative">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow">
                3
              </div>
              <img
                src={`https://mc-heads.net/avatar/${topThree[2].username}/64`}
                alt={topThree[2].username}
                className="w-14 h-14 rounded-xl mx-auto mb-2 border border-amber-800/60"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/64';
                }}
              />
              <div className="font-bold text-white text-sm font-mono truncate">{topThree[2].username}</div>
              <div className="text-xs text-purple-400 font-bold mt-0.5">{topThree[2].serverRank}</div>
              <div className="mt-2 text-base font-black font-mono text-slate-200 tabular-nums">
                {category === 'kills' && `${topThree[2].kills.toLocaleString()} Kills`}
                {category === 'elo' && `${topThree[2].pvpElo.toLocaleString()} Elo`}
                {category === 'balance' && `${topThree[2].balanceCoins.toLocaleString()} ⬡`}
                {category === 'playtime' && `${topThree[2].playtimeHours} Hours`}
                {category === 'crates' && `${topThree[2].cratesOpened} Crates`}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player username..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#130C22] border border-purple-800/50 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder:text-slate-500 font-mono"
            />
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-[#110A1F] border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up opacity-0-start" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-mono">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-bold text-slate-400">No players ranked yet</p>
              <p className="text-xs mt-2 text-slate-500">Leaderboard is empty. Rankings will appear here once players are added.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#160D26] text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-purple-900/40">
                <tr>
                  <th className="py-3.5 px-4 text-center">Rank</th>
                  <th className="py-3.5 px-4">Player</th>
                  <th className="py-3.5 px-4">Rank / Tier</th>
                  <th className="py-3.5 px-4 text-right">K/D Ratio</th>
                  <th className="py-3.5 px-4 text-right">Playtime</th>
                  <th className="py-3.5 px-4 text-right">Primary Stat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/60 font-mono">
                {filteredPlayers.map((player) => (
                  <tr key={player.username} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-bold text-xs ${
                          player.rank === 1
                            ? 'text-amber-400'
                            : player.rank === 2
                            ? 'text-slate-300'
                            : player.rank === 3
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      >
                        #{player.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://mc-heads.net/avatar/${player.username}/32`}
                          alt={player.username}
                          className="w-7 h-7 rounded border border-purple-800/60"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/32';
                          }}
                        />
                        <div>
                          <div className="font-bold text-white text-xs sm:text-sm">{player.username}</div>
                          <div className="text-[10px] text-slate-400">
                            {player.isOnline ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                              </span>
                            ) : (
                              'Offline'
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-purple-300 font-semibold text-xs px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                        {player.serverRank}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">{player.tier}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-300">
                      {player.kd} <span className="text-[10px] text-slate-500">({player.kills}/{player.deaths})</span>
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-300">
                      {player.playtimeHours}h
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums font-bold text-purple-300">
                      {category === 'kills' && `${player.kills.toLocaleString()} ⚔️`}
                      {category === 'elo' && `${player.pvpElo.toLocaleString()} Elo`}
                      {category === 'balance' && `${player.balanceCoins.toLocaleString()} ⬡`}
                      {category === 'playtime' && `${player.playtimeHours} hrs`}
                      {category === 'crates' && `${player.cratesOpened} 📦`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
