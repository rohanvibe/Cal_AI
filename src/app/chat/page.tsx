"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'How can I help you with your nutrition or workout today?' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}. Please verify your API key.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      <header className="py-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">AI Advisor</h1>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col border border-[#1c1c1f] rounded-2xl bg-[#111114]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-[14px] leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-white text-black font-medium' 
                  : 'bg-[#1c1c1f] text-[#8a8a8e]'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1c1c1f] p-3 px-4 rounded-xl flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#4c4c50]" />
                <span className="text-[12px] text-[#4c4c50]">Thinking</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-[#1c1c1f]">
          <div className="flex bg-[#1c1c1f] rounded-xl overflow-hidden px-1 py-1 pr-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-transparent border-none outline-none font-medium px-3 text-sm h-10 text-white placeholder:text-[#4c4c50]"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
