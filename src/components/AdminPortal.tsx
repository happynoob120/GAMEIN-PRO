import { useState } from 'react';
import { Tournament, UserProfile } from '../types';
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Swords, 
  Trophy, 
  Users, 
  ArrowLeft, 
  Sparkles,
  Check,
  Ban
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPortalProps {
  currentUser: UserProfile | null;
  tournaments: Tournament[];
  onExitAdmin: () => void;
  onCreateTournament: (tourn: Omit<Tournament, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteTournament: (tournamentId: string) => void;
  onUpdateStatus: (tournamentId: string, status: 'upcoming' | 'live' | 'completed', winner?: string) => void;
  onBroadcastAlert: (message: string) => void;
}

export default function AdminPortal({
  currentUser,
  tournaments,
  onExitAdmin,
  onCreateTournament,
  onDeleteTournament,
  onUpdateStatus,
  onBroadcastAlert
}: AdminPortalProps) {
  // Admin Auth Gate State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(
    currentUser?.role === 'admin' || currentUser?.email === 'ekagrkhannaind120@gmail.com'
  );
  const [adminKey, setAdminKey] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Tab State in Admin Panel
  const [adminTab, setAdminTab] = useState<'tournaments' | 'broadcast' | 'gamers'>('tournaments');

  // New Tournament Form
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState('Marvel Rivals');
  const [newHost, setNewHost] = useState('Admin Nexus Operations');
  const [newFormat, setNewFormat] = useState('5v5 Competitive Elimination');
  const [newPrize, setNewPrize] = useState('$15,000 USD + 1,500 Trophies');
  const [newSlots, setNewSlots] = useState(16);
  const [newBanner, setNewBanner] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
  const [newDescription, setNewDescription] = useState('Official verified esports championship.');

  // Broadcast state
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Gamers Ban/Verify Mock registry
  const [gamerTagSearch, setGamerTagSearch] = useState('');
  const [managedGamers, setManagedGamers] = useState<Array<{ tag: string; rank: string; banned: boolean; verified: boolean }>>([
    { tag: 'ViperX_Pro', rank: 'Apex Predator', banned: false, verified: true },
    { tag: 'ShadowBlade_99', rank: 'Apex Predator', banned: false, verified: true },
    { tag: 'NeonPulse_Valk', rank: 'Master', banned: false, verified: true },
    { tag: 'Toxic_Smurf_01', rank: 'Bronze', banned: true, verified: false },
    { tag: 'AeroZero', rank: 'Platinum', banned: false, verified: false }
  ]);

  // Handle Admin Passcode Verification
  const handleVerifyAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = adminKey.trim();

    // Check master secret key or authorized admin identity
    if (
      cleanKey === 'NEXUS-ADMIN-2025' || 
      cleanKey === 'ADMIN_SECRET_KEY' ||
      cleanKey === 'ekagr_admin' ||
      currentUser?.email === 'ekagrkhannaind120@gmail.com'
    ) {
      setIsAdminUnlocked(true);
      setAdminAuthError(null);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setAdminAuthError('Access Denied. Invalid Admin Security Passcode.');
    }
  };

  const handleCreateNewTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateTournament({
      title: newTitle.trim(),
      game: newGame,
      host: newHost.trim(),
      hostId: 'admin-nexus',
      type: 'Single Elimination',
      format: newFormat,
      prizePool: newPrize,
      entryFee: 'Free Entry',
      maxParticipants: Number(newSlots),
      currentParticipants: 8,
      registeredPlayerIds: [],
      status: 'live',
      startDate: 'Live Now • Admin Sanctioned',
      description: newDescription,
      rules: 'Official tournament rules enforced by admin panel.',
      gameBanner: newBanner,
      bracket: [
        {
          id: 'adm-m1',
          round: 1,
          matchNumber: 1,
          teamA: { name: 'Viper Esports', score: 2, winner: true },
          teamB: { name: 'Titan Force', score: 1, winner: false },
          status: 'completed'
        },
        {
          id: 'adm-m2',
          round: 1,
          matchNumber: 2,
          teamA: { name: 'Cyber Wolves', score: 0, winner: false },
          teamB: { name: 'Sentinels X', score: 2, winner: true },
          status: 'completed'
        }
      ]
    });

    setNewTitle('');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    onBroadcastAlert(broadcastText.trim());
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const toggleGamerBan = (tag: string) => {
    setManagedGamers(prev => prev.map(g => g.tag === tag ? { ...g, banned: !g.banned } : g));
  };

  const toggleGamerVerify = (tag: string) => {
    setManagedGamers(prev => prev.map(g => g.tag === tag ? { ...g, verified: !g.verified } : g));
  };

  // IF ADMIN IS NOT YET AUTHENTICATED ON THIS SECRET ROUTE:
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="bg-[#0f172a] border-2 border-rose-600/80 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border-2 border-rose-500 text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-wide">
              ADMIN COMMAND NEXUS
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Classified route restricted to platform organizers and admins.
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold flex items-center gap-1.5">
                <Key className="w-4 h-4 text-rose-400" />
                Admin Security Passcode
              </label>
              <input 
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter secret admin passcode"
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400 font-mono block mt-1">
                Authorized code: <code className="text-rose-300">NEXUS-ADMIN-2025</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>AUTHENTICATE & ACCESS NEXUS</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700 text-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs font-mono text-slate-400 hover:text-white uppercase transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Gaming Arena</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF ADMIN IS AUTHENTICATED: DISPLAY FULL COMMAND PANEL
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#0f172a] border-b-2 border-rose-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-white tracking-wide">
                  ADMIN COMMAND <span className="text-rose-400">NEXUS</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[10px] font-bold">
                  ROOT ACCESS
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono block">
                Secret Operator Route • Tournament Referee & Overseer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit to Arena</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0f172a] p-2 rounded-xl border border-slate-700">
          <button
            onClick={() => setAdminTab('tournaments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-2 ${
              adminTab === 'tournaments' ? 'bg-rose-600 text-white font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Tournaments Management ({tournaments.length})</span>
          </button>
          <button
            onClick={() => setAdminTab('gamers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-2 ${
              adminTab === 'gamers' ? 'bg-rose-600 text-white font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gamer Registry & Anti-Cheat</span>
          </button>
          <button
            onClick={() => setAdminTab('broadcast')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-2 ${
              adminTab === 'broadcast' ? 'bg-rose-600 text-white font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Global Alert Beacon</span>
          </button>
        </div>

        {/* TAB 1: TOURNAMENT MANAGEMENT */}
        {adminTab === 'tournaments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Tournament Form */}
            <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 space-y-4">
              <h2 className="text-base font-black text-white font-heading uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Spawn New Tournament Bracket
              </h2>

              <form onSubmit={handleCreateNewTournament} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                    Tournament Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Marvel Rivals World Cup 2026"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                      Game Title
                    </label>
                    <select
                      value={newGame}
                      onChange={(e) => setNewGame(e.target.value)}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                    >
                      <option value="Marvel Rivals">Marvel Rivals</option>
                      <option value="Valorant">Valorant</option>
                      <option value="Counter-Strike 2">Counter-Strike 2</option>
                      <option value="Apex Legends">Apex Legends</option>
                      <option value="Fortnite">Fortnite</option>
                      <option value="Overwatch 2">Overwatch 2</option>
                      <option value="Rocket League">Rocket League</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                      Max Slots
                    </label>
                    <input 
                      type="number"
                      value={newSlots}
                      onChange={(e) => setNewSlots(Number(e.target.value))}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                    Prize Pool
                  </label>
                  <input 
                    type="text"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    placeholder="$10,000 USD + 1,000 Trophies"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1 font-semibold">
                    Host Organization
                  </label>
                  <input 
                    type="text"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Publish Tournament Live
                </button>
              </form>
            </div>

            {/* Existing Tournaments Admin Controls */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-black text-white font-heading uppercase">
                Active Tournaments Overrides & Referees
              </h2>

              <div className="space-y-3">
                {tournaments.map(t => (
                  <div 
                    key={t.id}
                    className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-white text-sm">
                          {t.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 font-mono text-[10px] font-bold">
                          {t.game}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          t.status === 'live' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Host: {t.host} • Prize: <strong className="text-amber-300">{t.prizePool}</strong> • Participants: {t.currentParticipants}/{t.maxParticipants}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.status !== 'live' && (
                        <button
                          onClick={() => onUpdateStatus(t.id, 'live')}
                          className="px-2.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase transition-colors"
                        >
                          Set Live
                        </button>
                      )}

                      {t.status !== 'completed' && (
                        <button
                          onClick={() => onUpdateStatus(t.id, 'completed', 'Viper Esports')}
                          className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase transition-colors"
                        >
                          Crown Winner
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteTournament(t.id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                        title="Delete Tournament"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GAMERS REGISTRY & BAN HAMMER */}
        {adminTab === 'gamers' && (
          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-black text-white font-heading uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Gamer Identity, Pro Verification & Ban Hammer
              </h2>
              <p className="text-xs text-slate-300">
                Manage accounts, handle uniqueness reservations, verify pro status, and suspend cheating offenders.
              </p>
            </div>

            <div className="divide-y divide-slate-700">
              {managedGamers.map(gamer => (
                <div key={gamer.tag} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-white text-sm">@{gamer.tag}</span>
                      {gamer.verified && (
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> PRO VERIFIED
                        </span>
                      )}
                      {gamer.banned && (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500 text-[10px] font-bold flex items-center gap-1">
                          <Ban className="w-3 h-3" /> SUSPENDED
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Rank: {gamer.rank}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleGamerVerify(gamer.tag)}
                      className="px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 text-xs font-bold uppercase transition-colors"
                    >
                      {gamer.verified ? 'Revoke Pro' : 'Verify Pro'}
                    </button>

                    <button
                      onClick={() => toggleGamerBan(gamer.tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                        gamer.banned 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-rose-950/60 border border-rose-500 text-rose-300 hover:bg-rose-900'
                      }`}
                    >
                      {gamer.banned ? 'Unban Gamer' : 'Ban Offender'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BROADCAST BEACON */}
        {adminTab === 'broadcast' && (
          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 space-y-4 max-w-2xl">
            <div>
              <h2 className="text-base font-black text-white font-heading uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                Platform-Wide Network Broadcast
              </h2>
              <p className="text-xs text-slate-300">
                Pushes an immediate banner alert to all active pro gamers across tournaments and lobby chat.
              </p>
            </div>

            {broadcastSent && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Broadcast successfully dispatched to the GameIn network ticker!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea 
                rows={3}
                required
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="e.g. Marvel Rivals Finals start in 15 minutes! Check-in on Bracket #1 or forfeit."
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-rose-400"
              />

              <button
                type="submit"
                className="py-2.5 px-5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>Transmit Broadcast Alert</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
