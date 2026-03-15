"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hey! I am your Cal AI mentor. I know your stats and goals—what is on your mind today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cal-ai-profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat failed");

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}. Please check your Gemini API key.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in relative">
      {/* Mesh Gradient Background for Chat */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--primary-glow)] to-transparent opacity-20 h-40"></div>

      <header className="py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
                <Sparkles size={20} className="text-black" />
            </div>
            <div>
                <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">AI Mentor</h1>
                <p className="text-[10px] text-[var(--accent)] font-bold uppercase mt-1 tracking-widest">Live Optimization</p>
            </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col glass border-none rounded-[32px] bg-black/40">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[85%] group ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg' 
                    : 'glass-dark text-white border-l-2 border-l-[var(--primary)]'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                </div>
                {m.role === 'assistant' && (
                    <div className="mt-1 ml-2 text-[8px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                        Cal AI • Science-Backed
                    </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass-dark p-4 rounded-2xl flex items-center gap-3">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[var(-- primary)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">AI is analyzing...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 m-4 glass rounded-2xl flex gap-3 items-center ring-1 ring-white/5 bg-white/[0.02]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your plan..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-white/20"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-[var(--primary)] text-black flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--primary-glow)]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .glass-dark {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .animate-bounce {
            animation: bounce 0.6s infinite alternate;
        }
        @keyframes bounce { to { opacity: 0.3; transform: translateY(-4px); } }
      `}</style>
    </div>
  );
}
