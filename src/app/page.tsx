"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import Onboarding from "@/components/Onboarding";
import { Flame, Target, Trophy, ChevronRight, Activity, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    calories: 0,
    goal: 2000,
    protein: 0,
    pGoal: 150,
    carbs: 0,
    cGoal: 200,
    fats: 0,
    fGoal: 70
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('cal-ai-profile');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile(data);
      setStats({
        calories: 0,
        goal: data.dailyCalories || 2000,
        protein: 0,
        pGoal: data.protein || 150,
        carbs: 0,
        cGoal: data.carbs || 200,
        fats: 0,
        fGoal: data.fats || 70
      });
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('cal-ai-profile', JSON.stringify(data));
    setProfile(data);
    setStats({
      calories: 0,
      goal: data.dailyCalories || 2000,
      protein: 0,
      pGoal: data.protein || 150,
      carbs: 0,
      cGoal: data.carbs || 200,
      fats: 0,
      fGoal: data.fats || 70
    });
  };

  if (loading) return null;

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Premium Header */}
      <header className="flex justify-between items-start pt-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">System Active</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Hi, {profile.name}</h1>
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest mt-1">
            <span>{profile.suggestedGoal || "Standard Plan"}</span>
            <span className="opacity-30">•</span>
            <span>LVL 1</span>
          </div>
        </div>
        <div className="glass w-12 h-12 flex items-center justify-center bg-white/[0.03] border-white/10 rounded-2xl shadow-xl">
          <Trophy className="text-[var(--primary)]" size={20} />
        </div>
      </header>

      {/* Main Stats Card */}
      <section className="glass rounded-[40px] p-8 flex flex-col items-center gap-8 relative overflow-hidden animate-fade-in group shadow-2xl shadow-black">
        {/* Visual Background Decals */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0 duration-700">
          <Activity size={240} className="text-[var(--primary)]" />
        </div>
        
        <StatsRing 
          label="Daily Progress" 
          value={stats.calories} 
          total={stats.goal} 
          color="var(--primary)" 
          size={240}
        />

        {/* Macro Pill Indicators */}
        <div className="flex justify-between w-full mt-4 px-2 gap-4">
          <div className="flex-1 glass p-4 rounded-3xl flex flex-col items-center border-white/5 bg-white/[0.01]">
            <span className="text-[var(--primary)] text-lg font-black">{stats.pGoal}g</span>
            <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Prot</span>
          </div>
          <div className="flex-1 glass p-4 rounded-3xl flex flex-col items-center border-white/5 bg-white/[0.01]">
            <span className="text-[var(--secondary)] text-lg font-black">{stats.cGoal}g</span>
            <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Carb</span>
          </div>
          <div className="flex-1 glass p-4 rounded-3xl flex flex-col items-center border-white/5 bg-white/[0.01]">
            <span className="text-[var(--accent)] text-lg font-black">{stats.fGoal}g</span>
            <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Fat</span>
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="glass p-6 rounded-[32px] border-l-4 border-l-[var(--secondary)] animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <div className="absolute -right-4 -top-4 opacity-10 rotate-12 text-[var(--secondary)]">
            <Sparkles size={80} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[var(--secondary)] mb-3">
          AI Context Reasoning
        </h3>
        <p className="text-sm leading-relaxed text-white/80 italic font-medium">
          "{profile.aiReasoning}"
        </p>
      </section>

      {/* Action Grid */}
      <section className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glass p-5 flex flex-col gap-4 rounded-[32px] bg-gradient-to-br from-white/[0.05] to-transparent">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Flame size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Day Streak</span>
            <p className="text-xl font-black mt-0.5">DAY 01</p>
          </div>
        </div>
        <div className="glass p-5 flex flex-col gap-4 rounded-[32px] bg-gradient-to-br from-white/[0.05] to-transparent">
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Weight</span>
            <p className="text-xl font-black mt-0.5">{profile.weight}<span className="text-xs opacity-40 ml-1">KG</span></p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .gap-8 { gap: 32px; }
        .gap-4 { gap: 16px; }
        .gap-2 { gap: 8px; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; }
        .text-lg { font-size: 1.125rem; }
        .text-sm { font-size: 0.875rem; }
        .font-black { font-weight: 900; }
        .font-medium { font-weight: 500; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-5 { padding: 1.25rem; }
        .leading-relaxed { line-height: 1.625; }
        .tracking-widest { letter-spacing: 0.1em; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </div>
  );
}
