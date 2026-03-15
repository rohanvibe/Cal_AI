"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import Onboarding from "@/components/Onboarding";
import { ArrowUpRight, Activity, TrendingUp } from "lucide-react";

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
    <div className="animate-fade-in flex flex-col gap-10 max-w-2xl mx-auto w-full pt-10 pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
            <Activity size={16} className="text-[#8a8a8e]" />
            <span className="text-xs font-bold text-[#8a8a8e] uppercase tracking-[0.2em]">Bio-Stats Connected</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Today</h1>
        <p className="text-lg text-[#8a8a8e] font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* 
          FIX: Clear interactive separation
          The central ring is now housed in a deep-glass card that doesn't look like a button.
          Individual stats have clear borders.
      */}
      <section className="glass flex flex-col items-center gap-10 py-12 shadow-2xl bg-[#111114]">
        <StatsRing 
          label="Calories" 
          value={stats.calories} 
          total={stats.goal} 
          color="#ffffff" 
          size={240}
        />
        
        <div className="grid grid-cols-3 w-full border-t border-[#222226] mt-4 pt-10">
          <div className="flex flex-col items-center gap-3 border-r border-[#222226]">
            <span className="text-[11px] font-bold text-[#4c4c50] uppercase tracking-widest">Protein</span>
            <span className="text-2xl font-bold">{stats.pGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-3 border-r border-[#222226]">
            <span className="text-[11px] font-bold text-[#4c4c50] uppercase tracking-widest">Carbs</span>
            <span className="text-2xl font-bold">{stats.cGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-bold text-[#4c4c50] uppercase tracking-widest">Fats</span>
            <span className="text-2xl font-bold">{stats.fGoal}g</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
           <TrendingUp size={16} className="text-[#5d5dff]" />
           <h3 className="text-xs font-bold text-[#8a8a8e] uppercase tracking-[0.2em]">AI Intelligence</h3>
        </div>
        <div className="glass bg-[#0c0c0e] border-[#222226] p-8 border-l-4 border-l-[#5d5dff]">
          <p className="text-[16px] leading-relaxed text-[#d1d1d6] font-medium">
            "{profile.aiReasoning}"
          </p>
        </div>
      </section>

      <style jsx>{`
        .grid { display: grid; }
        .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
      `}</style>
    </div>
  );
}
