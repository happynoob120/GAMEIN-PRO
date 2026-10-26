import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { ChatMessage, UserProfile } from '../types';
import { Send, MessageSquare, Sparkles } from 'lucide-react';

interface LiveChatModuleProps {
  currentUser: UserProfile | null;
  activeChannelId: string;
  activeChannelTitle: string;
  onOpenAuth: () => void;
  tournamentId?: string;
  compact?: boolean;
}

const QUICK_EMOJIS = ['🔥', '🏆', '💀', '🎯', '🚀', '⚡', 'GG', 'EZ'];

export default function LiveChatModule({
  currentUser,
  activeChannelId,
  activeChannelTitle,
  onOpenAuth,
  compact = false
}: LiveChatModuleProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Default initial seed messages for immediate conversation
  const fallbackMessages: ChatMessage[] = [
    {
      id: 'seed-1',
      userId: 'system-bot',
      userName: 'GameIn Admin',
      userAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
      userLevel: 99,
      userRole: 'admin',
      text: `Welcome to ${activeChannelTitle}! Keep comms tactical and respectful. GG!`,
      channelId: activeChannelId,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'seed-2',
      userId: 'pro-sniper',
      userName: 'ViperX_Pro',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      userLevel: 42,
      userRole: 'gamer',
      text: 'Anyone looking for a 5th flex for the Valorant Champions bracket today?',
      channelId: activeChannelId,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'seed-3',
      userId: 'aim-god',
      userName: 'CyberShadow',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      userLevel: 38,
      userRole: 'gamer',
      text: 'Just scored 182ms in Reflex Lab! Tournament finals starting soon 🔥',
      channelId: activeChannelId,
      createdAt: new Date(Date.now() - 600000).toISOString(),
      reactions: { '🔥': 4, '🏆': 2 }
    }
  ];

  // Subscribe to real-time chat messages from Firestore
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('channelId', '==', activeChannelId),
        orderBy('createdAt', 'asc'),
        limit(50)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: ChatMessage[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              fetched.push({
                id: docSnap.id,
                userId: data.userId || 'anon',
                userName: data.userName || 'Gamer',
                userAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                userLevel: data.userLevel || 1,
                userRole: data.userRole || 'gamer',
                text: data.text || '',
                channelId: data.channelId || activeChannelId,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
                reactions: data.reactions || {}
              });
            });
            setMessages(fetched);
          } else {
            setMessages(fallbackMessages);
          }
        },
        (error) => {
          console.warn('Real-time chat listener note:', error.message);
          setMessages(fallbackMessages);
        }
      );
    } catch {
      setMessages(fallbackMessages);
    }

    return () => {
      unsubscribe();
    };
  }, [activeChannelId]);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    const localNewMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      userId: currentUser.userId,
      userName: currentUser.gamerTag || currentUser.displayName,
      userAvatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      userLevel: currentUser.level || 1,
      userRole: currentUser.role || 'gamer',
      text: textToSend,
      channelId: activeChannelId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localNewMessage]);

    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        userId: currentUser.userId,
        userName: currentUser.gamerTag || currentUser.displayName,
        userAvatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        userLevel: currentUser.level || 1,
        userRole: currentUser.role || 'gamer',
        text: textToSend,
        channelId: activeChannelId,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Writing chat message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => `${prev} ${emoji}`.trim());
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentCount = msg.reactions?.[emoji] || 0;
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: currentCount + 1,
            },
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className={`flex flex-col bg-[#0f172a] border-2 border-slate-700 rounded-xl overflow-hidden shadow-lg ${compact ? 'h-[440px]' : 'h-[580px]'}`}>
      {/* Chat Header */}
      <div className="px-4 py-3.5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              {activeChannelTitle}
            </h4>
            <span className="text-xs text-slate-300 font-medium">Cloud Firestore Real-Time Synchronized</span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-200">
          {messages.length} messages
        </span>
      </div>

      {/* Messages Stream */}
      <div 
        ref={chatScrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
        onScroll={(e) => {
          const target = e.currentTarget;
          const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 60;
          setAutoScroll(isAtBottom);
        }}
      >
        {messages.map((msg) => {
          const isMe = currentUser && msg.userId === currentUser.userId;
          const isAdmin = msg.userRole === 'admin' || msg.userId === 'system-bot';

          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <img 
                src={msg.userAvatar} 
                alt={msg.userName}
                className="w-8 h-8 rounded-full border border-slate-600 object-cover flex-shrink-0"
              />

              <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Meta header */}
                <div className={`flex items-center gap-1.5 mb-1 text-xs ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className={`font-bold ${isMe ? 'text-sky-300' : 'text-white'}`}>
                    {msg.userName}
                  </span>

                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-600 font-bold">
                    LVL {msg.userLevel}
                  </span>

                  {isAdmin && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 border border-rose-500 text-rose-300 uppercase font-bold">
                      ADMIN
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Bubble with High Contrast */}
                <div 
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-sky-600 text-white font-medium rounded-tr-none shadow-sm'
                      : isAdmin
                      ? 'bg-[#291319] border border-rose-500 text-rose-100 rounded-tl-none font-medium'
                      : 'bg-[#1e293b] border border-slate-700 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Reactions badge bar */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleToggleReaction(msg.id, emoji)}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center gap-1 text-slate-200 transition-colors"
                      >
                        <span>{emoji}</span>
                        <span className="text-xs font-mono font-bold text-sky-300">{count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis strip */}
      <div className="px-4 py-2 bg-[#1e293b] border-t border-slate-700 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-300 font-semibold uppercase flex-shrink-0">Quick Comms:</span>
        {QUICK_EMOJIS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleAddEmoji(item)}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-medium transition-colors flex-shrink-0"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Input Form with SINGLE High-Contrast Primary Send Button */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#0f172a] border-t-2 border-slate-700">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeChannelTitle}...`}
              maxLength={400}
              className="flex-1 bg-[#1e293b] border border-slate-600 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#1e293b] border border-slate-700 text-xs">
            <span className="text-slate-200 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" /> Sign in to send live comms & react
            </span>
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-lg text-xs uppercase font-heading transition-colors"
            >
              Game In
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
