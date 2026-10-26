import { useState, useRef, useEffect } from 'react';
import { Zap, Crosshair, Award, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReflexLabProps {
  onReflexComplete?: (scoreMs: number) => void;
  userBestMs?: number;
}

type LabState = 'idle' | 'waiting' | 'ready' | 'too_early' | 'result';

export default function ReflexLab({ onReflexComplete, userBestMs = 240 }: ReflexLabProps) {
  const [labState, setLabState] = useState<LabState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number>(userBestMs);
  const [streak, setStreak] = useState<number>(0);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const startTimeRef = useRef<number>(0);
  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setLabState('waiting');
    setReactionTime(null);

    const randX = Math.floor(Math.random() * 50) + 25;
    const randY = Math.floor(Math.random() * 50) + 25;
    setTargetPos({ x: randX, y: randY });

    const delay = Math.floor(Math.random() * 2000) + 1200;

    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    timerTimeoutRef.current = setTimeout(() => {
      setLabState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleContainerClick = () => {
    if (labState === 'waiting') {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      setLabState('too_early');
      setStreak(0);
    } else if (labState === 'idle') {
      startTest();
    }
  };

  const handleTargetHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (labState === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setLabState('result');

      const isNewBest = elapsed < bestTime;
      if (isNewBest) {
        setBestTime(elapsed);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#22c55e', '#fbbf24']
        });
      }

      setStreak(prev => prev + 1);

      if (onReflexComplete) {
        onReflexComplete(elapsed);
      }
    }
  };

  const getTierLabel = (ms: number) => {
    if (ms < 190) return { label: 'GODLIKE REFLEXES', color: 'text-amber-300', badge: 'Top 0.1%' };
    if (ms < 230) return { label: 'PRO GAMER TIER', color: 'text-sky-300', badge: 'Top 1%' };
    if (ms < 280) return { label: 'COMPETITIVE TIER', color: 'text-emerald-300', badge: 'Top 10%' };
    if (ms < 350) return { label: 'CHALLENGER TIER', color: 'text-purple-300', badge: 'Top 35%' };
    return { label: 'CASUAL REFLEX', color: 'text-slate-200', badge: 'Warming Up' };
  };

  return (
    <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              PRO REFLEX SPEED DRILL
            </h3>
            <p className="text-xs text-slate-300 font-medium">Test latency reflexes for daily quest completion & XP rewards</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Personal Record</span>
            <span className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" /> {bestTime}ms
            </span>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded bg-rose-950/60 border border-rose-500 text-rose-300 text-xs font-bold font-mono">
              <Flame className="w-4 h-4 fill-rose-500" /> {streak} Streak
            </div>
          )}
        </div>
      </div>

      {/* Interactive Arena with Guaranteed Contrast */}
      <div 
        onClick={handleContainerClick}
        className={`w-full h-64 rounded-xl border-2 relative flex flex-col items-center justify-center cursor-pointer transition-colors select-none ${
          labState === 'waiting'
            ? 'bg-rose-950/40 border-rose-500'
            : labState === 'ready'
            ? 'bg-emerald-950/60 border-emerald-400 shadow-lg'
            : labState === 'too_early'
            ? 'bg-rose-900/40 border-rose-500'
            : 'bg-[#1e293b] border-slate-700 hover:border-slate-500'
        }`}
      >
        {labState === 'idle' && (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center mx-auto shadow-sm">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <p className="text-lg font-bold text-white uppercase font-heading">Click Here To Start Reflex Test</p>
            <p className="text-xs text-slate-300 max-w-sm mx-auto font-medium">When the arena turns green and target flashes, click it as quickly as possible!</p>
          </div>
        )}

        {labState === 'waiting' && (
          <div className="text-center p-6 space-y-2">
            <p className="text-xl font-bold text-rose-300 font-heading tracking-wider">WAIT FOR GREEN...</p>
            <p className="text-xs text-rose-200 font-medium">Clicking now will count as an early fault</p>
          </div>
        )}

        {labState === 'ready' && (
          <button
            onClick={handleTargetHit}
            style={{
              position: 'absolute',
              left: `${targetPos.x}%`,
              top: `${targetPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="w-16 h-16 rounded-full bg-emerald-400 border-4 border-white shadow-xl flex items-center justify-center cursor-crosshair active:scale-95 transition-transform"
            aria-label="Click Target"
          >
            <Crosshair className="w-8 h-8 text-black stroke-[3]" />
          </button>
        )}

        {labState === 'too_early' && (
          <div className="text-center p-6 space-y-3">
            <p className="text-xl font-bold text-rose-300 font-heading">CLICKED TOO EARLY!</p>
            <p className="text-xs text-slate-200">You pressed before the target turned green.</p>
            <button
              onClick={(e) => { e.stopPropagation(); startTest(); }}
              className="mt-2 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {labState === 'result' && reactionTime !== null && (
          <div className="text-center p-6 space-y-3">
            <span className="text-5xl font-black text-white font-mono tracking-tight block">
              {reactionTime} <span className="text-xl text-sky-400 font-sans font-bold">ms</span>
            </span>

            <div className="flex items-center justify-center gap-2">
              <span className={`text-sm font-bold uppercase font-heading ${getTierLabel(reactionTime).color}`}>
                {getTierLabel(reactionTime).label}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-600">
                {getTierLabel(reactionTime).badge}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={(e) => { e.stopPropagation(); startTest(); }}
                className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-heading uppercase tracking-wider flex items-center gap-1.5 mx-auto transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Retest Reflex
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info with High Contrast */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 font-medium gap-2 pt-2">
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-sky-400" /> Quest target: Achieve at least one reaction under 280ms
        </span>
        <span className="text-slate-400">Human average: ~250ms | Pro esports: ~170-200ms</span>
      </div>
    </div>
  );
}
