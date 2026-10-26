import { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { 
  X, 
  Shield, 
  ArrowRight, 
  Swords, 
  Gamepad2, 
  Check, 
  User, 
  AtSign, 
  Lock, 
  Mail, 
  Flame,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

const AVAILABLE_PRO_GAMES = [
  'Marvel Rivals',
  'Valorant',
  'Counter-Strike 2',
  'Apex Legends',
  'Overwatch 2',
  'Fortnite',
  'Tekken 8',
  'Rocket League'
];

const PLAYSTYLES = [
  'Duelist / Entry Fragger',
  'Vanguard / Dive Tank',
  'Sniper / Long-Range Recon',
  'In-Game Leader / Strategist',
  'Support / Flex Anchor'
];

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [realName, setRealName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProGames, setSelectedProGames] = useState<string[]>(['Marvel Rivals', 'Valorant']);
  const [primaryGame, setPrimaryGame] = useState('Marvel Rivals');
  const [playstyle, setPlaystyle] = useState('Duelist / Entry Fragger');
  const [initialRival, setInitialRival] = useState('');

  // Handle toggling pro game selection
  const toggleProGame = (game: string) => {
    setSelectedProGames(prev => 
      prev.includes(game) 
        ? prev.filter(g => g !== game)
        : [...prev, game]
    );
  };

  // Sign Up with Real Name, Unique Gamer Handle, Password, and Profile Customization
  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const cleanTag = gamerTag.trim().replace(/^@/, '');
    const cleanRealName = realName.trim();
    const cleanEmail = email.trim();

    if (!cleanRealName) {
      setError('Please provide your Real Name.');
      setIsLoading(false);
      return;
    }

    if (!cleanTag || cleanTag.length < 3) {
      setError('Gamer handle must be at least 3 characters long.');
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cleanTag)) {
      setError('Gamer handle can only contain letters, numbers, underscores, and dashes.');
      setIsLoading(false);
      return;
    }

    if (!cleanEmail || !password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Check if gamer handle is globally unique
      const handleDocRef = doc(db, 'handles', cleanTag.toLowerCase());
      try {
        const handleSnap = await getDoc(handleDocRef);
        if (handleSnap.exists()) {
          setError(`Gamer handle "@${cleanTag}" is already taken by another pro gamer. Please choose a unique handle.`);
          setIsLoading(false);
          return;
        }
      } catch (checkErr) {
        console.warn('Handle uniqueness check lookup warning:', checkErr);
      }

      // Step 2: Create Firebase Auth Account
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCred.user;

      await updateProfile(fbUser, {
        displayName: cleanTag,
      });

      // Step 3: Reserve handle in Firestore
      try {
        await setDoc(handleDocRef, {
          userId: fbUser.uid,
          gamerTag: cleanTag,
          claimedAt: new Date().toISOString(),
        });
      } catch (reserveErr) {
        console.warn('Handle reservation document warning:', reserveErr);
      }

      // Step 4: Build complete user profile
      const rivalsList: string[] = [];
      if (initialRival.trim()) {
        rivalsList.push(initialRival.trim().replace(/^@/, ''));
      }

      const newProfile: UserProfile = {
        userId: fbUser.uid,
        realName: cleanRealName,
        gamerTag: cleanTag,
        displayName: cleanTag,
        email: cleanEmail,
        photoURL: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
        level: 1,
        xp: 250,
        nextLevelXp: 1500,
        trophies: 100,
        rank: 'Bronze',
        role: cleanEmail === 'ekagrkhannaind120@gmail.com' ? 'admin' : 'gamer',
        bio: `Pro gamer in ${selectedProGames.slice(0, 2).join(' & ')}. Ready for rival duels and bracket scrims.`,
        proGames: selectedProGames.length > 0 ? selectedProGames : ['Marvel Rivals'],
        primaryGame: primaryGame || selectedProGames[0] || 'Marvel Rivals',
        playstyle: playstyle || 'Duelist / Entry Fragger',
        rivals: rivalsList,
        matchesPlayed: 1,
        wins: 1,
        kdRatio: '2.40',
        badges: ['Pro Registered', 'Rivals Challenger'],
        recentMatches: [
          {
            id: `m-${Date.now()}`,
            game: primaryGame || 'Marvel Rivals',
            mode: 'Placement Duel',
            result: 'VICTORY',
            score: 'First Blood',
            kills: 14,
            xpEarned: 250,
            trophiesEarned: 100,
            timestamp: 'Just now'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user profile in Firestore
      try {
        await setDoc(doc(db, 'users', fbUser.uid), newProfile);
      } catch (setErr) {
        console.warn('Firestore set user profile warning:', setErr);
      }

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      onAuthSuccess(newProfile);
      onClose();
    } catch (err: unknown) {
      console.error('Sign up error:', err);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please switch to Sign In.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In with Email and Password
  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCred.user;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      let profile: UserProfile;
      if (userSnap.exists()) {
        profile = userSnap.data() as UserProfile;
      } else {
        profile = {
          userId: fbUser.uid,
          gamerTag: fbUser.displayName || 'ProGamer',
          displayName: fbUser.displayName || 'Pro Gamer',
          email: fbUser.email || email,
          photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          level: 10,
          xp: 4500,
          nextLevelXp: 11000,
          trophies: 540,
          rank: 'Gold',
          role: fbUser.email === 'ekagrkhannaind120@gmail.com' ? 'admin' : 'gamer',
          bio: 'Competitive esports gamer on GameIn Pro.',
          proGames: ['Marvel Rivals', 'Valorant'],
          primaryGame: 'Marvel Rivals',
          playstyle: 'Duelist / Entry Fragger',
          rivals: [],
          matchesPlayed: 25,
          wins: 18,
          kdRatio: '2.10',
          badges: ['Verified Gamer', 'Rivals Contender'],
          recentMatches: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      onAuthSuccess(profile);
      onClose();
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in fallback
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const userRef = doc(db, 'users', fbUser.uid);
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userRef);
      } catch (err) {
        console.warn('Initial getDoc from Firestore:', err);
      }

      let profile: UserProfile;
      if (userDocSnap && userDocSnap.exists()) {
        profile = userDocSnap.data() as UserProfile;
      } else {
        const cleanName = fbUser.displayName || 'Pro Gamer';
        const tag = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '') || 'ApexPro';
        const uniqueTag = `${tag}_${Math.floor(Math.random() * 899 + 100)}`;

        profile = {
          userId: fbUser.uid,
          realName: cleanName,
          gamerTag: uniqueTag,
          displayName: cleanName,
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          level: 1,
          xp: 200,
          nextLevelXp: 1500,
          trophies: 100,
          rank: 'Bronze',
          role: fbUser.email === 'ekagrkhannaind120@gmail.com' ? 'admin' : 'gamer',
          bio: 'Pro competitor on GameIn Pro esports platform.',
          proGames: ['Marvel Rivals', 'Valorant'],
          primaryGame: 'Marvel Rivals',
          playstyle: 'Duelist / Entry Fragger',
          rivals: ['ViperX_Pro'],
          matchesPlayed: 1,
          wins: 1,
          kdRatio: '2.20',
          badges: ['First Blood', 'Verified Gamer'],
          recentMatches: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(userRef, profile);
          await setDoc(doc(db, 'handles', uniqueTag.toLowerCase()), {
            userId: fbUser.uid,
            gamerTag: uniqueTag,
            claimedAt: new Date().toISOString()
          });
        } catch (setErr) {
          console.warn('Setting user profile in Firestore:', setErr);
        }
      }

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      onAuthSuccess(profile);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google Sign-In failed';
      console.error('Sign-in error:', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Pro Gamer Picker
  const handleQuickDemoGamer = (tag: string, real: string, rank: any, level: number, trophies: number, role: 'gamer' | 'admin' = 'gamer') => {
    const demoProfile: UserProfile = {
      userId: `demo-${tag.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      realName: real,
      gamerTag: tag,
      displayName: real,
      email: `${tag.toLowerCase()}@gamein.pro`,
      photoURL: level > 30 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      level,
      xp: level * 950 + 200,
      nextLevelXp: (level + 1) * 1000,
      trophies,
      rank,
      role,
      bio: 'Pro scrim grinder | Marvel Rivals flex specialist | Ready for rival duels.',
      proGames: ['Marvel Rivals', 'Valorant', 'Counter-Strike 2'],
      primaryGame: 'Marvel Rivals',
      playstyle: 'Duelist / Entry Fragger',
      rivals: ['ShadowBlade_99', 'NeonPulse_Valk'],
      matchesPlayed: level * 8,
      wins: Math.floor(level * 5.5),
      kdRatio: (1.5 + (level * 0.02)).toFixed(2),
      badges: ['Marvel Rivals Pro', 'Reflex Master', 'Rivals Nemesis'],
      recentMatches: [
        {
          id: 'demo-m1',
          game: 'Marvel Rivals',
          mode: '1v1 Scrim Duel - Tokyo 2099',
          result: 'VICTORY',
          score: '10 - 4',
          kills: 26,
          xpEarned: 450,
          trophiesEarned: 50,
          timestamp: '30 mins ago'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    onAuthSuccess(demoProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border-2 border-slate-700 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl relative overflow-hidden my-4">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500 text-slate-950 font-black">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-heading">
                GAME IN • PRO GAMER PASSPORT
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {authMode === 'signup' 
                  ? 'Create unique Gamer Handle, Real Name & Pro Customization' 
                  : 'Sign in to access tournaments, stats & rival duels'}
              </p>
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

        {/* Tab Toggle: Sign Up vs Sign In */}
        <div className="flex border-b border-slate-700 bg-[#0f172a] p-2 gap-2">
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
              authMode === 'signup'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Create Pro Account
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
              authMode === 'signin'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Sign In Existing
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'signup' ? (
            <form onSubmit={handleSignUpWithEmail} className="space-y-4">
              {/* Row 1: Real Name and Unique Gamer Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-200 mb-1 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    Real Name <span className="text-rose-400">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-200 mb-1 font-bold flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-amber-400" />
                    Unique Gamer Handle <span className="text-rose-400">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    placeholder="e.g. VortexRival_99"
                    maxLength={20}
                    className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono text-xs sm:text-sm"
                  />
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    Must be globally unique across all gamers.
                  </span>
                </div>
              </div>

              {/* Row 2: Email and Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-200 mb-1 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    Account Email <span className="text-rose-400">*</span>
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gamer@domain.com"
                    className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-200 mb-1 font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-sky-400" />
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <input 
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Profile Customization Section */}
              <div className="p-3.5 rounded-xl bg-[#1e293b] border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-white font-bold flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-sky-400" />
                    Pro In Games (Customization)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Select games you specialize in</span>
                </div>

                {/* Pro Games Multi-Select */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_PRO_GAMES.map(game => {
                    const isSelected = selectedProGames.includes(game);
                    return (
                      <button
                        type="button"
                        key={game}
                        onClick={() => toggleProGame(game)}
                        className={`p-2 rounded-lg text-xs font-bold text-left transition-colors border flex items-center justify-between ${
                          isSelected 
                            ? 'bg-sky-500/20 border-sky-400 text-sky-200' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{game}</span>
                        {isSelected && <Check className="w-3 h-3 text-sky-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Primary Role & Rival declaration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold">
                      Primary Playstyle
                    </label>
                    <select
                      value={playstyle}
                      onChange={(e) => setPlaystyle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                    >
                      {PLAYSTYLES.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold flex items-center gap-1">
                      <Swords className="w-3 h-3 text-rose-400" />
                      First Rival Handle (Optional)
                    </label>
                    <input 
                      type="text"
                      value={initialRival}
                      onChange={(e) => setInitialRival(e.target.value)}
                      placeholder="e.g. ViperX_Pro"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SINGLE Primary High-Contrast Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'VERIFYING & REGISTERING...' : 'CONFIRM & GAME IN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Sign In Existing Form */
            <form onSubmit={handleSignInWithEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Gamer Email
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gamer@domain.com"
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-200 mb-1.5 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  Password
                </label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono text-sm"
                />
              </div>

              {/* SINGLE Primary Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-heading uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO GAME IN'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Secondary Google Sign-In */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold flex items-center justify-center gap-3 transition-colors text-xs uppercase"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Instant Google Sign-In</span>
            </button>
          </div>

          {/* Quick Demo Pro Gamer Picker */}
          <div className="pt-3 border-t border-slate-700">
            <span className="text-[11px] text-slate-300 font-mono uppercase block mb-2 text-center font-semibold">
              Or Test Instant Pro Profiles:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoGamer('ViperX_Pro', 'Alexandre Mercer', 'Apex Predator', 42, 2840, 'admin')}
                className="p-2.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-[#1e293b] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <span className="font-bold text-white font-heading text-xs block">
                    ViperX_Pro (Admin)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Alexandre • Marvel Rivals Pro</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoGamer('NeonPulse_Valk', 'Elena Rostova', 'Master', 26, 1780, 'gamer')}
                className="p-2.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-[#1e293b] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <span className="font-bold text-white font-heading text-xs block">
                    NeonPulse_Valk (Gamer)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Elena • Valorant / Rivals</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
