import { useState } from 'react';
import { X, Sparkles, BrainCircuit, Swords, Bot, Check, Copy } from 'lucide-react';

interface AITacticalScoutModalProps {
  onClose: () => void;
  initialGame?: string;
  initialTopic?: string;
}

export default function AITacticalScoutModal({
  onClose,
  initialGame = 'Valorant',
  initialTopic = ''
}: AITacticalScoutModalProps) {
  const [game, setGame] = useState(initialGame);
  const [topic, setTopic] = useState(initialTopic || 'How to counter fast retakes on Haven Site A in tournament playoffs');
  const [rank, setRank] = useState('Apex / Master Tier');
  const [playstyle, setPlaystyle] = useState('Entry Fragger / IGL');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateTactics = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/tactics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          topic,
          rank,
          playstyle
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tactical advice');
      }

      setAnalysisResult(data.advice);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please check network.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                GEMINI TACTICAL SCOUT
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500 text-purple-300 font-bold">
                  gemini-3.8-flash
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">Esports coaching, team loadouts, and bracket counter-strategies</p>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm">
          {/* Query Config Form */}
          <form onSubmit={handleGenerateTactics} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                  Game
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-purple-400 font-medium text-xs"
                >
                  <option value="Valorant">Valorant</option>
                  <option value="Apex Legends">Apex Legends</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                  <option value="Fortnite">Fortnite</option>
                  <option value="Rocket League">Rocket League</option>
                  <option value="Overwatch 2">Overwatch 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                  Rank Tier
                </label>
                <input 
                  type="text"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-purple-400 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                  Playstyle
                </label>
                <input 
                  type="text"
                  value={playstyle}
                  onChange={(e) => setPlaystyle(e.target.value)}
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-purple-400 font-medium text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold">
                Tactical Scenario or Question *
              </label>
              <textarea 
                rows={2}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ask about map executes, agent comps, or bracket strategies..."
                className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 font-medium text-xs sm:text-sm"
              />
            </div>

            {/* SINGLE Primary Action Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-medium">
                Grounded on esports meta & tournament data
              </span>

              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="px-6 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase font-heading flex items-center gap-2 transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <BrainCircuit className="w-4 h-4 animate-spin" />
                    <span>Analyzing Meta...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Strategy</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500 text-rose-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* AI Result View */}
          {analysisResult && (
            <div className="bg-[#1e293b] border border-purple-500/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-mono uppercase text-purple-300 font-bold flex items-center gap-1.5">
                  <Swords className="w-4 h-4" /> Tactical Intel Briefing
                </span>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs flex items-center gap-1.5 transition-colors font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Comms'}</span>
                </button>
              </div>

              <div className="text-slate-100 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium">
                {analysisResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
