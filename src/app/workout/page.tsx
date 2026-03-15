"use client";

import { useState } from "react";
import { Dumbbell, Play, Timer, CheckCircle, RefreshCw, Zap } from "lucide-react";

export default function WorkoutPage() {
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateNewWorkout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/workout", { method: "POST" });
      const data = await response.json();
      setWorkout(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl">Workouts</h1>
          <p className="text-[var(--text-secondary)] text-sm">Personalized AI training sessions.</p>
        </div>
        <button 
          onClick={generateNewWorkout} 
          disabled={loading}
          className="glass p-3 text-[var(--primary)] hover:bg-[var(--primary-glow)] transition-colors"
        >
          {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
        </button>
      </header>

      {!workout ? (
        <div className="glass p-8 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--card-border)] flex items-center justify-center text-[var(--secondary)]">
            <Dumbbell size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">No Plan Today?</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Let Cal AI generate a perfect workout based on your equipment and recovery status.
            </p>
          </div>
          <button onClick={generateNewWorkout} className="btn-primary w-full">
            Generate AI Workout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in pb-10">
          <div className="glass p-6 bg-gradient-to-br from-[var(--secondary)]/20 to-transparent border-l-4 border-l-[var(--secondary)]">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{workout.planName}</h2>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Timer size={14} /> 45 MINS
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Zap size={14} /> HI-INTENSITY
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Exercises</h3>
            {workout?.exercises?.map((ex: any, idx: number) => (
              <div key={idx} className="glass p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--card-border)] flex items-center justify-center text-sm font-bold text-[var(--secondary)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold">{ex.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{ex.muscle} • {ex.sets} sets x {ex.reps}</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                  <Play size={16} />
                </button>
              </div>
            ))}
          </div>

          <button className="btn-primary w-full h-14 flex items-center justify-center gap-2">
             <CheckCircle size={20} /> Finish Workout
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
      `}</style>
    </div>
  );
}
