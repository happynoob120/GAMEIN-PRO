import { useState } from 'react';
import { Tournament, UserProfile, BracketMatch } from '../types';
import { X, Trophy, Users, Calendar, Shield, Swords, CheckCircle2, MessageSquare, Edit3, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TournamentDetailModalProps {
  tournament: Tournament;
  currentUser: UserProfile | null;
  onClose: () => void;
  onJoinTournament: (tournamentId: string) => void;
  onUpdateBracketMatch?: (tournamentId: string, matchId: string, winnerName: string, scoreA: number, scoreB: number) => void;
  onUpdateStatus?: (tournamentId: string, newStatus: 'upcoming' | 'live' | 'completed', winnerName?: string) => void;
  onOpenChatWithTournament: (tournamentId: string, tournamentTitle: string) => void;
  onOpenTacticalScout: (tournamentTitle: string, game: string) => void;
  onChallengeRival?: (gamerTag: string) => void;
}

export default function TournamentDetailModal({
  tournament,
  currentUser,
  onClose,
  onJoinTournament,
  onUpdateBracketMatch,
  onUpdateStatus,
  onOpenChatWithTournament,
  onOpenTacticalScout,
  onChallengeRival
}: TournamentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'bracket' | 'rules' | 'participants'>('bracket');
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [scoreTeamA, setScoreTeamA] = useState<number>(2);
  const [scoreTeamB, setScoreTeamB] = useState<number>(1);
  const [selectedWinner, setSelectedWinner] = useState<string>('');

  const isHostOrAdmin = currentUser && (currentUser.userId === tournament.hostId || currentUser.role === 'admin');
  const isRegistered = currentUser && tournament.registeredPlayerIds?.includes(currentUser.userId);
  const isFull = tournament.currentParticipants >= tournament.maxParticipants;

  const handleJoin = () => {
    if (!currentUser) return;
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#22c55e', '#fbbf24']
    });
    onJoinTournament(tournament.id);
  };

  const handleSaveMatchResult = (match: BracketMatch) => {
    if (!onUpdateBracketMatch || !selectedWinner) return;
    onUpdateBracketMatch(tournament.id, match.id, selectedWinner, scoreTeamA, scoreTeamB);
    setEditingMatchId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" /> LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-1 rounded bg-sky-600 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" /> UPCOMING
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
          </span>
        );
      default:
        return null;
    }
  };

  // Group matches by round for bracket view
  const rounds: Record<number, BracketMatch[]> = {};
  if (tournament.bracket && tournament.bracket.length > 0) {
    tournament.bracket.forEach((match) => {
      if (!rounds[match.round]) rounds[match.round] = [];
      rounds[match.round].push(match);
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Banner header */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex-shrink-0 bg-slate-900">
          <img 
            src={tournament.gameBanner} 
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-600 transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on banner */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            {getStatusBadge(tournament.status)}
            <span className="px-2.5 py-1 rounded bg-slate-900 text-white border border-slate-600 text-xs font-mono font-bold uppercase">
              {tournament.game}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 text-purple-300 border border-slate-600 text-xs font-mono font-bold uppercase">
              {tournament.type}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-wide">
                {tournament.title}
              </h2>
              <p className="text-xs text-slate-200 font-medium flex items-center gap-3 mt-1">
                <span>Host: <strong className="text-sky-300">{tournament.host}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-sky-400" /> {tournament.startDate}</span>
              </p>
            </div>

            {/* Quick action buttons (Secondary Outlined) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenTacticalScout(tournament.title, tournament.game)}
                className="px-3 py-1.5 rounded-lg border border-purple-400 bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Scout</span>
              </button>

              <button
                onClick={() => onOpenChatWithTournament(tournament.id, tournament.title)}
                className="px-3 py-1.5 rounded-lg border border-sky-400 bg-sky-950/80 hover:bg-sky-900 text-sky-200 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Comms</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#1e293b] border-b border-slate-700 text-center font-mono text-xs">
          <div className="p-2 rounded bg-[#0f172a] border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Prize Pool</span>
            <span className="text-sm font-bold text-amber-300 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 fill-amber-400" /> {tournament.prizePool}
            </span>
          </div>
          <div className="p-2 rounded bg-[#0f172a] border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Format</span>
            <span className="text-sm font-bold text-white truncate block">
              {tournament.format}
            </span>
          </div>
          <div className="p-2 rounded bg-[#0f172a] border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Entry Fee</span>
            <span className="text-sm font-bold text-emerald-400">
              {tournament.entryFee}
            </span>
          </div>
          <div className="p-2 rounded bg-[#0f172a] border border-slate-700">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">Capacity</span>
            <span className="text-sm font-bold text-sky-300">
              {tournament.currentParticipants} / {tournament.maxParticipants}
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-700 px-4 bg-[#0f172a]">
          <button
            onClick={() => setActiveTab('bracket')}
            className={`py-3 px-4 text-xs font-bold font-heading uppercase border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'bracket'
                ? 'border-sky-400 text-sky-400 font-black'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" />
            Live Bracket
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`py-3 px-4 text-xs font-bold font-heading uppercase border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'participants'
                ? 'border-sky-400 text-sky-400 font-black'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Roster ({tournament.currentParticipants})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 text-xs font-bold font-heading uppercase border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-sky-400 text-sky-400 font-black'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Rules & Regulations
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'bracket' && (
            <div className="space-y-4">
              {tournament.winner && (
                <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500 text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <div>
                      <span className="text-xs uppercase font-mono block text-amber-400 font-semibold">Tournament Winner</span>
                      <strong className="text-lg font-heading font-black text-white">{tournament.winner}</strong>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">+500 Trophies Awarded</span>
                </div>
              )}

              {Object.keys(rounds).length > 0 ? (
                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
                  {Object.entries(rounds).map(([roundNum, matches]) => {
                    const roundTitle = Number(roundNum) === 1 ? 'Quarter-Finals' : Number(roundNum) === 2 ? 'Semi-Finals' : 'Grand Finals';

                    return (
                      <div key={roundNum} className="flex-1 min-w-[240px] space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                          <span className="text-xs font-bold text-sky-400 font-heading uppercase">
                            Round {roundNum} • {roundTitle}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {matches.map((match) => (
                            <div 
                              key={match.id}
                              className="bg-[#1e293b] border-2 border-slate-700 rounded-xl p-3.5 space-y-2 shadow-sm"
                            >
                              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                                <span>Match #{match.matchNumber}</span>
                                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                                  match.status === 'completed' ? 'text-emerald-300 bg-emerald-950 border border-emerald-500' : 'text-sky-300 bg-sky-950 border border-sky-500'
                                }`}>
                                  {match.status}
                                </span>
                              </div>

                              {/* Team A */}
                              <div className={`flex items-center justify-between p-2.5 rounded-lg ${
                                match.teamA.winner ? 'bg-sky-950 border border-sky-500 text-white font-bold' : 'bg-[#0f172a] text-slate-200'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {match.teamA.winner && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                                  <span className="text-xs font-semibold truncate max-w-[140px]">{match.teamA.name}</span>
                                </div>
                                <span className="font-mono font-bold text-xs">{match.teamA.score}</span>
                              </div>

                              {/* Team B */}
                              <div className={`flex items-center justify-between p-2.5 rounded-lg ${
                                match.teamB.winner ? 'bg-sky-950 border border-sky-500 text-white font-bold' : 'bg-[#0f172a] text-slate-200'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {match.teamB.winner && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                                  <span className="text-xs font-semibold truncate max-w-[140px]">{match.teamB.name}</span>
                                </div>
                                <span className="font-mono font-bold text-xs">{match.teamB.score}</span>
                              </div>

                              {/* Host / Admin match score updater */}
                              {isHostOrAdmin && (
                                <div className="pt-2 border-t border-slate-700">
                                  {editingMatchId === match.id ? (
                                    <div className="space-y-2 bg-[#0f172a] p-3 rounded-lg border border-sky-500">
                                      <span className="text-xs text-slate-300 uppercase font-mono block font-bold">Pick Winner:</span>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <button
                                          type="button"
                                          onClick={() => setSelectedWinner(match.teamA.name)}
                                          className={`p-2 rounded font-bold border truncate ${
                                            selectedWinner === match.teamA.name ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-800 text-slate-200 border-slate-600'
                                          }`}
                                        >
                                          {match.teamA.name}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSelectedWinner(match.teamB.name)}
                                          className={`p-2 rounded font-bold border truncate ${
                                            selectedWinner === match.teamB.name ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-800 text-slate-200 border-slate-600'
                                          }`}
                                        >
                                          {match.teamB.name}
                                        </button>
                                      </div>

                                      <div className="flex items-center justify-end gap-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={() => setEditingMatchId(null)}
                                          className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          disabled={!selectedWinner}
                                          onClick={() => handleSaveMatchResult(match)}
                                          className="px-3.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                                        >
                                          Confirm Score
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingMatchId(match.id);
                                        setSelectedWinner(match.teamA.winner ? match.teamA.name : match.teamB.winner ? match.teamB.name : match.teamA.name);
                                      }}
                                      className="w-full text-center text-xs font-mono text-sky-400 hover:text-sky-300 py-1 flex items-center justify-center gap-1.5 font-bold"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" /> Edit Match Score
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#1e293b] rounded-xl border border-slate-700">
                  <Swords className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-medium">Bracket will generate once registration completes and host starts tournament.</p>
                </div>
              )}

              {/* Host Status controller */}
              {isHostOrAdmin && onUpdateStatus && (
                <div className="p-4 rounded-xl bg-[#1e293b] border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-300 uppercase font-bold">
                    Host Admin Actions:
                  </span>
                  <div className="flex items-center gap-2">
                    {tournament.status === 'upcoming' && (
                      <button
                        onClick={() => onUpdateStatus(tournament.id, 'live')}
                        className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
                      >
                        Start Tournament (Go Live)
                      </button>
                    )}
                    {tournament.status === 'live' && (
                      <button
                        onClick={() => onUpdateStatus(tournament.id, 'completed', tournament.winner || 'ViperX_Pro')}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                      >
                        End & Declare Winner
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-bold">
                  Registered Competitors ({tournament.currentParticipants} of {tournament.maxParticipants})
                </span>
                <span className="text-xs text-sky-400 font-mono font-bold">
                  {tournament.maxParticipants - tournament.currentParticipants} Slots Open
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: tournament.currentParticipants }).map((_, idx) => {
                  const names = ['ViperX_Pro', 'ShadowBlade_99', 'NeonPulse_Valk', 'GhostRecon_Z', 'CyberPhoenix', 'TitanStrike', 'AeroZero', 'ZenithFragger'];
                  const gamerName = idx === 0 && currentUser && isRegistered ? (currentUser.gamerTag || currentUser.displayName) : names[idx % names.length];
                  const rank = idx === 0 ? 'Apex Predator' : idx % 2 === 0 ? 'Master' : 'Diamond';

                  return (
                    <div 
                      key={idx}
                      className="bg-[#1e293b] border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          #{idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white font-heading block">{gamerName}</span>
                          <span className="text-xs text-slate-300 font-mono">{rank}</span>
                        </div>
                      </div>

                      {onChallengeRival && (!currentUser || currentUser.gamerTag !== gamerName) && (
                        <button
                          type="button"
                          onClick={() => onChallengeRival(gamerName)}
                          className="px-2 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/50 text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                        >
                          <Swords className="w-3 h-3" />
                          <span>Rival</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <h4 className="text-sm font-bold text-white font-heading uppercase text-sky-400">Official Tournament Rules</h4>
              <p>{tournament.rules || 'Standard competitive esports rules apply. Check-in is required 15 minutes before the match start time.'}</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>Anti-cheat software must be running and verified prior to entering the lobby.</li>
                <li>Disconnects within the first 60 seconds of a round will trigger a remake.</li>
                <li>All participant disputes must be submitted to the host via Live Comms within 5 minutes of match conclusion.</li>
                <li>Winners will receive their trophy distribution and XP directly on GameIn Pro.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer: EXACTLY ONE PRIMARY ACTION BUTTON */}
        <div className="p-4 bg-[#1e293b] border-t-2 border-slate-700 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300 font-medium">
            {isRegistered ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Registered for this tournament
              </span>
            ) : isFull ? (
              <span className="text-rose-400 font-bold">Tournament is at maximum capacity</span>
            ) : (
              <span>Registration open • Free tournament entry</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-200 text-xs font-bold uppercase transition-colors"
            >
              Close
            </button>

            {!isRegistered && !isFull && (
              <button
                onClick={handleJoin}
                className="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-md"
              >
                Join Tournament
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
