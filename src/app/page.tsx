"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import Onboarding from "@/components/Onboarding";

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
    <div className="animate-fade-in flex flex-col gap-10 justify-center h-full max-w-md mx-auto w-full pt-10">
      <header className="flex flex-col gap-2 py-4">
        <h1 className="text-4xl font-bold tracking-tight">Today</h1>
        <p className="text-lg text-[#8a8a8e] font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      <section className="glass flex flex-col items-center gap-10 py-12 shadow-2xl">
        <StatsRing 
          label="Calories" 
          value={stats.calories} 
          total={stats.goal} 
          color="#ffffff" 
          size={240}
        />
        
        <div className="grid grid-cols-3 w-full border-t border-[#222226] mt-4 pt-8">
          <div className="flex flex-col items-center gap-2 border-r border-[#222226]">
            <span className="text-sm font-semibold text-[#8a8a8e] uppercase tracking-wider">Protein</span>
            <span className="text-xl font-bold">{stats.pGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-2 border-r border-[#222226]">
            <span className="text-sm font-semibold text-[#8a8a8e] uppercase tracking-wider">Carbs</span>
            <span className="text-xl font-bold">{stats.cGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-[#8a8a8e] uppercase tracking-wider">Fats</span>
            <span className="text-xl font-bold">{stats.fGoal}g</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-bold text-[#8a8a8e] uppercase tracking-[0.2em] px-2">Analysis</h3>
           <div className="h-[1px] flex-1 bg-[#222226] ml-4"></div>
        </div>
        <div className="glass bg-[#111114] border-[#222226] p-6 shadow-lg">
          <p className="text-[15px] leading-relaxed text-[#a0a0a5] font-medium italic">
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
