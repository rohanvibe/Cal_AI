"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import Onboarding from "@/components/Onboarding";
import { ArrowUpRight } from "lucide-react";

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
    <div className="animate-fade-in flex flex-col gap-6">
      <header className="flex flex-col gap-1 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm text-[#8a8a8e]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      <section className="glass flex flex-col items-center gap-6 py-10 relative overflow-hidden">
        <StatsRing 
          label="Calories" 
          value={stats.calories} 
          total={stats.goal} 
          color="#ffffff" 
          size={200}
        />
        
        <div className="grid grid-cols-3 w-full border-t border-[#1c1c1f] mt-4 pt-6">
          <div className="flex flex-col items-center gap-1 border-r border-[#1c1c1f]">
            <span className="text-xs font-medium text-[#8a8a8e]">Protein</span>
            <span className="text-sm font-semibold">{stats.pGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-[#1c1c1f]">
            <span className="text-xs font-medium text-[#8a8a8e]">Carbs</span>
            <span className="text-sm font-semibold">{stats.cGoal}g</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-[#8a8a8e]">Fats</span>
            <span className="text-sm font-semibold">{stats.fGoal}g</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-semibold text-[#8a8a8e] uppercase tracking-wider">AI Insight</h3>
           <div className="h-[1px] flex-1 bg-[#1c1c1f] ml-4"></div>
        </div>
        <div className="glass bg-[#0c0c0e] border-[#1c1c1f]">
          <p className="text-sm leading-relaxed text-[#8a8a8e]">
            {profile.aiReasoning}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="glass p-4 flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Plan</span>
          <p className="text-sm font-medium">{profile.suggestedGoal || "Custom"}</p>
        </div>
        <div className="glass p-4 flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-[#8a8a8e] uppercase tracking-wider">Status</span>
          <p className="text-sm font-medium">{profile.weight} kg</p>
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
