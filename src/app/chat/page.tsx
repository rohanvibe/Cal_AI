"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Loader2, Sparkles } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hi! I am your Cal AI mentor. How can I help you with your fitness or nutrition today?' }
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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Make sure your API key is valid!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in gap-4">
      <header className="py-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-[var(--primary)]" size={20} />
            AI Mentor
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">Your personalized health & fitness guide</p>
      </header>

      <div className="glass flex-1 overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl flex gap-3 ${
                m.role === 'user' 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'glass-dark text-white border-l-4 border-l-[var(--primary)]'
              }`}>
                <div className="shrink-0 pt-1">
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <p className="text-sm leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass-dark p-3 rounded-2xl flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[var(--primary)]" />
                <span className="text-xs opacity-60">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-[var(--card-border)] bg-black/20 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your diet or exercises..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="p-2 rounded-xl bg-[var(--primary)] text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .glass-dark {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
