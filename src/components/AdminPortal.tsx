import { useState, useEffect } from 'react';
import { Tournament, UserProfile } from '../types';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  setDoc 
} from 'firebase/firestore';
import { 
  ShieldAlert, 
  Lock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Swords, 
  Trophy, 
  Users, 
  ArrowLeft, 
  Check, 
  Ban,
  ShieldCheck,
  UserX
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

const AUTHORIZED_ADMIN_EMAIL = 'ekagrkhannaind120@gmail.com';

export default function AdminPortal({
  currentUser,
  tournaments,
  onExitAdmin,
  onCreateTournament,
  onDeleteTournament,
  onUpdateStatus,
  onBroadcastAlert
}: AdminPortalProps) {
  // Only grant admin access if user's verified email matches AUTHORIZED_ADMIN_EMAIL or role is admin
  const isVerifiedAdmin = currentUser?.email === AUTHORIZED_ADMIN_EMAIL || currentUser?.role === 'admin';

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab State in Admin Panel
  const [adminTab, setAdminTab] = useState<'tournaments' | 'broadcast' | 'gamers'>('tournaments');

  // New Tournament Form
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState('Roblox Rivals');
  const [newHost, setNewHost] = useState('GameIn Admin Operations');
  const [newFormat, setNewFormat] = useState('1v1 Arena Aim Duel (First to 10)');
  const [newPrize, setNewPrize] = useState('$10,000 USD + 1,000 Trophies');
  const [newSlots, setNewSlots] = useState(16);
  const [newBanner, setNewBanner] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
  const [newDescription, setNewDescription] = useState('Official Roblox Rivals sanctioned championship.');

  // Broadcast state
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Real Database Gamers loaded from Firestore /users
  const [dbGamers, setDbGamers] = useState<UserProfile[]>([]);
  const [gamersLoading, setGamersLoading] = useState(true);
  const [moderationToast, setModerationToast] = useState<string | null>(null);

  // Real-time listener for Firestore /users collection
  useEffect(() => {
    const usersCol = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCol, async (snapshot) => {
      if (!snapshot.empty) {
        const list: UserProfile[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as UserProfile);
        });
        setDbGamers(list);
        setGamersLoading(false);
      } else {
        // Seed default pro gamers so the admin can test moderation immediately
        const initialUsers: UserProfile[] = [
          {
            userId: 'gamer-viper-1',
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
            role: 'gamer',
            isBanned: false,
            bio: 'Roblox Rivals Grand Champion and Aim Specialist',
            proGames: ['Roblox Rivals', 'Valorant'],
            primaryGame: 'Roblox Rivals',
            playstyle: 'Duelist and Fragger',
            rivals: ['ShadowBlade_99'],
            matchesPlayed: 412,
            wins: 308,
            kdRatio: '2.48',
            badges: ['Roblox Rivals Pro', 'Reflex Master'],
            recentMatches: [],
            createdAt: '2025-01-15',
            updatedAt: '2026-10-25'
          },
          {
            userId: 'gamer-shadow-2',
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
            isBanned: false,
            bio: 'Roblox Rivals Sniper Legend',
            proGames: ['Roblox Rivals'],
            primaryGame: 'Roblox Rivals',
            playstyle: 'Sniper and Long Range Recon',
            rivals: ['ViperX_Pro'],
            matchesPlayed: 380,
            wins: 274,
            kdRatio: '2.31',
            badges: ['Sniper Elite', 'Reflex King'],
            recentMatches: [],
            createdAt: '2025-02-10',
            updatedAt: '2026-10-25'
          },
          {
            userId: 'gamer-toxic-3',
            realName: 'Cheater Smurf',
            gamerTag: 'Toxic_Smurf_01',
            displayName: 'Cheater Smurf',
            email: 'toxic@smurf.gg',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            level: 3,
            xp: 800,
            nextLevelXp: 2000,
            trophies: 80,
            rank: 'Bronze',
            role: 'gamer',
            isBanned: true,
            bio: 'Flagged for match tampering',
            proGames: ['Roblox Rivals'],
            primaryGame: 'Roblox Rivals',
            matchesPlayed: 12,
            wins: 2,
            kdRatio: '0.42',
            badges: [],
            recentMatches: [],
            createdAt: '2026-09-01',
            updatedAt: '2026-10-25'
          }
        ];
        for (const u of initialUsers) {
          await setDoc(doc(db, 'users', u.userId), u).catch(() => {});
          if (u.gamerTag) {
            await setDoc(doc(db, 'handles', u.gamerTag.toLowerCase()), {
              userId: u.userId,
              gamerTag: u.gamerTag,
              claimedAt: u.createdAt
            }).catch(() => {});
          }
        }
        setDbGamers(initialUsers);
        setGamersLoading(false);
      }
    }, (err) => {
      console.warn('Error listening to users in AdminPortal:', err);
      setGamersLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Admin Google Sign-in authentication
  const handleAdminGoogleAuth = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const email = res.user.email;
      if (email === AUTHORIZED_ADMIN_EMAIL) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        setAuthError(`Access Denied: The account (${email}) is not authorized for administrator access.`);
      }
    } catch (err: unknown) {
      console.error('Admin authentication error:', err);
      setAuthError('Authentication could not be completed. Please try again.');
    } finally {
      setIsAuthenticating(false);
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
      rules: 'Official Roblox Rivals tournament rules enforced by admin panel.',
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

  // Real-time Firestore Gamer Moderation Handlers
  const handleToggleBan = async (user: UserProfile) => {
    const updatedStatus = !user.isBanned;
    try {
      await updateDoc(doc(db, 'users', user.userId), {
        isBanned: updatedStatus,
        updatedAt: new Date().toISOString()
      });
      setModerationToast(`Gamer @${user.gamerTag || user.displayName} ${updatedStatus ? 'banned' : 'unbanned'} successfully.`);
      setTimeout(() => setModerationToast(null), 3500);
    } catch (err) {
      console.error('Error updating ban status:', err);
    }
  };

  const handleToggleVerify = async (user: UserProfile) => {
    const hasBadge = user.badges?.includes('Roblox Rivals Pro');
    const newBadges = hasBadge 
      ? (user.badges || []).filter(b => b !== 'Roblox Rivals Pro')
      : [...(user.badges || []), 'Roblox Rivals Pro'];
    try {
      await updateDoc(doc(db, 'users', user.userId), {
        badges: newBadges,
        updatedAt: new Date().toISOString()
      });
      setModerationToast(`Updated pro verification for @${user.gamerTag || user.displayName}.`);
      setTimeout(() => setModerationToast(null), 3500);
    } catch (err) {
      console.error('Error updating verification status:', err);
    }
  };

  const handleDeleteGamer = async (user: UserProfile) => {
    if (!window.confirm(`Permanently delete gamer @${user.gamerTag || user.displayName}? All user stats and handle reservations will be permanently removed.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', user.userId));
      if (user.gamerTag) {
        await deleteDoc(doc(db, 'handles', user.gamerTag.toLowerCase())).catch(() => {});
      }
      setModerationToast(`Gamer @${user.gamerTag || user.displayName} permanently deleted.`);
      setTimeout(() => setModerationToast(null), 3500);
    } catch (err) {
      console.error('Error deleting gamer from Firestore:', err);
    }
  };

  // IF ADMIN IS NOT VERIFIED: SECURE AUTH GATE (NO PASSCODES)
  if (!isVerifiedAdmin) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="bg-[#0f172a] border-2 border-rose-600 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border-2 border-rose-500 text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-wide">
              ADMIN CONTROL PANEL
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Access is strictly restricted to verified platform administrators.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-950 border border-rose-500 text-rose-200 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Clean Google Admin Authentication Button */}
          <div className="space-y-3">
            <div className="bg-[#1e293b] p-3 rounded-lg border border-slate-700 text-xs text-slate-300">
              <span className="block font-bold text-white mb-1">Authorized Administrator:</span>
              <span className="font-mono text-sky-400">{AUTHORIZED_ADMIN_EMAIL}</span>
            </div>

            <button
              onClick={handleAdminGoogleAuth}
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isAuthenticating ? 'VERIFYING...' : 'SIGN IN WITH ADMIN GOOGLE ACCOUNT'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700 text-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs text-slate-400 hover:text-white uppercase transition-colors flex items-center justify-center gap-1.5 mx-auto font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Gaming Arena</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF ADMIN IS VERIFIED: DISPLAY COMMAND PANEL
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#0f172a] border-b-2 border-rose-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-white tracking-wide">
                  ADMIN COMMAND CENTER
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                  VERIFIED ADMIN
                </span>
              </div>
              <span className="text-xs text-slate-300">
                Logged in as {currentUser?.email}
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
            <span>Gamer Registry and Anti-Cheat</span>
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
                  <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold">
                    Tournament Title
                  </label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Roblox Rivals Cyber Scrim Cup"
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold">
                      Game Title
                    </label>
                    <select
                      value={newGame}
                      onChange={(e) => setNewGame(e.target.value)}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                    >
                      <option value="Roblox Rivals">Roblox Rivals</option>
                      <option value="Valorant">Valorant</option>
                      <option value="Counter-Strike 2">Counter-Strike 2</option>
                      <option value="Apex Legends">Apex Legends</option>
                      <option value="Fortnite">Fortnite</option>
                      <option value="Rocket League">Rocket League</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold">
                      Max Slots
                    </label>
                    <input 
                      type="number"
                      value={newSlots}
                      onChange={(e) => setNewSlots(Number(e.target.value))}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold">
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
                  <label className="block text-xs uppercase text-slate-300 mb-1 font-semibold">
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
                Active Tournaments Overrides and Referees
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
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 text-xs font-bold">
                          {t.game}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          t.status === 'live' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Host: {t.host} | Prize: <strong className="text-amber-300">{t.prizePool}</strong> | Participants: {t.currentParticipants}/{t.maxParticipants}
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

        {/* TAB 2: GAMERS REGISTRY AND BAN HAMMER (REAL DATABASE PERSISTENCE) */}
        {adminTab === 'gamers' && (
          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-white font-heading uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  Gamer Identity, Pro Verification & Moderation
                </h2>
                <p className="text-xs text-slate-300">
                  Real-time database sync: manage verified pro tags, ban abusive smurfs, or permanently delete accounts.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-sky-400 self-start sm:self-auto">
                {dbGamers.length} Gamers Registered
              </span>
            </div>

            {moderationToast && (
              <div className="p-3 rounded-lg bg-sky-950/90 border border-sky-400 text-sky-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{moderationToast}</span>
              </div>
            )}

            {gamersLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading gamers from database...</div>
            ) : dbGamers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No gamers currently registered in database.</div>
            ) : (
              <div className="divide-y divide-slate-700">
                {dbGamers.map(gamer => {
                  const isVerified = gamer.badges?.includes('Roblox Rivals Pro') || gamer.role === 'admin';
                  const isBanned = !!gamer.isBanned;

                  return (
                    <div key={gamer.userId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-black text-white text-sm">@{gamer.gamerTag || gamer.displayName}</span>
                          {gamer.realName && (
                            <span className="text-xs text-slate-400 font-medium">({gamer.realName})</span>
                          )}
                          {isVerified && (
                            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400 text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> PRO VERIFIED
                            </span>
                          )}
                          {isBanned && (
                            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500 text-[10px] font-bold flex items-center gap-1">
                              <Ban className="w-3 h-3" /> SUSPENDED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                          <span>Rank: <strong className="text-amber-400">{gamer.rank || 'Bronze'}</strong></span>
                          <span>•</span>
                          <span>Level: <strong className="text-sky-300">{gamer.level || 1}</strong></span>
                          <span>•</span>
                          <span>Trophies: <strong className="text-amber-300">{gamer.trophies || 0}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Verify / Revoke Pro */}
                        <button
                          onClick={() => handleToggleVerify(gamer)}
                          className="px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 text-xs font-bold uppercase transition-colors"
                        >
                          {isVerified ? 'Revoke Pro' : 'Verify Pro'}
                        </button>

                        {/* Ban / Unban Hammer */}
                        <button
                          onClick={() => handleToggleBan(gamer)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                            isBanned 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm' 
                              : 'bg-rose-950/60 border border-rose-500 text-rose-300 hover:bg-rose-900'
                          }`}
                        >
                          {isBanned ? 'Unban Gamer' : 'Ban Offender'}
                        </button>

                        {/* Delete User Permanently */}
                        <button
                          onClick={() => handleDeleteGamer(gamer)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/80 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-white transition-colors"
                          title="Permanently Delete Gamer from Database"
                          aria-label={`Delete gamer @${gamer.gamerTag || gamer.displayName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                placeholder="e.g. Roblox Rivals 1v1 Finals start in 15 minutes! Check in on Bracket 1 or forfeit."
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
