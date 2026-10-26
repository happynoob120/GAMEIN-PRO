import { useState } from 'react';
import { Tournament, BracketMatch, UserProfile } from '../types';
import { X, Plus, Trophy } from 'lucide-react';

interface TournamentCreateModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onCreateTournament: (tournament: Omit<Tournament, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const POPULAR_GAMES = [
  { name: 'Marvel Rivals', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80' },
  { name: 'Valorant', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80' },
  { name: 'Apex Legends', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80' },
  { name: 'Counter-Strike 2', banner: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80' },
  { name: 'Fortnite', banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Rocket League', banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' },
  { name: 'Overwatch 2', banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop&q=80' },
];

export default function TournamentCreateModal({
  currentUser,
  onClose,
  onCreateTournament
}: TournamentCreateModalProps) {
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Valorant');
  const [host, setHost] = useState(currentUser?.displayName || 'GameIn Pro Esports');
  const [type, setType] = useState<'Single Elimination' | 'Double Elimination' | 'Battle Royale Points' | 'Round Robin'>('Single Elimination');
  const [format, setFormat] = useState('5v5 Competitive');
  const [prizePool, setPrizePool] = useState('$2,500 USD + 500 Trophies');
  const [entryFee, setEntryFee] = useState('Free');
  const [maxParticipants, setMaxParticipants] = useState<number>(16);
  const [startDate, setStartDate] = useState('Tomorrow, 6:00 PM EST');
  const [description, setDescription] = useState('Official community championship open to verified players.');
  const [rules, setRules] = useState('Standard esports bracket rules. Double check-in 15m prior to start.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const gameObj = POPULAR_GAMES.find(g => g.name === game) || POPULAR_GAMES[0];

    // Build initial bracket for the tournament
    const initialBracket: BracketMatch[] = [
      {
        id: 'm1',
        round: 1,
        matchNumber: 1,
        teamA: { name: 'Alpha Squad', score: 0 },
        teamB: { name: 'Vortex Legion', score: 0 },
        status: 'pending'
      },
      {
        id: 'm2',
        round: 1,
        matchNumber: 2,
        teamA: { name: 'Cyber Titans', score: 0 },
        teamB: { name: 'Neon Phantoms', score: 0 },
        status: 'pending'
      },
      {
        id: 'm3',
        round: 1,
        matchNumber: 3,
        teamA: { name: 'Shadow Clan', score: 0 },
        teamB: { name: 'Apex Strikers', score: 0 },
        status: 'pending'
      },
      {
        id: 'm4',
        round: 1,
        matchNumber: 4,
        teamA: { name: 'Iron Wolves', score: 0 },
        teamB: { name: 'Phoenix Reborn', score: 0 },
        status: 'pending'
      },
      {
        id: 'm5',
        round: 2,
        matchNumber: 5,
        teamA: { name: 'Winner M1', score: 0 },
        teamB: { name: 'Winner M2', score: 0 },
        status: 'pending'
      },
      {
        id: 'm6',
        round: 2,
        matchNumber: 6,
        teamA: { name: 'Winner M3', score: 0 },
        teamB: { name: 'Winner M4', score: 0 },
        status: 'pending'
      },
      {
        id: 'm7',
        round: 3,
        matchNumber: 7,
        teamA: { name: 'Grand Finalist A', score: 0 },
        teamB: { name: 'Grand Finalist B', score: 0 },
        status: 'pending'
      }
    ];

    onCreateTournament({
      title,
      game,
      host,
      hostId: currentUser?.userId || 'admin',
      type,
      format,
      prizePool,
      entryFee,
      maxParticipants,
      currentParticipants: 8,
      registeredPlayerIds: currentUser ? [currentUser.userId] : [],
      status: 'upcoming',
      startDate,
      description,
      rules,
      gameBanner: gameObj.banner,
      bracket: initialBracket,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                CREATE ESPORTS TOURNAMENT
              </h3>
              <p className="text-xs text-slate-300 font-medium">List tournament format, rules, schedule, and brackets</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Tournament Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
              Tournament Title *
            </label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Nexus Winter Invitational"
              className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>

          {/* Game Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Esports Game *
              </label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400 font-medium"
              >
                {POPULAR_GAMES.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Host Organization *
              </label>
              <input 
                type="text"
                required
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="e.g. Cloud9 Academy / ESL Gaming"
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
              />
            </div>
          </div>

          {/* Type and Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Tournament Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400 font-medium"
              >
                <option value="Single Elimination">Single Elimination (Bracket)</option>
                <option value="Double Elimination">Double Elimination</option>
                <option value="Battle Royale Points">Battle Royale Points</option>
                <option value="Round Robin">Round Robin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Match Format *
              </label>
              <input 
                type="text"
                required
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="e.g. 5v5 Best of 3 / Trios BR"
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
              />
            </div>
          </div>

          {/* Prize pool & Entry Fee & Max Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Prize Pool *
              </label>
              <input 
                type="text"
                required
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="e.g. $1,000 USD + 300 Trophies"
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Entry Fee
              </label>
              <input 
                type="text"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="e.g. Free"
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Max Participants
              </label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400 font-medium"
              >
                <option value={8}>8 Teams</option>
                <option value={16}>16 Teams</option>
                <option value={32}>32 Teams</option>
                <option value={64}>64 Teams</option>
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
              Schedule / Start Time *
            </label>
            <input 
              type="text"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="e.g. Saturday, Nov 2nd @ 7:00 PM EST"
              className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
              Description
            </label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>

          {/* Rules */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
              Rules & Guidelines
            </label>
            <textarea 
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>

          {/* Action buttons: Single Primary High-Contrast Button */}
          <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-200 text-xs font-bold uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Publish Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
