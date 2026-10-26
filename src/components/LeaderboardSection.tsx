import { useState } from 'react';
import { UserProfile } from '../types';
import { Trophy, Award, Crown, Search, Zap, Swords } from 'lucide-react';

interface LeaderboardSectionProps {
  currentUser: UserProfile | null;
  onSelectGamer?: (gamer: UserProfile) => void;
  onChallengeRival?: (targetTag: string) => void;
}

export default function LeaderboardSection({ 
  currentUser, 
  onSelectGamer,
  onChallengeRival 
}: LeaderboardSectionProps) {
  const [activeTab, setActiveTab] = useState<'trophies' | 'level' | 'winrate'>('trophies');
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive pro gamers leaderboard dataset
  const gamersData: UserProfile[] = [
    {
      userId: 'gamer-1',
      realName: 'Alexandre Mercer',
      gamerTag: 'ViperX_Pro',
      displayName: 'Alexandre Mercer',
      email: 'viper@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      level: 42,
      xp: 48900,
      nextLevelXp: 52000,
      trophies: 2840,
      rank: 'Apex Predator',
      role: 'admin',
      bio: 'Roblox Rivals Grand Champion and Aim Specialist',
      proGames: ['Roblox Rivals', 'Valorant'],
      primaryGame: 'Roblox Rivals',
      playstyle: 'Duelist and Fragger',
      rivals: ['ShadowBlade_99'],
      matchesPlayed: 412,
      wins: 308,
      kdRatio: '2.48',
      badges: ['Apex Champion', 'Trophy Titan', 'Reflex Master', 'Rivals Ace'],
      recentMatches: [],
      createdAt: '2025-01-15',
      updatedAt: '2026-10-25'
    },
    {
      userId: 'gamer-2',
      realName: 'Kenji Takahashi',
      gamerTag: 'ShadowBlade_99',
      displayName: 'Kenji Takahashi',
      email: 'shadow@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      level: 38,
      xp: 41200,
      nextLevelXp: 45000,
      trophies: 2610,
      rank: 'Apex Predator',
      role: 'gamer',
      bio: 'Roblox Rivals Sniper Legend and CS2 Major Finalist',
      proGames: ['Roblox Rivals', 'Counter-Strike 2'],
      primaryGame: 'Roblox Rivals',
      playstyle: 'Sniper and Long Range Recon',
      rivals: ['ViperX_Pro'],
      matchesPlayed: 380,
      wins: 274,
      kdRatio: '2.31',
      badges: ['Sniper Elite', 'Reflex King', 'Rivals Ace'],
      recentMatches: [],
      createdAt: '2025-02-10',
      updatedAt: '2026-10-25'
    },
    {
      userId: 'gamer-3',
      realName: 'Elena Rostova',
      gamerTag: 'NeonPulse_Valk',
      displayName: 'Elena Rostova',
      email: 'neon@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      level: 35,
      xp: 36700,
      nextLevelXp: 40000,
      trophies: 2390,
      rank: 'Master',
      role: 'gamer',
      bio: 'Roblox Rivals 1v1 Scrim Master and Apex Player',
      proGames: ['Roblox Rivals', 'Apex Legends'],
      primaryGame: 'Roblox Rivals',
      playstyle: 'Support and Flex Anchor',
      rivals: ['CyberPhoenix'],
      matchesPlayed: 320,
      wins: 219,
      kdRatio: '1.98',
      badges: ['Apex Leader', 'Trophy Titan', 'Clutch God'],
      recentMatches: [],
      createdAt: '2025-03-01',
      updatedAt: '2026-10-25'
    },
    {
      userId: 'gamer-4',
      realName: 'Marcus Thorne',
      gamerTag: 'GhostRecon_Z',
      displayName: 'Marcus Thorne',
      email: 'ghost@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      level: 31,
      xp: 31400,
      nextLevelXp: 35000,
      trophies: 2150,
      rank: 'Master',
      role: 'gamer',
      bio: 'Valorant Radiant and Roblox Rivals Fast Fragger',
      proGames: ['Roblox Rivals', 'Valorant'],
      primaryGame: 'Roblox Rivals',
      playstyle: 'In Game Leader and Strategist',
      rivals: ['ViperX_Pro'],
      matchesPlayed: 295,
      wins: 198,
      kdRatio: '1.85',
      badges: ['Radiant Ace', 'Master Tactician'],
      recentMatches: [],
      createdAt: '2025-04-12',
      updatedAt: '2026-10-25'
    },
    {
      userId: 'gamer-5',
      realName: 'Sophia Chen',
      gamerTag: 'CyberPhoenix',
      displayName: 'Sophia Chen',
      email: 'phoenix@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      level: 29,
      xp: 28900,
      nextLevelXp: 31000,
      trophies: 1980,
      rank: 'Diamond',
      role: 'gamer',
      bio: 'Roblox Rivals 1v1 Arena Grinder',
      proGames: ['Roblox Rivals', 'Rocket League'],
      primaryGame: 'Roblox Rivals',
      playstyle: 'Duelist and Fragger',
      rivals: ['NeonPulse_Valk'],
      matchesPlayed: 260,
      wins: 172,
      kdRatio: '1.74',
      badges: ['Rocket Master', 'Tournament Ace'],
      recentMatches: [],
      createdAt: '2025-05-20',
      updatedAt: '2026-10-25'
    },
    {
      userId: 'gamer-6',
      realName: 'Dmitri Ivanov',
      gamerTag: 'TitanStrike',
      displayName: 'Dmitri Ivanov',
      email: 'titan@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      level: 27,
      xp: 25400,
      nextLevelXp: 28000,
      trophies: 1820,
      rank: 'Diamond',
      role: 'gamer',
      bio: 'Overwatch 2 Tank Specialist | Shot caller & Scrim captain',
      proGames: ['Overwatch 2', 'Marvel Rivals'],
      primaryGame: 'Overwatch 2',
      playstyle: 'Vanguard / Dive Tank',
      rivals: [],
      matchesPlayed: 240,
      wins: 155,
      kdRatio: '1.68',
      badges: ['Tank Titan', 'Daily Grinder'],
      recentMatches: [],
      createdAt: '2025-06-11',
      updatedAt: '2026-10-25'
    },
    {
      userId: 'gamer-7',
      realName: 'Liam O’Connor',
      gamerTag: 'AeroZero',
      displayName: 'Liam O’Connor',
      email: 'aero@esports.gg',
      photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      level: 24,
      xp: 21800,
      nextLevelXp: 25000,
      trophies: 1640,
      rank: 'Platinum',
      role: 'gamer',
      bio: 'Fortnite FNCS finalist | High ground retakes | 240Hz grinder',
      proGames: ['Fortnite', 'Marvel Rivals'],
      primaryGame: 'Fortnite',
      playstyle: 'Duelist / Entry Fragger',
      rivals: [],
      matchesPlayed: 210,
      wins: 132,
      kdRatio: '1.62',
      badges: ['FNCS Finalist', 'Fast Edits'],
      recentMatches: [],
      createdAt: '2025-07-04',
      updatedAt: '2026-10-25'
    }
  ];

  let displayGamers = [...gamersData];
  if (currentUser) {
    const exists = displayGamers.some(g => g.userId === currentUser.userId);
    if (!exists) {
      displayGamers.push(currentUser);
    } else {
      displayGamers = displayGamers.map(g => g.userId === currentUser.userId ? currentUser : g);
    }
  }

  displayGamers.sort((a, b) => {
    if (activeTab === 'trophies') return b.trophies - a.trophies;
    if (activeTab === 'level') {
      if (b.level !== a.level) return b.level - a.level;
      return b.xp - a.xp;
    }
    if (activeTab === 'winrate') {
      const winRateA = (a.wins / Math.max(1, a.matchesPlayed)) * 100;
      const winRateB = (b.wins / Math.max(1, b.matchesPlayed)) * 100;
      return winRateB - winRateA;
    }
    return 0;
  });

  const filteredGamers = displayGamers.filter(g => 
    g.gamerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.realName && g.realName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    g.rank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = filteredGamers.slice(0, 3);

  const myRankIndex = currentUser 
    ? filteredGamers.findIndex(g => g.userId === currentUser.userId)
    : -1;

  const getRankBadgeStyle = (rank: string) => {
    switch (rank) {
      case 'Apex Predator': return 'bg-rose-500 text-black font-bold';
      case 'Master': return 'bg-purple-500 text-black font-bold';
      case 'Diamond': return 'bg-cyan-400 text-black font-bold';
      case 'Platinum': return 'bg-teal-400 text-black font-bold';
      case 'Gold': return 'bg-amber-400 text-black font-bold';
      case 'Silver': return 'bg-slate-300 text-black font-bold';
      default: return 'bg-orange-500 text-black font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-black text-white font-heading tracking-wide">
              GLOBAL LEADERBOARDS
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Ranked in real time by trophies won, account level, and tournament win percentage.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg bg-[#1e293b] border border-slate-700 p-1">
            <button
              onClick={() => setActiveTab('trophies')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'trophies'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 fill-current" />
              Trophies
            </button>
            <button
              onClick={() => setActiveTab('level')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'level'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Level & XP
            </button>
            <button
              onClick={() => setActiveTab('winrate')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'winrate'
                  ? 'bg-emerald-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              Win Rate
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gamer or real name..."
              className="bg-[#1e293b] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* User Rank Sticky Banner */}
      {currentUser && myRankIndex !== -1 && (
        <div className="bg-[#1e293b] border-2 border-sky-500 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center font-black font-mono text-base">
              #{myRankIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-heading text-sm">{currentUser.gamerTag}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500 text-black font-bold">
                  YOU
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${getRankBadgeStyle(currentUser.rank)}`}>
                  {currentUser.rank}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 flex items-center gap-2 font-medium">
                <span>Level {currentUser.level}</span>
                <span>|</span>
                <span className="text-amber-300 font-bold">{currentUser.trophies} Trophies</span>
                <span>|</span>
                <span>{currentUser.wins} Wins in {currentUser.matchesPlayed} Matches</span>
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-sky-300 font-bold block">Current Standing</span>
            <span className="text-xs text-slate-300">Win tournaments, daily quests & rival duels</span>
          </div>
        </div>
      )}

      {/* Top 3 High-Contrast Podium Cards */}
      {top3.length === 3 && searchQuery === '' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rank #2 */}
          <div 
            className="bg-[#0f172a] border-2 border-slate-600 rounded-xl p-5 flex flex-col items-center text-center hover:border-slate-400 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 font-black text-xs flex items-center justify-center mb-2">
              #2
            </div>
            <img 
              onClick={() => onSelectGamer && onSelectGamer(top3[1])}
              src={top3[1].photoURL} 
              alt={top3[1].gamerTag} 
              className="w-16 h-16 rounded-full border-2 border-slate-400 object-cover mb-2 cursor-pointer"
            />
            <h3 
              onClick={() => onSelectGamer && onSelectGamer(top3[1])}
              className="font-bold text-white font-heading text-base cursor-pointer hover:text-sky-300"
            >
              {top3[1].gamerTag}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{top3[1].realName || top3[1].displayName}</span>
            <span className={`text-xs px-2 py-0.5 rounded mt-1 ${getRankBadgeStyle(top3[1].rank)}`}>
              {top3[1].rank}
            </span>

            <div className="mt-4 grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-700 text-center font-mono">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Trophies</span>
                <span className="text-sm font-bold text-amber-300">
                  {top3[1].trophies}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Win Rate</span>
                <span className="text-sm font-bold text-emerald-400">
                  {Math.round((top3[1].wins / top3[1].matchesPlayed) * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Rival Duel Button */}
            {onChallengeRival && (!currentUser || currentUser.gamerTag !== top3[1].gamerTag) && (
              <button
                type="button"
                onClick={() => onChallengeRival(top3[1].gamerTag)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Challenge Rival</span>
              </button>
            )}
          </div>

          {/* Rank #1 */}
          <div 
            className="bg-[#1e293b] border-2 border-amber-400 rounded-xl p-5 flex flex-col items-center text-center shadow-lg"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center mb-2">
              #1
            </div>
            <img 
              onClick={() => onSelectGamer && onSelectGamer(top3[0])}
              src={top3[0].photoURL} 
              alt={top3[0].gamerTag} 
              className="w-18 h-18 rounded-full border-2 border-amber-400 object-cover mb-2 cursor-pointer"
            />
            <h3 
              onClick={() => onSelectGamer && onSelectGamer(top3[0])}
              className="font-black text-white font-heading text-lg cursor-pointer hover:text-amber-300"
            >
              {top3[0].gamerTag}
            </h3>
            <span className="text-xs text-slate-300 font-medium">{top3[0].realName || top3[0].displayName}</span>
            <span className={`text-xs px-2 py-0.5 rounded mt-1 ${getRankBadgeStyle(top3[0].rank)}`}>
              {top3[0].rank}
            </span>

            <div className="mt-4 grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-700 text-center font-mono">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Trophies</span>
                <span className="text-base font-bold text-amber-300 flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4 fill-amber-400" /> {top3[0].trophies}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Win Rate</span>
                <span className="text-base font-bold text-emerald-400">
                  {Math.round((top3[0].wins / top3[0].matchesPlayed) * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Rival Duel Button */}
            {onChallengeRival && (!currentUser || currentUser.gamerTag !== top3[0].gamerTag) && (
              <button
                type="button"
                onClick={() => onChallengeRival(top3[0].gamerTag)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border-2 border-rose-500 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Challenge Champion Rival</span>
              </button>
            )}
          </div>

          {/* Rank #3 */}
          <div 
            className="bg-[#0f172a] border-2 border-orange-600 rounded-xl p-5 flex flex-col items-center text-center hover:border-orange-500 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-orange-700 text-white font-black text-xs flex items-center justify-center mb-2">
              #3
            </div>
            <img 
              onClick={() => onSelectGamer && onSelectGamer(top3[2])}
              src={top3[2].photoURL} 
              alt={top3[2].gamerTag} 
              className="w-16 h-16 rounded-full border-2 border-orange-500 object-cover mb-2 cursor-pointer"
            />
            <h3 
              onClick={() => onSelectGamer && onSelectGamer(top3[2])}
              className="font-bold text-white font-heading text-base cursor-pointer hover:text-sky-300"
            >
              {top3[2].gamerTag}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{top3[2].realName || top3[2].displayName}</span>
            <span className={`text-xs px-2 py-0.5 rounded mt-1 ${getRankBadgeStyle(top3[2].rank)}`}>
              {top3[2].rank}
            </span>

            <div className="mt-4 grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-700 text-center font-mono">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Trophies</span>
                <span className="text-sm font-bold text-amber-300">
                  {top3[2].trophies}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Win Rate</span>
                <span className="text-sm font-bold text-emerald-400">
                  {Math.round((top3[2].wins / top3[2].matchesPlayed) * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Rival Duel Button */}
            {onChallengeRival && (!currentUser || currentUser.gamerTag !== top3[2].gamerTag) && (
              <button
                type="button"
                onClick={() => onChallengeRival(top3[2].gamerTag)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Challenge Rival</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table with high contrast and explicit padding */}
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#1e293b] text-slate-200 font-mono uppercase text-xs border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Pro Gamer & Real Name</th>
                <th className="py-3.5 px-4">Rank Tier</th>
                <th className="py-3.5 px-4 text-center">Level & XP</th>
                <th className="py-3.5 px-4 text-right">Trophies</th>
                <th className="py-3.5 px-4 text-right">Win Rate</th>
                <th className="py-3.5 px-4 text-center">Rival Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 font-sans">
              {filteredGamers.map((gamer, index) => {
                const isMe = currentUser && gamer.userId === currentUser.userId;
                const winRate = Math.round((gamer.wins / Math.max(1, gamer.matchesPlayed)) * 100);

                return (
                  <tr 
                    key={gamer.userId}
                    className={`hover:bg-slate-800/80 transition-colors ${
                      isMe ? 'bg-sky-950/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-400 text-slate-950 font-black text-xs">1</span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-300 text-slate-950 font-black text-xs">2</span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-orange-600 text-white font-black text-xs">3</span>
                      ) : (
                        <span className="text-slate-300 font-bold">#{index + 1}</span>
                      )}
                    </td>

                    <td 
                      onClick={() => onSelectGamer && onSelectGamer(gamer)}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={gamer.photoURL} 
                          alt={gamer.gamerTag}
                          className="w-8 h-8 rounded-full border border-slate-600 object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-heading hover:text-sky-300">
                              @{gamer.gamerTag}
                            </span>
                            {isMe && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500 text-black font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-300 block">
                            {gamer.realName || gamer.displayName} {gamer.proGames && gamer.proGames.length > 0 ? `(${gamer.proGames[0]})` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded inline-block ${getRankBadgeStyle(gamer.rank)}`}>
                        {gamer.rank}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="font-mono">
                        <span className="text-sky-300 font-bold">LVL {gamer.level}</span>
                        <span className="text-xs text-slate-400 block">{gamer.xp.toLocaleString()} XP</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-amber-300 inline-flex items-center gap-1 justify-end">
                        <Trophy className="w-3.5 h-3.5 fill-amber-400" />
                        {gamer.trophies.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        {winRate}%
                      </span>
                    </td>

                    {/* Rival Duel Action Column */}
                    <td className="py-3 px-4 text-center">
                      {!isMe && onChallengeRival ? (
                        <button
                          type="button"
                          onClick={() => onChallengeRival(gamer.gamerTag)}
                          className="px-2.5 py-1 rounded-md border border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold uppercase transition-colors inline-flex items-center gap-1"
                          title={`Challenge @${gamer.gamerTag} as rival`}
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>Rival</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs font-mono">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
