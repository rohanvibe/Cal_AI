"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import Onboarding from "@/components/Onboarding";
import { Flame, Target, Trophy, ChevronRight, Activity } from "lucide-react";

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
      setStats(prev => ({
        ...prev,
        goal: data.dailyCalories,
        pGoal: data.protein,
        cGoal: data.carbs,
        fGoal: data.fats
      }));
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('cal-ai-profile', JSON.stringify(data));
    setProfile(data);
    setStats(prev => ({
      ...prev,
      goal: data.dailyCalories,
      pGoal: data.protein,
      cGoal: data.carbs,
      fGoal: data.fats
    }));
  };

  if (loading) return null;

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex justify-between items-center py-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            AI Plan: {profile.suggestedGoal}
          </p>
        </div>
        <div className="glass p-2">
          <Trophy className="text-[var(--accent)]" size={20} />
        </div>
      </header>

      {/* Main Stats */}
      <section className="glass p-6 flex flex-col items-center gap-4 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={100} className="text-[var(--primary)]" />
        </div>
        
        <StatsRing 
          label="Calories" 
          value={stats.calories} 
          total={stats.goal} 
          color="var(--primary)" 
          size={180}
        />

        <div className="flex justify-between w-full mt-4">
          <div className="flex flex-col items-center">
            <span className="text-[var(--primary)] font-bold">{stats.protein}g</span>
            <span className="text-xs text-[var(--text-secondary)]">Protein</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--secondary)] font-bold">{stats.carbs}g</span>
            <span className="text-xs text-[var(--text-secondary)]">Carbs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--accent)] font-bold">{stats.fats}g</span>
            <span className="text-xs text-[var(--text-secondary)]">Fats</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass p-4 flex flex-col gap-2">
          <Flame className="text-orange-500" />
          <span className="text-sm font-semibold">Streak</span>
          <span className="text-lg font-bold">First Day!</span>
        </div>
        <div className="glass p-4 flex flex-col gap-2">
          <Target className="text-red-500" />
          <span className="text-sm font-semibold">Weight</span>
          <span className="text-lg font-bold">{profile.weight} kg</span>
        </div>
      </section>

      {/* AI Suggestion */}
      <section className="glass p-4 border-l-4 border-l-[var(--primary)] animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Activity size={16} className="text-[var(--primary)]" />
          AI PLAN RATIONALE
        </h3>
        <p className="text-sm mt-2 text-[var(--text-secondary)]">
          {profile.aiReasoning}
        </p>
      </section>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .gap-6 { gap: 24px; }
        .gap-4 { gap: 16px; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-lg { font-size: 1.125rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .p-2 { padding: 0.5rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .w-full { width: 100%; }
        .relative { position: relative; }
        .overflow-hidden { overflow: hidden; }
        .absolute { position: absolute; }
        .top-0 { top: 0; }
        .right-0 { right: 0; }
        .opacity-10 { opacity: 0.1; }
        .border-l-4 { border-left-width: 4px; }
      `}</style>
    </div>
  );
}
