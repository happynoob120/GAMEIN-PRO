export interface UserProfile {
  userId: string;
  realName?: string;
  gamerTag: string; // Must always be unique
  displayName: string;
  email: string;
  photoURL: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  trophies: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Apex Predator';
  role: 'gamer' | 'admin';
  bio: string;
  proGames?: string[]; // Games the player is pro in (Marvel Rivals, Valorant, etc.)
  primaryGame?: string;
  playstyle?: string;
  rivals?: string[]; // Gamer tags marked as rivals
  isBanned?: boolean;
  matchesPlayed: number;
  wins: number;
  kdRatio: string;
  badges: string[];
  recentMatches: MatchHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchHistoryItem {
  id: string;
  game: string;
  mode: string;
  result: 'VICTORY' | 'DEFEAT' | 'TOP 3';
  score: string;
  kills: number;
  xpEarned: number;
  trophiesEarned: number;
  timestamp: string;
}

export interface RivalDuel {
  id: string;
  challengerId: string;
  challengerTag: string;
  rivalId: string;
  rivalTag: string;
  game: string;
  wagerTrophies: number;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  winnerTag?: string;
  score?: string;
  createdAt: string;
}

export interface BracketMatch {
  id: string;
  round: number;
  matchNumber: number;
  teamA: {
    name: string;
    score: number;
    winner?: boolean;
    seed?: number;
  };
  teamB: {
    name: string;
    score: number;
    winner?: boolean;
    seed?: number;
  };
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  host: string;
  hostId: string;
  type: 'Single Elimination' | 'Double Elimination' | 'Battle Royale Points' | 'Round Robin';
  format: string;
  prizePool: string;
  entryFee: string;
  maxParticipants: number;
  currentParticipants: number;
  registeredPlayerIds: string[];
  status: 'upcoming' | 'live' | 'completed';
  startDate: string;
  description: string;
  rules: string;
  gameBanner: string;
  bracket?: BracketMatch[];
  winner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  userRole?: 'gamer' | 'admin';
  text: string;
  channelId: string;
  createdAt: string;
  reactions?: Record<string, number>;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  xpReward: number;
  trophyReward: number;
  completed: boolean;
  claimed: boolean;
  category: 'match' | 'chat' | 'reflex' | 'scout';
  iconName: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  goalProgress: number;
  unit: string;
  reward: string;
  daysLeft: number;
  participantsCount: number;
  status: 'active' | 'completed';
}
