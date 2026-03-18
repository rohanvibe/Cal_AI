"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles, User, Bot } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Cal AI active. How can I assist with your biological optimization today?' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: `Sync connection lost: ${err.message}.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-fade-in max-w-lg mx-auto w-full pt-4">
      <header className="py-6 flex items-center justify-between border-b border-white/5 px-2">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/20">
                <Sparkles size={18} className="text-[#bc13fe]" />
            </div>
            <div>
                <h1 className="text-xl font-extrabold tracking-tight">AI Advisor</h1>
                <p className="text-[10px] font-bold text-[#bc13fe] uppercase tracking-widest mt-0.5">Context Enabled</p>
            </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col mt-6 px-1">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 pb-20 mt-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 px-6 rounded-[28px] text-[15px] leading-relaxed shadow-xl ${
                  m.role === 'user' 
                    ? 'bg-[#bc13fe] text-white font-semibold' 
                    : 'glass bg-white/[0.04] text-[#d1d1d6] border-none'
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass bg-white/[0.04] p-4 px-6 rounded-[28px] flex items-center gap-3 border-none shadow-xl">
                <Loader2 size={16} className="animate-spin text-[#bc13fe]" />
                <span className="text-sm font-semibold text-[#64748b]">Syncing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Rebuilt 'Modern Premium' Input Field */}
        <div className="pt-4 pb-6 mt-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="glass-input !py-5 !pl-6 !pr-16 !bg-white/[0.03] !border-white/5 !rounded-[24px] shadow-2xl focus:!border-[#bc13fe]/30"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 w-12 h-12 rounded-2xl bg-[#bc13fe] text-white flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-5px_var(--primary-glow)]"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
