"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, User, Bot } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'How can I assist with your fitness or nutrition today?' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: `Technical issue: ${err.message}. Verify API connection.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-fade-in justify-center max-w-md mx-auto w-full">
      <header className="py-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight px-2">Assistant</h1>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col border border-[#222226] rounded-[24px] bg-[#111114] shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 px-5 rounded-[20px] text-[15px] leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-white text-black font-semibold' 
                  : 'bg-[#1c1c1f] text-[#a0a0a5]'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1c1c1f] p-4 px-5 rounded-[20px] flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#4c4c50] rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-[#4c4c50] rounded-full animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-[#4c4c50] rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rebuilt Chat Input Area - No 'Vintage' feel */}
        <div className="p-4 bg-[#111114]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-[#1c1c21] border border-[#2d2d33] rounded-[18px] py-5 px-6 pr-16 text-[16px] text-white outline-none focus:border-[#4a4a4f] transition-all focus:bg-[#222227] shadow-inner"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 w-11 h-11 rounded-[14px] bg-white text-black flex items-center justify-center disabled:opacity-20 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
