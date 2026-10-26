import { X, Code2, Database, ShieldCheck, Cpu, Layout, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutTechModalProps {
  onClose: () => void;
}

export default function AboutTechModal({ onClose }: AboutTechModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                HOW GAMEIN PRO IS BUILT
              </h3>
              <p className="text-xs text-slate-300 font-medium">Architecture, Firebase integration, and AI system overview</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm text-slate-200">
          {/* Tech 1: Frontend */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold font-heading">
              <Layout className="w-4 h-4" />
              <span>1. Modern React 19 & Accessible Design</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built on <strong>React 19 with TypeScript</strong> and styled with <strong>Tailwind CSS</strong>. Adheres strictly to WCAG 2.1 AA accessibility guidelines with contrast ratios exceeding 4.5:1. Heavy background GPU canvas effects have been removed so the entire platform runs smoothly on phones, tablets, and budget hardware.
            </p>
          </div>

          {/* Tech 2: Firebase Auth & Cloud Firestore */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading">
              <Database className="w-4 h-4" />
              <span>2. Firebase Auth & Real-Time Cloud Firestore</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time persistent data is powered by <strong>Google Cloud Firestore</strong> (<code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 text-[11px]">ai-studio-dd1eb0e7-8851-4ddc-a7cb-fdf2d5ccd540</code>). 
              Real-time listeners (<code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 text-[11px]">onSnapshot</code>) synchronize participant chat, tournament brackets, and leaderboard XP instantly. User identification uses <strong>Google Sign-In via Firebase Authentication</strong> (<code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300 text-[11px]">signInWithPopup</code>).
            </p>
          </div>

          {/* Tech 3: Security Rules */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-heading">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Hardened Firestore Security Rules</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The database is guarded by enterprise-grade <strong>Attribute-Based Access Control (ABAC)</strong> rules deployed in <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 text-[11px]">firestore.rules</code>. These prevent identity spoofing, restrict admin actions (e.g. tournament publishing and score overrides), and validate maximum payload sizes.
            </p>
          </div>

          {/* Tech 4: Gemini 3.8 Flash AI */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold font-heading">
              <Sparkles className="w-4 h-4" />
              <span>4. Gemini 3.8 Flash Tactical AI</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The <strong>Gemini AI Tactical Scout</strong> is powered by <code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300 text-[11px]">models/gemini-3.8-flash</code> using the official <strong>@google/genai</strong> SDK. Calls are made securely through Node.js server routes (<code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300 text-[11px]">/api/ai/tactics</code> and <code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300 text-[11px]">/api/ai/scout</code>) without ever exposing the private API key to the client browser.
            </p>
          </div>

          {/* Tech 5: UI & Usability Principles */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-heading">
              <CheckCircle2 className="w-4 h-4" />
              <span>5. Accessibility & Mobile Optimization Checklist</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Strict spacing:</strong> Consistent margins and padding preventing overlap on mobile viewports.</li>
              <li><strong>High contrast:</strong> Minimum 4.5:1 text-to-background contrast ratio everywhere.</li>
              <li><strong>Single primary action:</strong> Clear visual hierarchy per view (primary solid buttons vs clean outlined secondary links).</li>
              <li><strong>Essential data visible:</strong> Critical stats, host names, prizes, and rules are immediately visible without hidden hover triggers.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1e293b] border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
