"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Play, Timer, CheckCircle, RefreshCw, Zap, ClipboardList, Info } from "lucide-react";

export default function WorkoutPage() {
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [constraints, setConstraints] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cal-ai-profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const generateNewWorkout = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const response = await fetch("/api/workout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, constraints })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setWorkout(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate workout. Ensure your API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-[var(--text-secondary)] text-sm">Personalized AI training sessions.</p>
        </div>
        {(workout || constraints) && (
            <button 
                onClick={generateNewWorkout} 
                disabled={loading}
                className="glass p-3 text-[var(--primary)] hover:bg-[var(--primary-glow)] transition-colors rounded-xl"
            >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
            </button>
        )}
      </header>

      {!workout && !loading && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <section className="glass p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[var(--primary)]">
                <ClipboardList size={20} />
                <h2 className="font-bold">Preferences & Equipment</h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
                Tell Cal AI if you have any injuries, restricted space, or specific equipment (e.g. "I only have a yoga mat" or "No jumping exercises").
            </p>
            <textarea 
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. I only have 10 minutes and no weights. I can only do floor exercises."
                className="glass-input min-h-[100px] text-sm resize-none"
            />
          </section>

          <div className="glass p-8 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--card-border)] flex items-center justify-center text-[var(--secondary)]">
              <Dumbbell size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ready to Begin?</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Your plan is adjusted for your age ({profile?.age || '...'}) and requirements.
              </p>
            </div>
            <button onClick={generateNewWorkout} className="btn-primary w-full h-14 font-bold tracking-wide">
              Generate My Session
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="glass p-12 flex flex-col items-center justify-center text-center gap-6 animate-pulse">
            <RefreshCw size={40} className="animate-spin text-[var(--primary)]" />
            <h2 className="text-xl font-bold">Crafting your plan...</h2>
            <p className="text-sm text-[var(--text-secondary)]">Consulting sports science database for age-appropriate routines.</p>
        </div>
      )}

      {workout && !loading && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="glass p-6 bg-gradient-to-br from-[var(--secondary)]/20 to-transparent border-l-4 border-l-[var(--secondary)]">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">{workout.planName}</h2>
                <div className="bg-[var(--secondary)]/20 px-2 py-1 rounded text-[10px] font-bold text-[var(--secondary)]">AI GENERATED</div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Timer size={14} /> AGE-BALANCED
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Zap size={14} /> {constraints ? 'CUSTOM' : 'STRENGTH'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                Your Routine
                <span className="text-xs font-normal text-[var(--text-secondary)] bg-[var(--card-border)] px-2 py-0.5 rounded-full">5 Exercises</span>
            </h3>
            {workout?.exercises?.map((ex: any, idx: number) => (
              <div key={idx} className="glass p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--card-border)] flex items-center justify-center text-sm font-bold text-[var(--secondary)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold">{ex.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{ex.muscle} • {ex.sets} sets x {ex.reps}</p>
                    {ex.instructions && (
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-60 leading-tight">
                            {ex.instructions.length > 60 ? ex.instructions.substring(0, 60) + '...' : ex.instructions}
                        </p>
                    )}
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                  <Info size={16} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => setWorkout(null)} className="btn-primary w-full h-14 flex items-center justify-center gap-2 font-bold uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20">
             <CheckCircle size={20} /> Complete Session
          </button>
        </div>
      )}

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .gap-6 { gap: 24px; }
        .gap-4 { gap: 16px; }
        .gap-2 { gap: 8px; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; }
        .text-xl { font-size: 1.25rem; font-weight: 700; }
        .text-lg { font-size: 1.125rem; font-weight: 700; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-black { font-weight: 900; }
        .italic { font-style: italic; }
        .uppercase { text-transform: uppercase; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </div>
  );
}
