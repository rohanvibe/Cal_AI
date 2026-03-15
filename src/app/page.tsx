"use client";

import { useState, useEffect } from "react";
import StatsRing from "@/components/StatsRing";
import { Flame, Target, Trophy, ChevronRight, Activity } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({
    calories: 1450,
    goal: 2200,
    protein: 85,
    pGoal: 150,
    carbs: 160,
    cGoal: 200,
    fats: 45,
    fGoal: 70
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl">Good Morning, Rohan</h1>
          <p className="text-[var(--text-secondary)] text-sm">You're 65% of the way to your goal!</p>
        </div>
        <div className="glass p-2">
          <Trophy className="text-[var(--accent)]" size={20} />
        </div>
      </header>

      {/* Main Stats */}
      <section className="glass p-6 flex flex-col items-center gap-4 relative overflow-hidden">
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
      <section className="grid grid-cols-2 gap-4">
        <div className="glass p-4 flex flex-col gap-2">
          <Flame className="text-orange-500" />
          <span className="text-sm font-semibold">Streak</span>
          <span className="text-lg font-bold">12 Days</span>
        </div>
        <div className="glass p-4 flex flex-col gap-2">
          <Target className="text-red-500" />
          <span className="text-sm font-semibold">Weight</span>
          <span className="text-lg font-bold">78.5 kg</span>
        </div>
      </section>

      {/* AI Suggestion */}
      <section className="glass p-4 border-l-4 border-l-[var(--primary)]">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Activity size={16} className="text-[var(--primary)]" />
          AI INSIGHT
        </h3>
        <p className="text-sm mt-2 text-[var(--text-secondary)]">
          You're low on protein today. Consider adding a Greek yogurt snack after your workout!
        </p>
      </section>

      {/* Progress Cards */}
      <section className="flex flex-col gap-3 pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg">Daily Log</h2>
          <span className="text-sm text-[var(--primary)]">View All</span>
        </div>
        
        {[1, 2].map((i) => (
          <div key={i} className="glass p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--card-border)] overflow-hidden">
                <img src={`https://picsum.photos/seed/${i+10}/200`} alt="meal" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold">{i === 1 ? 'Quinoa Salad' : 'Protein Shake'}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{i === 1 ? 'Lunch • 450 kcal' : 'Snack • 180 kcal'}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[var(--text-secondary)]" />
          </div>
        ))}
      </section>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .gap-6 { gap: 24px; }
        .gap-4 { gap: 16px; }
        .gap-3 { gap: 12px; }
        .gap-2 { gap: 8px; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; font-weight: 700; }
        .text-lg { font-size: 1.125rem; font-weight: 600; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
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
        .rounded-xl { border-radius: 0.75rem; }
        .w-12 { width: 3rem; }
        .h-12 { height: 3rem; }
        .object-cover { object-fit: cover; }
      `}</style>
    </div>
  );
}
