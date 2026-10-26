import { useState } from 'react';
import { DailyQuest, CommunityChallenge, UserProfile } from '../types';
import { CheckCircle2, Clock, Flame, Gift, Sparkles, Trophy, Zap, Crosshair, MessageSquare, Target, Users, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyQuestsSectionProps {
  currentUser: UserProfile | null;
  onClaimQuest: (questId: string, xpReward: number, trophyReward: number) => void;
  onOpenReflexLab: () => void;
  onOpenChat: () => void;
  onOpenTactics: () => void;
  onOpenTournaments: () => void;
}

export default function DailyQuestsSection({
  currentUser,
  onClaimQuest,
  onOpenReflexLab,
  onOpenChat,
  onOpenTactics,
  onOpenTournaments
}: DailyQuestsSectionProps) {
  const [quests, setQuests] = useState<DailyQuest[]>([
    {
      id: 'quest-reflex',
      title: 'Reflex Speed Drill',
      description: 'Clock under 280ms in the Pro Reflex Lab to warm up your mechanical latency.',
      progress: 1,
      target: 1,
      unit: 'reflex test',
      xpReward: 300,
      trophyReward: 20,
      completed: true,
      claimed: false,
      category: 'reflex',
      iconName: 'crosshair',
    },
    {
      id: 'quest-chat',
      title: 'Tactical Comms Callouts',
      description: 'Post at least 3 messages or GG reactions in the Tournament Live Comms.',
      progress: 3,
      target: 3,
      unit: 'messages',
      xpReward: 200,
      trophyReward: 10,
      completed: true,
      claimed: false,
      category: 'chat',
      iconName: 'message',
    },
    {
      id: 'quest-scout',
      title: 'Tactical Match Scouting',
      description: 'Generate 1 AI Strategy or Map Counter-Pick analysis using the Gemini Tactical Scout.',
      progress: 0,
      target: 1,
      unit: 'scout report',
      xpReward: 250,
      trophyReward: 15,
      completed: false,
      claimed: false,
      category: 'scout',
      iconName: 'sparkles',
    },
    {
      id: 'quest-tournament',
      title: 'Tournament Contender',
      description: 'Register for or advance in an active competitive esports tournament.',
      progress: 1,
      target: 1,
      unit: 'bracket match',
      xpReward: 450,
      trophyReward: 35,
      completed: true,
      claimed: false,
      category: 'match',
      iconName: 'trophy',
    },
  ]);

  const communityChallenges: CommunityChallenge[] = [
    {
      id: 'comm-1',
      title: 'Operation Headhunter: Global Frag Fest',
      description: 'All GameIn Pro players unite to eliminate 50,000 opponents across scrims and brackets.',
      currentProgress: 36420,
      goalProgress: 50000,
      unit: 'Frags',
      reward: '+1,500 XP & Limited "Skull Reaper" Badge',
      daysLeft: 2,
      participantsCount: 4210,
      status: 'active'
    },
    {
      id: 'comm-2',
      title: 'Bracket Blitz: 500 Completed Tournaments',
      description: 'Community milestone for successfully completed tournament brackets this month.',
      currentProgress: 412,
      goalProgress: 500,
      unit: 'Tournaments',
      reward: '+1,000 XP & 100 Trophies to all participants',
      daysLeft: 5,
      participantsCount: 2890,
      status: 'active'
    }
  ];

  const handleClaim = (quest: DailyQuest) => {
    if (!quest.completed || quest.claimed) return;

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fbbf24', '#22c55e']
    });

    setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, claimed: true } : q));
    onClaimQuest(quest.id, quest.xpReward, quest.trophyReward);
  };

  const getActionForQuest = (category: string) => {
    switch (category) {
      case 'reflex': return { label: 'Go to Reflex Lab', action: onOpenReflexLab };
      case 'chat': return { label: 'Open Live Comms', action: onOpenChat };
      case 'scout': return { label: 'Ask Tactical AI', action: onOpenTactics };
      case 'match': return { label: 'View Tournaments', action: onOpenTournaments };
      default: return { label: 'Inspect', action: () => {} };
    }
  };

  return (
    <div className="space-y-8">
      {/* Leveling Mechanics Explainer Card */}
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white font-heading">
                LEVEL & TROPHY SYSTEM
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-medium">
              Earn XP and level up your Pro Gamer card through <strong className="text-sky-300">Tournament Victories</strong>, <strong className="text-amber-300">Daily Quests</strong>, <strong className="text-emerald-300">Reflex Drills</strong>, and <strong className="text-purple-300">Community Challenges</strong>.
            </p>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-4 bg-[#1e293b] border border-slate-700 rounded-xl p-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-sky-500 text-slate-950 flex flex-col items-center justify-center font-bold">
                <span className="text-[10px] font-mono leading-none">LVL</span>
                <span className="text-lg font-black font-mono leading-none">{currentUser.level}</span>
              </div>
              <div className="space-y-1.5 min-w-[150px]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300 font-mono">XP Progress</span>
                  <span className="text-sky-300 font-mono">{currentUser.xp} / {currentUser.nextLevelXp}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round((currentUser.xp / currentUser.nextLevelXp) * 100))}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono block">
                  {currentUser.nextLevelXp - currentUser.xp} XP to LVL {currentUser.level + 1}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs text-sky-300 font-medium">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Sign in to earn XP and level up
            </div>
          )}
        </div>
      </div>

      {/* Daily Quests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white font-heading">
              DAILY ESPORTS QUESTS
            </h3>
          </div>
          <span className="text-xs text-slate-300 font-mono font-semibold flex items-center gap-1">
            <Clock className="w-4 h-4 text-sky-400" /> Resets in 08:42:19
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((quest) => {
            const isCompleted = quest.completed || quest.progress >= quest.target;
            const isClaimed = quest.claimed;

            return (
              <div 
                key={quest.id}
                className={`bg-[#0f172a] border-2 rounded-xl p-5 flex flex-col justify-between space-y-4 ${
                  isClaimed 
                    ? 'border-slate-800 opacity-60' 
                    : isCompleted 
                    ? 'border-emerald-500 bg-[#0f241a]/30'
                    : 'border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${
                        isCompleted 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                          : 'bg-sky-500/20 border-sky-500 text-sky-400'
                      }`}>
                        {quest.category === 'reflex' && <Crosshair className="w-5 h-5" />}
                        {quest.category === 'chat' && <MessageSquare className="w-5 h-5" />}
                        {quest.category === 'scout' && <Sparkles className="w-5 h-5" />}
                        {quest.category === 'match' && <Trophy className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-heading">
                          {quest.title}
                        </h4>
                        <span className="text-xs text-slate-300 font-mono font-medium">
                          {quest.progress} / {quest.target} {quest.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-600 text-sky-300 font-bold">
                        +{quest.xpReward} XP
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-600 text-amber-300 font-bold">
                        +{quest.trophyReward} Trophies
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-2">
                    {quest.description}
                  </p>
                </div>

                {/* Progress bar and single action button */}
                <div className="pt-3 border-t border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? 'bg-emerald-400' : 'bg-sky-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((quest.progress / quest.target) * 100))}%` }}
                    />
                  </div>

                  {isClaimed ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Claimed
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest)}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-heading uppercase tracking-wide transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Gift className="w-4 h-4" /> Claim Reward
                    </button>
                  ) : (
                    <button
                      onClick={getActionForQuest(quest.category).action}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-600 hover:border-slate-400 bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>{getActionForQuest(quest.category).label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-black text-white font-heading">
            COMMUNITY CHALLENGES
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityChallenges.map((challenge) => {
            const percentage = Math.round((challenge.currentProgress / challenge.goalProgress) * 100);

            return (
              <div 
                key={challenge.id}
                className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500 text-purple-300 font-bold uppercase">
                      Global Event
                    </span>
                    <span className="text-slate-300 font-mono font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" /> {challenge.daysLeft} days remaining
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white font-heading">
                    {challenge.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                    {challenge.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-medium">Contribution</span>
                      <span className="text-purple-300 font-bold">
                        {challenge.currentProgress.toLocaleString()} / {challenge.goalProgress.toLocaleString()} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                      <div 
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>{challenge.participantsCount.toLocaleString()} Gamers Active</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Reward</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {challenge.reward}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
