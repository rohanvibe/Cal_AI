"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import Onboarding from "@/components/Onboarding";
import { Activity, Target, Sparkles, TrendingUp } from "lucide-react";

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
    <div className="animate-fade-in flex flex-col gap-8 max-w-lg mx-auto w-full pt-10">
      <header className="flex flex-col gap-1 py-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#bc13fe] animate-pulse shadow-[0_0_10px_#bc13fe]"></div>
            <span className="text-[10px] font-bold text-[#bc13fe] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#bc13fe]/10">Bio-Terminal Active</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Today</h1>
        <p className="text-lg text-[#94a3b8] font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* Main Stats Card - Sophisticated and Centered */}
      <section className="glass flex flex-col items-center gap-8 py-12 relative overflow-hidden group shadow-2xl">
        <StatsRing 
          label="Calories" 
          value={stats.calories} 
          total={stats.goal} 
          color="#bc13fe" 
          size={240}
        />
        
        <div className="grid grid-cols-3 w-full border-t border-white/5 mt-4 pt-10 px-4">
          <div className="flex flex-col items-center gap-2 border-r border-white/5">
            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Protein</span>
            <span className="text-2xl font-bold">{stats.pGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-2 border-r border-white/5">
            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Carbs</span>
            <span className="text-2xl font-bold">{stats.cGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Fats</span>
            <span className="text-2xl font-bold">{stats.fGoal}g</span>
          </div>
        </div>
      </section>

      {/* AI Intelligence Section - Modern and Balanced */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#bc13fe]" />
              <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">AI Profile Analysis</h3>
           </div>
           <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
        </div>
        <div className="glass bg-[#bc13fe]/[0.02] border-[#bc13fe]/20 p-8 border-l-4 border-l-[#bc13fe] rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] -rotate-12 transition-transform group-hover:rotate-0 duration-700">
            <Sparkles size={120} className="text-[#bc13fe]" />
          </div>
          <p className="text-[15px] leading-relaxed text-[#d1d1d6] font-medium z-10 relative">
            "{profile.aiReasoning}"
          </p>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="grid grid-cols-2 gap-4 pb-20">
        <div className="glass p-5 flex flex-col gap-2 rounded-3xl border-none bg-gradient-to-br from-white/[0.04] to-transparent">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Weight Registry</span>
          <p className="text-xl font-bold">{profile.weight} kg</p>
        </div>
        <div className="glass p-5 flex flex-col gap-2 rounded-3xl border-none bg-gradient-to-br from-white/[0.04] to-transparent">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Daily Target</span>
          <p className="text-xl font-bold">{profile.suggestedGoal || "Custom"}</p>
        </div>
      </section>

      <style jsx>{`
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: 1fr 1fr; }
        .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
      `}</style>
    </div>
  );
}
