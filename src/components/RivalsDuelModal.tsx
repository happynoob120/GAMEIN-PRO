import { useState } from 'react';
import { UserProfile, RivalDuel } from '../types';
import { 
  X, 
  Swords, 
  Trophy, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Crosshair
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RivalsDuelModalProps {
  currentUser: UserProfile | null;
  targetGamerTag?: string;
  onClose: () => void;
  onOpenAuth: () => void;
  onDuelCompleted?: (wagerWon: number) => void;
}

const RIVALS_GAMES = [
  'Roblox Rivals',
  'Valorant',
  'Counter-Strike 2',
  'Apex Legends',
  'Fortnite',
  'Rocket League'
];

const SUGGESTED_RIVALS = [
  { tag: 'ViperX_Pro', rank: 'Apex Predator', trophies: 2840, primary: 'Roblox Rivals' },
  { tag: 'ShadowBlade_99', rank: 'Apex Predator', trophies: 2610, primary: 'Roblox Rivals' },
  { tag: 'NeonPulse_Valk', rank: 'Master', trophies: 2390, primary: 'Roblox Rivals' },
  { tag: 'GhostRecon_Z', rank: 'Master', trophies: 2150, primary: 'Valorant' },
  { tag: 'CyberPhoenix', rank: 'Diamond', trophies: 1980, primary: 'Roblox Rivals' }
];

export default function RivalsDuelModal({
  currentUser,
  targetGamerTag,
  onClose,
  onOpenAuth,
  onDuelCompleted
}: RivalsDuelModalProps) {
  const [activeTab, setActiveTab] = useState<'challenge' | 'active_duels'>('challenge');
  const [rivalTag, setRivalTag] = useState(targetGamerTag || '');
  const [selectedGame, setSelectedGame] = useState('Roblox Rivals');
  const [wagerTrophies, setWagerTrophies] = useState<number>(25);
  const [format, setFormat] = useState('1v1 Arena Aim Duel (First to 5)');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Active Rival Duels list
  const [duels, setDuels] = useState<RivalDuel[]>([
    {
      id: 'duel-1',
      challengerId: 'demo-viperx',
      challengerTag: 'ViperX_Pro',
      rivalId: currentUser ? currentUser.userId : 'me',
      rivalTag: currentUser ? currentUser.gamerTag : 'You',
      game: 'Roblox Rivals',
      wagerTrophies: 50,
      status: 'pending',
      createdAt: '15 mins ago'
    },
    {
      id: 'duel-2',
      challengerId: currentUser ? currentUser.userId : 'me',
      challengerTag: currentUser ? currentUser.gamerTag : 'You',
      rivalId: 'demo-shadow',
      rivalTag: 'ShadowBlade_99',
      game: 'Roblox Rivals',
      wagerTrophies: 25,
      status: 'accepted',
      createdAt: '2 hours ago'
    },
    {
      id: 'duel-3',
      challengerId: 'demo-neon',
      challengerTag: 'NeonPulse_Valk',
      rivalId: currentUser ? currentUser.userId : 'me',
      rivalTag: currentUser ? currentUser.gamerTag : 'You',
      game: 'Roblox Rivals',
      wagerTrophies: 30,
      status: 'completed',
      winnerTag: currentUser ? currentUser.gamerTag : 'You',
      score: '5 to 3',
      createdAt: 'Yesterday'
    }
  ]);

  const handleSendChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const cleanTarget = rivalTag.trim().replace(/^@/, '');
    if (!cleanTarget) {
      setFeedbackMessage('Please enter or select a rival gamer handle.');
      return;
    }

    if (cleanTarget.toLowerCase() === currentUser.gamerTag.toLowerCase()) {
      setFeedbackMessage('You cannot challenge yourself as a rival.');
      return;
    }

    const newDuel: RivalDuel = {
      id: `duel-${Date.now()}`,
      challengerId: currentUser.userId,
      challengerTag: currentUser.gamerTag,
      rivalId: `rival-${cleanTarget.toLowerCase()}`,
      rivalTag: cleanTarget,
      game: selectedGame,
      wagerTrophies: wagerTrophies,
      status: 'pending',
      createdAt: 'Just now'
    };

    setDuels([newDuel, ...duels]);
    setFeedbackMessage(`Rival challenge sent to @${cleanTarget} for ${wagerTrophies} trophies wager in ${selectedGame}!`);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setActiveTab('active_duels');
  };

  const handleAcceptDuel = (duelId: string) => {
    setDuels(prev => prev.map(d => d.id === duelId ? { ...d, status: 'accepted' as const } : d));
  };

  const handleReportResult = (duelId: string, won: boolean) => {
    const duel = duels.find(d => d.id === duelId);
    if (!duel) return;

    const winner = won 
      ? (currentUser?.gamerTag || 'You') 
      : (duel.challengerTag === currentUser?.gamerTag ? duel.rivalTag : duel.challengerTag);

    setDuels(prev => prev.map(d => d.id === duelId ? {
      ...d,
      status: 'completed' as const,
      winnerTag: winner,
      score: won ? '5 to 2' : '3 to 5'
    } : d));

    if (won && onDuelCompleted) {
      onDuelCompleted(duel.wagerTrophies);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl relative overflow-hidden my-4">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white font-black">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-heading">
                ROBLOX RIVALS 1v1 DUEL
              </h3>
              <p className="text-xs text-slate-300">
                Challenge rivals, wager trophies, and compete in Roblox Rivals scrims
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-600"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 bg-[#0f172a] p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'challenge'
                ? 'bg-rose-600 text-white font-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Issue Challenge</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active_duels')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'active_duels'
                ? 'bg-rose-600 text-white font-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Active Duels ({duels.filter(d => d.status !== 'completed').length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          {feedbackMessage && (
            <div className="p-3 rounded-lg bg-sky-950 border-2 border-sky-500 text-sky-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-sky-400" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {activeTab === 'challenge' ? (
            <form onSubmit={handleSendChallenge} className="space-y-4">
              {/* Rival Target Selection */}
              <div>
                <label className="block text-xs uppercase text-slate-200 mb-1.5 font-bold flex items-center justify-between">
                  <span>Target Rival Gamer Handle</span>
                  <span className="text-rose-400 text-xs">Enter handle</span>
                </label>
                <input 
                  type="text"
                  required
                  value={rivalTag}
                  onChange={(e) => setRivalTag(e.target.value)}
                  placeholder="e.g. ViperX_Pro or ShadowBlade_99"
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 text-sm"
                />

                {/* Quick select suggested rivals */}
                <div className="mt-2.5">
                  <span className="text-xs text-slate-400 uppercase block mb-1.5 font-semibold">
                    Top Roblox Rivals Contenders:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_RIVALS.map(r => (
                      <button
                        type="button"
                        key={r.tag}
                        onClick={() => {
                          setRivalTag(r.tag);
                          setSelectedGame(r.primary);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
                          rivalTag === r.tag
                            ? 'bg-rose-600 text-white border-rose-500 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        @{r.tag} <span className="text-amber-300 font-bold">({r.trophies} Trophies)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Game Selection */}
              <div>
                <label className="block text-xs uppercase text-slate-200 mb-1.5 font-bold">
                  Select Game
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {RIVALS_GAMES.map(g => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setSelectedGame(g)}
                      className={`p-2.5 rounded-lg text-xs font-bold text-left transition-colors border ${
                        selectedGame === g
                          ? 'bg-rose-600 border-rose-500 text-white font-black'
                          : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate block">{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Format & Wager */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1e293b] p-3.5 rounded-xl border border-slate-700">
                <div>
                  <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold">
                    Match Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400 font-medium"
                  >
                    <option value="1v1 Arena Aim Duel (First to 5)">1v1 Arena Aim Duel (First to 5)</option>
                    <option value="1v1 First to 10 Frags">1v1 First to 10 Frags</option>
                    <option value="Sniper Only Duel">Sniper Only Duel</option>
                    <option value="Best of 3 Scrim Matches">Best of 3 Scrim Matches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold flex items-center justify-between">
                    <span>Trophy Wager</span>
                    <span className="text-amber-300 font-bold">{wagerTrophies} Trophies</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 25, 50, 100].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setWagerTrophies(amt)}
                        className={`py-1.5 rounded text-xs font-bold transition-colors border ${
                          wagerTrophies === amt
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Single Primary Action Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>SEND RIVAL CHALLENGE</span>
              </button>
            </form>
          ) : (
            /* Active & Pending Duels List */
            <div className="space-y-3">
              {duels.map(d => {
                const isChallenger = currentUser && d.challengerTag === currentUser.gamerTag;
                const isPending = d.status === 'pending';
                const isAccepted = d.status === 'accepted';
                const isCompleted = d.status === 'completed';

                return (
                  <div 
                    key={d.id}
                    className="p-4 rounded-xl bg-[#1e293b] border-2 border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-white text-sm">
                          @{d.challengerTag} <span className="text-rose-400">vs</span> @{d.rivalTag}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold">
                          {d.game}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Trophy className="w-3 h-3 fill-amber-400" /> {d.wagerTrophies} Trophies
                        </span>
                        <span>|</span>
                        <span>{d.createdAt}</span>
                      </div>

                      {isCompleted && (
                        <p className="text-xs text-emerald-400 font-bold">
                          Winner: @{d.winnerTag} ({d.score})
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {isPending && !isChallenger && (
                        <button
                          type="button"
                          onClick={() => handleAcceptDuel(d.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase transition-colors"
                        >
                          Accept Duel
                        </button>
                      )}

                      {isPending && isChallenger && (
                        <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Awaiting Rival
                        </span>
                      )}

                      {isAccepted && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleReportResult(d.id, true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                          >
                            I Won
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReportResult(d.id, false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs uppercase"
                          >
                            I Lost
                          </button>
                        </div>
                      )}

                      {isCompleted && (
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs font-bold">
                          Concluded
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
