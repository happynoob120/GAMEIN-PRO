import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  MessageSquare, 
  Crosshair, 
  Sparkles, 
  Shield, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  ChevronRight, 
  Menu, 
  X, 
  Award,
  Crown,
  Activity,
  Swords,
  Info,
  CheckCircle2,
  Radio,
  Lock
} from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, Tournament, BracketMatch } from './types';
import TrophyShowcase from './components/TrophyShowcase';
import ReflexLab from './components/ReflexLab';
import LiveChatModule from './components/LiveChatModule';
import LeaderboardSection from './components/LeaderboardSection';
import DailyQuestsSection from './components/DailyQuestsSection';
import TournamentDetailModal from './components/TournamentDetailModal';
import TournamentCreateModal from './components/TournamentCreateModal';
import GamerProfileModal from './components/GamerProfileModal';
import AITacticalScoutModal from './components/AITacticalScoutModal';
import AboutTechModal from './components/AboutTechModal';
import AuthModal from './components/AuthModal';
import RivalsDuelModal from './components/RivalsDuelModal';
import AdminPortal from './components/AdminPortal';
import confetti from 'canvas-confetti';

type NavTab = 'tournaments' | 'leaderboard' | 'quests' | 'reflex' | 'chat';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('tournaments');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Secret Admin Route State
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Global Broadcast Ticker
  const [globalBroadcast, setGlobalBroadcast] = useState<string | null>(
    '⚡ MARVEL RIVALS PREMIER TOURNAMENT: 6v6 Quarter-Finals are LIVE! Challenge rivals in 1v1 scrim duels across Tokyo 2099.'
  );

  // Active Modals
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTacticalScoutOpen, setIsTacticalScoutOpen] = useState(false);
  const [isAboutTechOpen, setIsAboutTechOpen] = useState(false);
  const [tacticalInitialGame, setTacticalInitialGame] = useState('Marvel Rivals');
  const [tacticalInitialTopic, setTacticalInitialTopic] = useState('');

  // Rivals Feature State (Pervasive across the entire app)
  const [isRivalsModalOpen, setIsRivalsModalOpen] = useState(false);
  const [rivalsTargetTag, setRivalsTargetTag] = useState('');

  // Active Chat Channel
  const [chatChannelId, setChatChannelId] = useState('global-lobby');
  const [chatChannelTitle, setChatChannelTitle] = useState('Global Esports Lobby');

  // Tournaments State with high quality seed data including Marvel Rivals
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 'tourn-rivals-1',
      title: 'Marvel Rivals Galacta Showdown Season 1',
      game: 'Marvel Rivals',
      host: 'NetEase Esports Circuit',
      hostId: 'marvel-official',
      type: 'Single Elimination',
      format: '6v6 Convoy & Domination (BO3)',
      prizePool: '$15,000 USD + 1,500 Trophies',
      entryFee: 'Free Entry',
      maxParticipants: 16,
      currentParticipants: 14,
      registeredPlayerIds: ['mrv-1', 'mrv-2'],
      status: 'live',
      startDate: 'Live Now • Semi Finals',
      description: 'The premier 6v6 hero team battle tournament. Dynamic destructible environments on Tokyo 2099 and Yggsgard.',
      rules: 'Standard Marvel Rivals tournament rules. Hero bans enabled for Top 8 matches. 120Hz locked client.',
      gameBanner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      winner: undefined,
      bracket: [
        {
          id: 'mr1',
          round: 1,
          matchNumber: 1,
          teamA: { name: 'Avengers Reborn', score: 2, winner: true },
          teamB: { name: 'Doom Syndicate', score: 1, winner: false },
          status: 'completed'
        },
        {
          id: 'mr2',
          round: 1,
          matchNumber: 2,
          teamA: { name: 'X-Force Scrims', score: 2, winner: true },
          teamB: { name: 'Spider Society', score: 0, winner: false },
          status: 'completed'
        },
        {
          id: 'mr3',
          round: 2,
          matchNumber: 3,
          teamA: { name: 'Avengers Reborn', score: 1, winner: false },
          teamB: { name: 'X-Force Scrims', score: 1, winner: false },
          status: 'in_progress'
        }
      ],
      createdAt: '2026-10-24',
      updatedAt: '2026-10-25',
    },
    {
      id: 'tourn-1',
      title: 'Valorant Champions Climax 2026',
      game: 'Valorant',
      host: 'Cloud9 Esports Academy',
      hostId: 'c9-official',
      type: 'Single Elimination',
      format: '5v5 Search & Destroy (BO3)',
      prizePool: '$10,000 USD + 1,000 Trophies',
      entryFee: 'Free Entry',
      maxParticipants: 16,
      currentParticipants: 14,
      registeredPlayerIds: ['c9-1', 'c9-2'],
      status: 'live',
      startDate: 'Live Now • Semi Finals',
      description: 'The premier seasonal championship for verified radiant squads. Featuring broadcast casting and anti-cheat live refereeing.',
      rules: 'Check-in required 15m before each map. Default map pool: Haven, Ascent, Lotus, Bind, Sunset.',
      gameBanner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      winner: undefined,
      bracket: [
        {
          id: 'm1',
          round: 1,
          matchNumber: 1,
          teamA: { name: 'Viper Esports', score: 13, winner: true },
          teamB: { name: 'Phantom Reborn', score: 9, winner: false },
          status: 'completed'
        },
        {
          id: 'm2',
          round: 1,
          matchNumber: 2,
          teamA: { name: 'Sentinels X', score: 13, winner: true },
          teamB: { name: 'Cyber Wolves', score: 11, winner: false },
          status: 'completed'
        },
        {
          id: 'm3',
          round: 2,
          matchNumber: 3,
          teamA: { name: 'Viper Esports', score: 1, winner: false },
          teamB: { name: 'Sentinels X', score: 1, winner: false },
          status: 'in_progress'
        }
      ],
      createdAt: '2026-10-20',
      updatedAt: '2026-10-25',
    },
    {
      id: 'tourn-2',
      title: 'Apex Legends Global Series: Winter Apex',
      game: 'Apex Legends',
      host: 'Respawn Scrim Club',
      hostId: 'respawn-club',
      type: 'Battle Royale Points',
      format: 'Trios BR • 6 Matches Point System',
      prizePool: '$5,000 USD + 750 Trophies',
      entryFee: 'Free Entry',
      maxParticipants: 20,
      currentParticipants: 18,
      registeredPlayerIds: ['respawn-1'],
      status: 'live',
      startDate: 'Live Now • Match 4/6',
      description: 'High octane battle royale showdown on World\'s Edge and Storm Point. Frag multipliers enabled for 3+ kill streaks.',
      rules: 'Standard ALGS scoring: 1st (12 pts), 2nd (9 pts), 3rd (7 pts) + 1 pt per kill.',
      gameBanner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
      bracket: [],
      createdAt: '2026-10-21',
      updatedAt: '2026-10-25',
    },
    {
      id: 'tourn-3',
      title: 'Counter-Strike 2 Major Scrim Invitational',
      game: 'Counter-Strike 2',
      host: 'ESL Pro League',
      hostId: 'esl-admin',
      type: 'Single Elimination',
      format: '5v5 Competitive MR12',
      prizePool: '$8,000 USD + 600 Trophies',
      entryFee: 'Free Entry',
      maxParticipants: 16,
      currentParticipants: 11,
      registeredPlayerIds: [],
      status: 'upcoming',
      startDate: 'Saturday @ 7:00 PM EST',
      description: 'Open bracket qualifiers feeding into the Challenger Major. 128-tick private server cluster with VAC live safeguard.',
      rules: 'Veto system via captain chat. Overtime MR3 $10,000 max round cash.',
      gameBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      bracket: [],
      createdAt: '2026-10-22',
      updatedAt: '2026-10-25',
    },
    {
      id: 'tourn-4',
      title: 'Rocket League Cyber Cup Season 5',
      game: 'Rocket League',
      host: 'Psyonix Masters Circuit',
      hostId: 'psyonix-host',
      type: 'Double Elimination',
      format: '3v3 Soccar (BO5)',
      prizePool: '$2,500 USD + 400 Trophies',
      entryFee: 'Free Entry',
      maxParticipants: 32,
      currentParticipants: 22,
      registeredPlayerIds: [],
      status: 'upcoming',
      startDate: 'Sunday @ 4:00 PM EST',
      description: 'Fast aerials and high-speed goals. Both upper and lower bracket losers bracket runs supported.',
      rules: 'Standard competitive stadium only. Mutators disabled.',
      gameBanner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
      bracket: [],
      createdAt: '2026-10-23',
      updatedAt: '2026-10-25',
    },
    {
      id: 'tourn-5',
      title: 'Fortnite Solo Blitz Championship',
      game: 'Fortnite',
      host: 'FNCS Community League',
      hostId: 'fncs-host',
      type: 'Battle Royale Points',
      format: 'Solo Build Showdown',
      prizePool: '$3,000 USD + 350 Trophies',
      entryFee: 'Free Entry',
      maxParticipants: 64,
      currentParticipants: 58,
      registeredPlayerIds: [],
      status: 'upcoming',
      startDate: 'Nov 1st @ 5:00 PM EST',
      description: 'Test your editing speed and piece control against the region\'s fastest solo fraggers.',
      rules: 'Points for placement and eliminations. Anonymous mode must be off.',
      gameBanner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop&q=80',
      bracket: [],
      createdAt: '2026-10-24',
      updatedAt: '2026-10-25',
    }
  ]);

  // Route Listener for Secret Admin Route
  useEffect(() => {
    const evaluateRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (
        path.includes('admin-command-nexus') || 
        hash.includes('admin-command-nexus') || 
        search.includes('admin=nexus')
      ) {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };

    evaluateRoute();
    window.addEventListener('popstate', evaluateRoute);
    window.addEventListener('hashchange', evaluateRoute);
    return () => {
      window.removeEventListener('popstate', evaluateRoute);
      window.removeEventListener('hashchange', evaluateRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '?admin=nexus');
    setIsAdminRoute(true);
  };

  const navigateFromAdmin = () => {
    window.history.pushState({}, '', window.location.pathname);
    setIsAdminRoute(false);
  };

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as UserProfile);
          } else {
            const cleanName = fbUser.displayName || 'Alex Mercer';
            const fallbackProfile: UserProfile = {
              userId: fbUser.uid,
              realName: cleanName,
              gamerTag: cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '') || 'Apex_Striker',
              displayName: cleanName,
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              level: 12,
              xp: 12400,
              nextLevelXp: 15000,
              trophies: 680,
              rank: 'Gold',
              role: fbUser.email === 'ekagrkhannaind120@gmail.com' ? 'admin' : 'gamer',
              bio: 'Competitive esports player on GameIn Pro.',
              proGames: ['Marvel Rivals', 'Valorant'],
              primaryGame: 'Marvel Rivals',
              playstyle: 'Duelist / Entry Fragger',
              rivals: ['ViperX_Pro'],
              matchesPlayed: 48,
              wins: 32,
              kdRatio: '2.18',
              badges: ['Verified Gamer', 'Tournament Finalist', 'Reflex Pro'],
              recentMatches: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setCurrentUser(fallbackProfile);
          }
        } catch (e) {
          console.warn('Error reading user profile from Firestore:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Quick Open Rivals Challenge Modal (Everywhere accessible)
  const handleOpenRivalChallenge = (targetTag?: string) => {
    setRivalsTargetTag(targetTag || '');
    setIsRivalsModalOpen(true);
  };

  // Handle Joining a Tournament
  const handleJoinTournament = (tournamentId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          const currentP = t.registeredPlayerIds || [];
          if (!currentP.includes(currentUser.userId)) {
            return {
              ...t,
              currentParticipants: Math.min(t.maxParticipants, t.currentParticipants + 1),
              registeredPlayerIds: [...currentP, currentUser.userId],
            };
          }
        }
        return t;
      })
    );

    // Reward XP for tournament participation
    handleAwardXpAndTrophies(300, 25, 'Tournament Registration');
  };

  // Award XP and Trophies (e.g. from Quests, Reflex Lab, Tournament win)
  const handleAwardXpAndTrophies = (xpAmount: number, trophyAmount: number, reason: string) => {
    if (!currentUser) return;

    let newXp = currentUser.xp + xpAmount;
    let newLevel = currentUser.level;
    let newNextXp = currentUser.nextLevelXp;
    let leveledUp = false;

    // Check level up condition
    while (newXp >= newNextXp) {
      newXp = newXp - newNextXp;
      newLevel += 1;
      newNextXp = (newLevel + 1) * 1000;
      leveledUp = true;
    }

    let newRank = currentUser.rank;
    if (newLevel >= 40) newRank = 'Apex Predator';
    else if (newLevel >= 35) newRank = 'Master';
    else if (newLevel >= 28) newRank = 'Diamond';
    else if (newLevel >= 20) newRank = 'Platinum';
    else if (newLevel >= 12) newRank = 'Gold';
    else if (newLevel >= 5) newRank = 'Silver';

    const updatedUser: UserProfile = {
      ...currentUser,
      xp: newXp,
      level: newLevel,
      nextLevelXp: newNextXp,
      trophies: currentUser.trophies + trophyAmount,
      rank: newRank,
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);

    if (leveledUp) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#f59e0b', '#10b981']
      });
    }

    // Persist to Firestore if user doc is active
    try {
      const userRef = doc(db, 'users', currentUser.userId);
      setDoc(userRef, updatedUser, { merge: true }).catch(() => {});
    } catch {}
  };

  // Host/Admin updates a bracket match score
  const handleUpdateBracketMatch = (tournamentId: string, matchId: string, winnerName: string, scoreA: number, scoreB: number) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId && t.bracket) {
          const updatedBracket = t.bracket.map((m) => {
            if (m.id === matchId) {
              return {
                ...m,
                teamA: { ...m.teamA, score: scoreA, winner: m.teamA.name === winnerName },
                teamB: { ...m.teamB, score: scoreB, winner: m.teamB.name === winnerName },
                status: 'completed' as const
              };
            }
            return m;
          });
          return { ...t, bracket: updatedBracket };
        }
        return t;
      })
    );

    if (selectedTournament && selectedTournament.id === tournamentId) {
      setSelectedTournament((prev) => {
        if (!prev || !prev.bracket) return prev;
        const updatedBracket = prev.bracket.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              teamA: { ...m.teamA, score: scoreA, winner: m.teamA.name === winnerName },
              teamB: { ...m.teamB, score: scoreB, winner: m.teamB.name === winnerName },
              status: 'completed' as const
            };
          }
          return m;
        });
        return { ...prev, bracket: updatedBracket };
      });
    }
  };

  // Host/Admin changes tournament status
  const handleUpdateStatus = (tournamentId: string, newStatus: 'upcoming' | 'live' | 'completed', winnerName?: string) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            status: newStatus,
            winner: winnerName || t.winner,
          };
        }
        return t;
      })
    );

    if (selectedTournament && selectedTournament.id === tournamentId) {
      setSelectedTournament((prev) => (prev ? { ...prev, status: newStatus, winner: winnerName || prev.winner } : null));
    }
  };

  // Filter Tournaments
  const filteredTournaments = tournaments.filter((t) => {
    const matchesGame = selectedGameFilter === 'All' || t.game.toLowerCase() === selectedGameFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesGame && matchesStatus;
  });

  // IF SECRET ADMIN ROUTE IS ACTIVE, RENDER THE ADMIN PORTAL
  if (isAdminRoute) {
    return (
      <AdminPortal 
        currentUser={currentUser}
        tournaments={tournaments}
        onExitAdmin={navigateFromAdmin}
        onCreateTournament={(newTourn) => {
          const created: Tournament = {
            ...newTourn,
            id: `tourn-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setTournaments([created, ...tournaments]);
        }}
        onDeleteTournament={(tId) => {
          setTournaments(prev => prev.filter(t => t.id !== tId));
        }}
        onUpdateStatus={handleUpdateStatus}
        onBroadcastAlert={(msg) => setGlobalBroadcast(msg)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Global Alert Broadcast Banner (if active) */}
      {globalBroadcast && (
        <div className="bg-gradient-to-r from-rose-900 via-rose-700 to-rose-900 border-b border-rose-500/60 px-4 py-2 text-xs font-bold text-white flex items-center justify-between shadow-md">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1 justify-center text-center">
            <Radio className="w-4 h-4 text-rose-300 animate-pulse flex-shrink-0" />
            <span className="font-heading tracking-wide uppercase">{globalBroadcast}</span>
          </div>
          <button 
            onClick={() => setGlobalBroadcast(null)}
            className="p-1 rounded hover:bg-rose-800 text-rose-200"
            aria-label="Dismiss broadcast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Accessible Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0f172a] border-b-2 border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Branding */}
          <div 
            onClick={() => setActiveTab('tournaments')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center font-black">
              <Trophy className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl text-white tracking-wide">
                  GAMEIN <span className="text-sky-400">PRO</span>
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-300 block -mt-1">
                Esports Hub
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#1e293b] border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'tournaments' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Swords className="w-4 h-4" />
              Tournaments
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'leaderboard' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'quests' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              Daily Quests
            </button>
            <button
              onClick={() => setActiveTab('reflex')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'reflex' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              Reflex Lab
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Live Comms
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* RIVALS DUEL QUICK BUTTON (Pervasive across platform) */}
            <button
              onClick={() => handleOpenRivalChallenge()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-rose-500 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold uppercase transition-colors shadow-sm"
              title="Issue 1v1 Rival Challenge & Wager Trophies"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Rivals Duel</span>
            </button>

            {/* Tech Info Button */}
            <button
              onClick={() => setIsAboutTechOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-colors"
            >
              <Info className="w-4 h-4 text-sky-400" />
              <span>How It's Made</span>
            </button>

            {/* AI Scout Button (Outlined secondary) */}
            <button
              onClick={() => {
                setTacticalInitialGame('Marvel Rivals');
                setTacticalInitialTopic('');
                setIsTacticalScoutOpen(true);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-bold uppercase transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Scout</span>
            </button>

            {/* User Profile or Single Primary Action: Game In */}
            {currentUser ? (
              <button 
                onClick={() => {
                  setViewedProfile(currentUser);
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center gap-2.5 bg-[#1e293b] border-2 border-slate-600 hover:border-sky-400 rounded-lg px-3 py-1.5 transition-colors"
                aria-label="View Profile"
              >
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.gamerTag}
                  className="w-7 h-7 rounded-md border border-slate-500 object-cover"
                />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-xs text-white">
                      @{currentUser.gamerTag}
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-sky-500 text-black font-bold">
                      LVL {currentUser.level}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3 fill-amber-400" /> {currentUser.trophies}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-sm"
              >
                GAME IN
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f172a] border-b-2 border-slate-700 p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('tournaments'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 ${
                activeTab === 'tournaments' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Swords className="w-4 h-4" /> Tournaments
            </button>
            <button
              onClick={() => { setActiveTab('leaderboard'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 ${
                activeTab === 'leaderboard' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" /> Leaderboard
            </button>
            <button
              onClick={() => { handleOpenRivalChallenge(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 text-rose-300 bg-rose-950/40 border border-rose-500/60"
            >
              <Swords className="w-4 h-4 text-rose-400" /> Rivals 1v1 Scrim Duels
            </button>
            <button
              onClick={() => { setActiveTab('quests'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 ${
                activeTab === 'quests' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" /> Daily Quests & Challenges
            </button>
            <button
              onClick={() => { setActiveTab('reflex'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 ${
                activeTab === 'reflex' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Crosshair className="w-4 h-4" /> Reflex Lab
            </button>
            <button
              onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 ${
                activeTab === 'chat' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Live Comms
            </button>
            <button
              onClick={() => { setIsTacticalScoutOpen(true); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 text-purple-200 bg-purple-950/50 border border-purple-500"
            >
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Tactical Scout (Gemini 3.8)
            </button>
            <button
              onClick={() => { navigateToAdmin(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase text-left flex items-center gap-2 text-rose-300 bg-rose-950/60 border border-rose-500"
            >
              <Lock className="w-4 h-4 text-rose-400" /> Secret Admin Nexus Route
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area with Strict Spacing */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full space-y-8">
        {/* Clean, High-Contrast Hero on Tournaments tab */}
        {activeTab === 'tournaments' && (
          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Left Column: Clear copy with single primary action */}
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-600 text-sky-300 text-xs font-bold uppercase">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Esports & Rivals Nexus</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight leading-snug">
                  COMPETE. DOMINATE. ASCEND.
                </h1>

                <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed font-medium">
                  Verified competitive brackets across <strong className="text-white">Marvel Rivals</strong>, Valorant, Apex Legends, CS2, and Fortnite. Enter with your Real Name and unique Gamer Handle, challenge rivals in 1v1 scrims, and win trophies.
                </p>

                {/* Hero CTAs: EXACTLY ONE PRIMARY HIGH-CONTRAST BUTTON, OTHERS OUTLINED */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('tournaments-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-md"
                  >
                    Browse Tournaments
                  </button>

                  {/* Pervasive Rivals Duel Action */}
                  <button
                    onClick={() => handleOpenRivalChallenge()}
                    className="px-5 py-3 rounded-lg border-2 border-rose-500 hover:border-rose-400 bg-rose-950/40 text-rose-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span>Challenge Rival (1v1)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!currentUser) setIsAuthModalOpen(true);
                      else setIsCreateTournamentOpen(true);
                    }}
                    className="px-5 py-3 rounded-lg border-2 border-slate-600 hover:border-slate-400 bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Host Bracket</span>
                  </button>
                </div>

                {/* Key Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700 text-center font-mono">
                  <div className="p-3 rounded-lg bg-[#1e293b] border border-slate-700">
                    <span className="text-xs text-slate-300 font-semibold uppercase block">Active Events</span>
                    <span className="text-lg font-bold text-white mt-1 block">{tournaments.length}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1e293b] border border-slate-700">
                    <span className="text-xs text-slate-300 font-semibold uppercase block">Prize Pool</span>
                    <span className="text-lg font-bold text-amber-300 mt-1 block">$45,000+</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1e293b] border border-slate-700">
                    <span className="text-xs text-slate-300 font-semibold uppercase block">Pro Gamers</span>
                    <span className="text-lg font-bold text-sky-300 mt-1 block">1,850+</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1e293b] border border-slate-700">
                    <span className="text-xs text-slate-300 font-semibold uppercase block">Marvel Rivals</span>
                    <span className="text-lg font-bold text-rose-400 mt-1 block">Live 6v6</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Accessible Trophy Showcase */}
              <div className="flex flex-col items-center justify-center">
                <TrophyShowcase 
                  trophiesCount={currentUser ? currentUser.trophies : 1250} 
                  tier={currentUser?.rank || 'Gold'} 
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: TOURNAMENTS SECTION */}
        {activeTab === 'tournaments' && (
          <div id="tournaments-grid" className="space-y-6">
            {/* Filter Bar and Host Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] p-4 rounded-xl border border-slate-700">
              <div>
                <h2 className="text-xl font-black text-white font-heading tracking-wide flex items-center gap-2">
                  <Swords className="w-5 h-5 text-sky-400" />
                  TOURNAMENT DIRECTORY
                </h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Real-time brackets, prize pools, and schedules for Marvel Rivals and competitive titles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <div className="flex rounded-lg bg-[#1e293b] border border-slate-700 p-1">
                  {(['all', 'live', 'upcoming', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${
                        statusFilter === st ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Host Tournament Button */}
                <button
                  onClick={() => {
                    if (!currentUser) setIsAuthModalOpen(true);
                    else setIsCreateTournamentOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Host Bracket</span>
                </button>
              </div>
            </div>

            {/* Game Category Filter Pills (Prominent Marvel Rivals) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Marvel Rivals', 'Valorant', 'Apex Legends', 'Counter-Strike 2', 'Rocket League', 'Fortnite'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGameFilter(g)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-colors border ${
                    selectedGameFilter === g
                      ? 'bg-sky-500 text-slate-950 border-sky-400'
                      : 'bg-[#1e293b] text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTournaments.map((tourn) => {
                const isRegistered = currentUser && tourn.registeredPlayerIds?.includes(currentUser.userId);

                return (
                  <div
                    key={tourn.id}
                    className="bg-[#0f172a] border-2 border-slate-700 rounded-xl overflow-hidden shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Banner Image with high-contrast label overlays */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img 
                          src={tourn.gameBanner} 
                          alt={tourn.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40" />

                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          {tourn.status === 'live' && (
                            <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono text-xs font-bold uppercase shadow-sm">
                              LIVE
                            </span>
                          )}
                          {tourn.status === 'upcoming' && (
                            <span className="px-2.5 py-1 rounded bg-sky-600 text-white font-mono text-xs font-bold uppercase shadow-sm">
                              UPCOMING
                            </span>
                          )}
                          {tourn.status === 'completed' && (
                            <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-mono text-xs font-bold uppercase shadow-sm">
                              COMPLETED
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold uppercase border border-slate-700">
                            {tourn.game}
                          </span>
                        </div>
                      </div>

                      {/* Card Content: Essential data fully visible */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-heading font-bold text-base text-white">
                            {tourn.title}
                          </h3>
                          <p className="text-xs text-slate-300 font-medium mt-1">
                            Host: <strong className="text-sky-300">{tourn.host}</strong>
                          </p>
                        </div>

                        {/* Tournament Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 bg-[#1e293b] p-3 rounded-lg border border-slate-700 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Prize Pool</span>
                            <span className="text-amber-300 font-bold font-mono">{tourn.prizePool.split('+')[0]}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Format</span>
                            <span className="text-white font-semibold truncate block">{tourn.format}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Slots Filled</span>
                            <span className="text-sky-300 font-bold font-mono">{tourn.currentParticipants} / {tourn.maxParticipants}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase font-semibold">Entry Fee</span>
                            <span className="text-emerald-400 font-bold font-mono">{tourn.entryFee}</span>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                          <Calendar className="w-4 h-4 text-sky-400" />
                          <span>{tourn.startDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: ONE primary button + Rivals quick trigger */}
                    <div className="p-5 pt-0 space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTournament(tourn)}
                        className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase font-heading tracking-wide transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>{isRegistered ? 'View My Bracket' : 'View Tournament & Bracket'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Quick Rival Duel option for this tournament game */}
                      <button
                        type="button"
                        onClick={() => handleOpenRivalChallenge()}
                        className="w-full py-1.5 px-3 rounded-lg border border-rose-500/50 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Challenge Rivals in {tourn.game}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LEADERBOARD SECTION (WITH RIVALS TRIGGERS) */}
        {activeTab === 'leaderboard' && (
          <LeaderboardSection 
            currentUser={currentUser} 
            onSelectGamer={(gamer) => {
              setViewedProfile(gamer);
              setIsProfileModalOpen(true);
            }} 
            onChallengeRival={handleOpenRivalChallenge}
          />
        )}

        {/* TAB 3: DAILY QUESTS & COMMUNITY CHALLENGES */}
        {activeTab === 'quests' && (
          <DailyQuestsSection 
            currentUser={currentUser}
            onClaimQuest={(questId, xp, trophies) => handleAwardXpAndTrophies(xp, trophies, 'Quest Claim')}
            onOpenReflexLab={() => setActiveTab('reflex')}
            onOpenChat={() => setActiveTab('chat')}
            onOpenTactics={() => {
              setTacticalInitialGame('Marvel Rivals');
              setTacticalInitialTopic('Scout Tokyo 2099 convoy strategies for tournament finals');
              setIsTacticalScoutOpen(true);
            }}
            onOpenTournaments={() => setActiveTab('tournaments')}
          />
        )}

        {/* TAB 4: PRO REFLEX LAB */}
        {activeTab === 'reflex' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
              <h2 className="text-xl font-black text-white font-heading tracking-wide flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-sky-400" />
                MECHANICAL REFLEX & AIM LAB
              </h2>
              <p className="text-xs text-slate-300 font-medium mt-1">
                Test your reaction latency in milliseconds. Scores under 280ms fulfill the daily XP quest.
              </p>
            </div>

            <ReflexLab 
              userBestMs={215}
              onReflexComplete={(scoreMs) => {
                if (scoreMs < 280) {
                  handleAwardXpAndTrophies(300, 20, 'Reflex Speed Drill');
                }
              }}
            />
          </div>
        )}

        {/* TAB 5: LIVE PARTICIPANT COMMS */}
        {activeTab === 'chat' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a] p-4 rounded-xl border border-slate-700">
              <div>
                <h2 className="text-xl font-black text-white font-heading tracking-wide flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  PARTICIPANT LIVE COMMS
                </h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Synchronized match chat powered by Cloud Firestore.
                </p>
              </div>

              {/* Channel Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setChatChannelId('global-lobby');
                    setChatChannelTitle('Global Esports Lobby');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    chatChannelId === 'global-lobby' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  Global Lobby
                </button>
                <button
                  onClick={() => {
                    setChatChannelId('tournament-tourn-rivals-1');
                    setChatChannelTitle('Marvel Rivals Comms');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    chatChannelId === 'tournament-tourn-rivals-1' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  Marvel Rivals
                </button>
              </div>
            </div>

            <LiveChatModule 
              currentUser={currentUser}
              activeChannelId={chatChannelId}
              activeChannelTitle={chatChannelTitle}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating Comms Quick-Launcher */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => {
            setChatChannelId('global-lobby');
            setChatChannelTitle('Global Esports Lobby');
            setActiveTab('chat');
          }}
          className="fixed bottom-5 right-5 z-30 px-4 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95 border-2 border-slate-900"
          aria-label="Open Live Chat"
        >
          <MessageSquare className="w-5 h-5 fill-slate-950" />
          <span className="font-heading uppercase text-xs tracking-wider">Live Comms</span>
        </button>
      )}

      {/* MODAL 1: TOURNAMENT DETAIL & BRACKET */}
      {selectedTournament && (
        <TournamentDetailModal 
          tournament={selectedTournament}
          currentUser={currentUser}
          onClose={() => setSelectedTournament(null)}
          onJoinTournament={handleJoinTournament}
          onUpdateBracketMatch={handleUpdateBracketMatch}
          onUpdateStatus={handleUpdateStatus}
          onChallengeRival={handleOpenRivalChallenge}
          onOpenChatWithTournament={(tId, tTitle) => {
            setSelectedTournament(null);
            setChatChannelId(`tournament-${tId}`);
            setChatChannelTitle(tTitle);
            setActiveTab('chat');
          }}
          onOpenTacticalScout={(tTitle, game) => {
            setTacticalInitialGame(game);
            setTacticalInitialTopic(`How to win the finals of ${tTitle}`);
            setIsTacticalScoutOpen(true);
          }}
        />
      )}

      {/* MODAL 2: TOURNAMENT CREATE / HOST */}
      {isCreateTournamentOpen && (
        <TournamentCreateModal 
          currentUser={currentUser}
          onClose={() => setIsCreateTournamentOpen(false)}
          onCreateTournament={(newTourn) => {
            const created: Tournament = {
              ...newTourn,
              id: `tourn-${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setTournaments([created, ...tournaments]);
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 }
            });
          }}
        />
      )}

      {/* MODAL 3: GAMER PROFILE DOSSIER */}
      {isProfileModalOpen && viewedProfile && (
        <GamerProfileModal 
          profile={viewedProfile}
          isCurrentUser={currentUser ? currentUser.userId === viewedProfile.userId : false}
          onClose={() => setIsProfileModalOpen(false)}
          onChallengeRival={handleOpenRivalChallenge}
          onUpdateProfile={(updated) => {
            if (currentUser) {
              const updatedUser = { ...currentUser, ...updated };
              setCurrentUser(updatedUser);
              setViewedProfile(updatedUser);
            }
          }}
          onSignOut={() => {
            auth.signOut();
            setCurrentUser(null);
            setIsProfileModalOpen(false);
          }}
        />
      )}

      {/* MODAL 4: RIVALS DUEL & SCRIM NEXUS */}
      {isRivalsModalOpen && (
        <RivalsDuelModal 
          currentUser={currentUser}
          targetGamerTag={rivalsTargetTag}
          onClose={() => setIsRivalsModalOpen(false)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onDuelCompleted={(wagerWon) => {
            handleAwardXpAndTrophies(400, wagerWon, 'Rival Duel Victory');
          }}
        />
      )}

      {/* MODAL 5: GEMINI AI TACTICAL SCOUT */}
      {isTacticalScoutOpen && (
        <AITacticalScoutModal 
          initialGame={tacticalInitialGame}
          initialTopic={tacticalInitialTopic}
          onClose={() => setIsTacticalScoutOpen(false)}
        />
      )}

      {/* MODAL 6: ABOUT TECH ARCHITECTURE */}
      {isAboutTechOpen && (
        <AboutTechModal onClose={() => setIsAboutTechOpen(false)} />
      )}

      {/* MODAL 7: AUTHENTICATION "GAME IN" MODAL */}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      )}

      {/* Accessible Footer with Secret Admin Link */}
      <footer className="border-t-2 border-slate-700 bg-[#0f172a] py-6 text-xs text-slate-300 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-sky-400" />
            <span className="font-heading font-bold text-white text-sm">GAMEIN PRO</span>
            <span className="text-slate-500">|</span>
            <span>Real Name • Unique Handles • Rivals • Marvel Rivals & Esports</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsAboutTechOpen(true)}
              className="text-sky-300 hover:text-white font-semibold underline underline-offset-4 flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              How is this website made?
            </button>
            <span className="text-slate-500">•</span>
            {/* Secret Admin Nexus Access route trigger */}
            <button
              onClick={navigateToAdmin}
              className="text-slate-400 hover:text-rose-400 font-mono text-xs flex items-center gap-1 transition-colors"
              title="Secret Admin Route: ?admin=nexus"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Secret Admin Nexus Route</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
