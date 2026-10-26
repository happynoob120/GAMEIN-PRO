import { Trophy, Award, Crown, Shield } from 'lucide-react';

interface TrophyShowcaseProps {
  trophiesCount?: number;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Apex Predator';
}

export default function TrophyShowcase({ trophiesCount = 850, tier = 'Gold' }: TrophyShowcaseProps) {
  const getTheme = () => {
    switch (tier) {
      case 'Apex Predator':
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500',
          text: 'text-rose-400',
          badge: 'bg-rose-500 text-black',
          sub: 'Apex Division',
          iconColor: 'text-rose-400 fill-rose-500/20',
        };
      case 'Master':
        return {
          bg: 'bg-purple-950/40',
          border: 'border-purple-500',
          text: 'text-purple-300',
          badge: 'bg-purple-500 text-black',
          sub: 'Elite Division',
          iconColor: 'text-purple-400 fill-purple-500/20',
        };
      case 'Diamond':
        return {
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-500',
          text: 'text-cyan-300',
          badge: 'bg-cyan-400 text-black',
          sub: 'Diamond Tier',
          iconColor: 'text-cyan-400 fill-cyan-500/20',
        };
      case 'Platinum':
        return {
          bg: 'bg-teal-950/40',
          border: 'border-teal-500',
          text: 'text-teal-300',
          badge: 'bg-teal-400 text-black',
          sub: 'Platinum Tier',
          iconColor: 'text-teal-400 fill-teal-500/20',
        };
      case 'Silver':
        return {
          bg: 'bg-slate-900',
          border: 'border-slate-400',
          text: 'text-slate-200',
          badge: 'bg-slate-300 text-black',
          sub: 'Silver Tier',
          iconColor: 'text-slate-300 fill-slate-400/20',
        };
      case 'Bronze':
        return {
          bg: 'bg-orange-950/40',
          border: 'border-orange-600',
          text: 'text-orange-300',
          badge: 'bg-orange-500 text-black',
          sub: 'Bronze Tier',
          iconColor: 'text-orange-400 fill-orange-500/20',
        };
      case 'Gold':
      default:
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500',
          text: 'text-amber-300',
          badge: 'bg-amber-400 text-black',
          sub: 'Gold Tier Champion',
          iconColor: 'text-amber-400 fill-amber-500/20',
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`w-full p-5 rounded-xl border-2 ${theme.border} ${theme.bg} flex flex-col items-center justify-center text-center space-y-3`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-md">
          <Trophy className={`w-8 h-8 ${theme.iconColor}`} />
        </div>
        <div className="absolute -top-1 -right-1">
          <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
        </div>
      </div>

      <div>
        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${theme.badge}`}>
          {tier} Rank
        </span>
        <h4 className="text-xl font-bold font-mono text-white mt-1.5">
          {trophiesCount.toLocaleString()} <span className="text-sm font-sans text-slate-300 font-semibold">Trophies</span>
        </h4>
        <p className="text-xs text-slate-300 mt-0.5 font-sans font-medium">
          {theme.sub}
        </p>
      </div>
    </div>
  );
}
