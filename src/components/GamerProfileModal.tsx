import { useState } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  Trophy, 
  Award, 
  Shield, 
  Edit2, 
  Check, 
  Calendar, 
  Zap, 
  Sparkles, 
  Swords, 
  Gamepad2, 
  User, 
  Flame 
} from 'lucide-react';
import TrophyShowcase from './TrophyShowcase';

interface GamerProfileModalProps {
  profile: UserProfile;
  isCurrentUser: boolean;
  onClose: () => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onSignOut?: () => void;
  onChallengeRival?: (rivalTag: string) => void;
}

export default function GamerProfileModal({
  profile,
  isCurrentUser,
  onClose,
  onUpdateProfile,
  onSignOut,
  onChallengeRival
}: GamerProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [realName, setRealName] = useState(profile.realName || profile.displayName);
  const [gamerTag, setGamerTag] = useState(profile.gamerTag);
  const [bio, setBio] = useState(profile.bio);
  const [playstyle, setPlaystyle] = useState(profile.playstyle || 'Duelist / Entry Fragger');

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        realName: realName.trim(),
        gamerTag: gamerTag.trim() || profile.gamerTag,
        bio: bio.trim(),
        playstyle
      });
    }
    setIsEditing(false);
  };

  const getRankBadgeStyle = (rank: string) => {
    switch (rank) {
      case 'Apex Predator': return 'border-rose-500/60 bg-rose-950/40 text-rose-400';
      case 'Master': return 'border-purple-500/60 bg-purple-950/40 text-purple-400';
      case 'Diamond': return 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300';
      case 'Platinum': return 'border-teal-500/60 bg-teal-950/40 text-teal-300';
      case 'Gold': return 'border-amber-500/60 bg-amber-950/40 text-amber-300';
      case 'Silver': return 'border-slate-400/60 bg-slate-800/40 text-slate-300';
      default: return 'border-orange-600/60 bg-orange-950/40 text-orange-400';
    }
  };

  const proGames = profile.proGames && profile.proGames.length > 0 
    ? profile.proGames 
    : ['Marvel Rivals', 'Valorant'];

  const rivalsList = profile.rivals && profile.rivals.length > 0
    ? profile.rivals
    : ['ViperX_Pro', 'ShadowBlade_99'];

  // Default match history if empty
  const matchHistory = profile.recentMatches && profile.recentMatches.length > 0 ? profile.recentMatches : [
    {
      id: 'm-1',
      game: 'Marvel Rivals',
      mode: '1v1 Pro Scrim Duel',
      result: 'VICTORY' as const,
      score: '10 - 7',
      kills: 24,
      xpEarned: 450,
      trophiesEarned: 35,
      timestamp: 'Today, 2:15 PM'
    },
    {
      id: 'm-2',
      game: 'Valorant',
      mode: '5v5 Tournament Semi-Finals',
      result: 'VICTORY' as const,
      score: '13 - 9',
      kills: 21,
      xpEarned: 520,
      trophiesEarned: 40,
      timestamp: 'Yesterday, 8:40 PM'
    },
    {
      id: 'm-3',
      game: 'Counter-Strike 2',
      mode: 'Competitive MR12',
      result: 'DEFEAT' as const,
      score: '11 - 13',
      kills: 19,
      xpEarned: 180,
      trophiesEarned: 5,
      timestamp: '2 days ago'
    }
  ];

  const winRate = Math.round((profile.wins / Math.max(1, profile.matchesPlayed)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b101c] border-2 border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-4">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-black text-white font-heading tracking-wide">
              PRO GAMER PASSPORT & DOSSIER
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Rival Duel Action if viewing someone else */}
            {!isCurrentUser && onChallengeRival && (
              <button
                onClick={() => onChallengeRival(profile.gamerTag)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Challenge Rival</span>
              </button>
            )}

            {isCurrentUser && onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors"
              >
                Sign Out
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0e1424] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            {/* Left 2 Cols: Avatar, Real Name, Gamer Tag, Bio, Rank, Level */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={profile.photoURL} 
                    alt={profile.gamerTag} 
                    className="w-20 h-20 rounded-2xl border-2 border-sky-400 object-cover shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-slate-900 rounded-md border border-sky-400 text-sky-300 font-mono text-[11px] font-bold">
                    LVL {profile.level}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    {isEditing ? (
                      <div className="space-y-1 w-full">
                        <input 
                          type="text"
                          value={gamerTag}
                          onChange={(e) => setGamerTag(e.target.value)}
                          placeholder="Unique Gamer Handle"
                          className="bg-slate-900 border border-sky-400 rounded px-2 py-1 text-white text-sm font-bold font-mono w-full"
                          maxLength={25}
                        />
                        <input 
                          type="text"
                          value={realName}
                          onChange={(e) => setRealName(e.target.value)}
                          placeholder="Real Name"
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs w-full"
                          maxLength={35}
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-black text-white font-heading truncate">
                          @{profile.gamerTag}
                        </h2>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                          <User className="w-3.5 h-3.5 text-sky-400" />
                          <span>Real Name: <strong>{profile.realName || profile.displayName}</strong></span>
                        </p>
                      </div>
                    )}

                    {isCurrentUser && !isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-bold ${getRankBadgeStyle(profile.rank)}`}>
                      {profile.rank} Tier
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                      <Trophy className="w-3 h-3 fill-amber-400" /> {profile.trophies} Trophies
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400 font-bold">
                      Role: {profile.playstyle || 'Duelist'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Playstyle */}
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-sky-400 rounded p-2 text-xs text-white"
                      placeholder="Enter gamer bio..."
                      maxLength={180}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 rounded bg-sky-500 text-xs font-bold text-slate-950 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    "{profile.bio || 'Competitive esports contender grinding rank, rival duels, and tournaments.'}"
                  </p>
                )}
              </div>

              {/* Pro Games Specialization Tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-sky-400" />
                  Pro In Games
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proGames.map(game => (
                    <span 
                      key={game}
                      className="px-2.5 py-1 rounded bg-[#1e293b] border border-slate-700 text-white font-mono text-xs font-bold"
                    >
                      {game}
                    </span>
                  ))}
                </div>
              </div>

              {/* Level XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-sky-400" /> Level Progression
                  </span>
                  <span className="text-sky-300 font-bold">
                    {profile.xp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Accessible Trophy Showcase */}
            <div className="flex flex-col items-center justify-center">
              <TrophyShowcase trophiesCount={profile.trophies} tier={profile.rank} />
            </div>
          </div>

          {/* Rivals Section: Pro Gamers Frequent Rivals Feature */}
          <div className="p-4 rounded-xl bg-[#0e1424] border-2 border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-rose-500" />
                Declared Rivals & Nemeses
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Direct 1v1 Trophy Wagers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rivalsList.map(rival => (
                <div 
                  key={rival}
                  className="p-3 rounded-lg bg-[#1e293b] border border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-rose-600/20 border border-rose-500/40 text-rose-400 font-bold text-xs flex items-center justify-center font-mono">
                      VS
                    </div>
                    <div>
                      <span className="font-bold text-white font-mono text-xs block">@{rival}</span>
                      <span className="text-[10px] text-slate-400">Nemesis Contender</span>
                    </div>
                  </div>

                  {onChallengeRival && (
                    <button
                      type="button"
                      onClick={() => onChallengeRival(rival)}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold uppercase transition-colors"
                    >
                      Duel Wager
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Core Stats Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0e1424] border border-slate-800 rounded-xl p-3.5 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Total Matches</span>
              <span className="text-lg font-black text-white mt-0.5 block">{profile.matchesPlayed}</span>
              <span className="text-[10px] text-emerald-400">{profile.wins} Victories</span>
            </div>

            <div className="bg-[#0e1424] border border-slate-800 rounded-xl p-3.5 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Win Rate</span>
              <span className="text-lg font-black text-emerald-400 mt-0.5 block">{winRate}%</span>
              <span className="text-[10px] text-slate-500">Competitive scrims</span>
            </div>

            <div className="bg-[#0e1424] border border-slate-800 rounded-xl p-3.5 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">K/D Ratio</span>
              <span className="text-lg font-black text-sky-400 mt-0.5 block">{profile.kdRatio || '2.14'}</span>
              <span className="text-[10px] text-slate-500">Frag efficiency</span>
            </div>

            <div className="bg-[#0e1424] border border-slate-800 rounded-xl p-3.5 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Trophies Won</span>
              <span className="text-lg font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 fill-amber-400" /> {profile.trophies}
              </span>
              <span className="text-[10px] text-slate-500">All-time honors</span>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-sky-400" /> Earned Esports Badges
            </h4>
            <div className="flex flex-wrap gap-2">
              {(profile.badges && profile.badges.length > 0 ? profile.badges : ['Apex Champion', 'Trophy Titan', 'Reflex Master', 'Rivals Nemesis']).map((b) => (
                <div 
                  key={b}
                  className="px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-500/40 text-sky-300 text-xs font-bold font-heading flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Match History */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" /> Recent Match History
            </h4>

            <div className="space-y-2.5">
              {matchHistory.map((match) => (
                <div 
                  key={match.id}
                  className="bg-[#0e1424] border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-10 rounded-full flex-shrink-0 ${
                      match.result === 'VICTORY' ? 'bg-emerald-400' : 'bg-rose-500'
                    }`} />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-heading text-sm">{match.game}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          match.result === 'VICTORY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {match.result}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{match.mode}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
                    <div className="text-left sm:text-right">
                      <span className="text-slate-400 text-[10px] block uppercase">Score / Placement</span>
                      <span className="font-bold text-white">{match.score}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-slate-400 text-[10px] block uppercase">Frags</span>
                      <span className="font-bold text-sky-400">{match.kills} Kills</span>
                    </div>

                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">+{match.xpEarned} XP</span>
                      <span className="text-amber-400 font-bold text-[10px]">+{match.trophiesEarned} Trophies</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
