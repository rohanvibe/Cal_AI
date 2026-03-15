"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Ready to optimize your biology? Ask me anything about your current nutrition or workout strategy.' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: `Sync Error: ${err.message}. Check your API connection.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in max-w-2xl mx-auto w-full pt-4">
      <header className="py-6 mb-2 flex items-center justify-between border-b border-[#222226]">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AI Advisor</h1>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col mt-4">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 pr-2 pb-10">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 px-6 rounded-[24px] text-[16px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-white text-black font-semibold shadow-xl' 
                    : 'bg-[#1c1c1f] text-[#d1d1d6] border border-[#222226]'
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1c1c1f] p-4 px-6 rounded-[24px] flex items-center gap-3 border border-[#222226]">
                <Loader2 size={16} className="animate-spin text-[#5d5dff]" />
                <span className="text-sm font-medium text-[#8a8a8e]">Analyzing context...</span>
              </div>
            </div>
          )}
        </div>

        {/* 
            FIX: Modern Input Design 
            Removed 'vintage' elements. Switched to a floating, rounded, minimal input container.
        */}
        <div className="pt-4 pb-6 px-1">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your biology mentor..."
              className="glass-input !py-5 !pl-6 !pr-16 shadow-2xl"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg group-focus-within:bg-[#5d5dff] group-focus-within:text-white"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
