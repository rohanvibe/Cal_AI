"use client";

import { useState, useEffect } from "react";
import { Activity, Play, Timer, CheckCircle, RefreshCw, Zap, ClipboardList, Info } from "lucide-react";

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <header className="py-4">
        <h1 className="text-2xl font-semibold tracking-tight">Workouts</h1>
        <p className="text-sm text-[#8a8a8e]">Custom training protocols.</p>
      </header>

      {!workout && !loading && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <section className="glass flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-[#8a8a8e] uppercase tracking-wider">Parameters</h3>
            <textarea 
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Specify equipment or restrictions (e.g. no gym, floor exercises only)..."
                className="glass-input min-h-[140px] border-none bg-[#0c0c0e] text-sm"
            />
          </section>

          <section className="glass flex flex-col items-center justify-center py-10 gap-6">
            <Activity size={32} className="text-[#8a8a8e]" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">Generate Session</h2>
              <p className="text-sm text-[#4c4c50] mt-1">
                Optimized for age {profile?.age || '...'}.
              </p>
            </div>
            <button onClick={generateNewWorkout} className="btn-primary">
              Begin Workout
            </button>
          </section>
        </div>
      )}

      {loading && (
        <div className="glass py-20 flex flex-col items-center justify-center text-center gap-6">
            <RefreshCw size={24} className="animate-spin text-white" />
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Compiling Plan</h2>
                <p className="text-sm text-[#8a8a8e] mt-1">Cross-referencing biological data points.</p>
            </div>
        </div>
      )}

      {workout && !loading && (
        <div className="flex flex-col gap-6 animate-fade-in pb-10">
          <section className="glass bg-white text-black border-none">
            <h2 className="text-xl font-bold tracking-tight uppercase">{workout.planName}</h2>
            <div className="flex gap-4 mt-4">
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest border border-black/10 px-2 py-1 rounded">5 EXERCISES</span>
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest border border-black/10 px-2 py-1 rounded">HI-INTENSITY</span>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            {workout?.exercises?.map((ex: any, idx: number) => (
              <div key={idx} className="glass flex items-center justify-between py-4">
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-bold text-[#4c4c50] w-4">{idx + 1}</span>
                  <div>
                    <h4 className="text-sm font-semibold">{ex.name}</h4>
                    <p className="text-[11px] text-[#8a8a8e] mt-0.5">{ex.muscle} • {ex.sets}x{ex.reps}</p>
                  </div>
                </div>
                <Play size={14} className="text-[#8a8a8e]" />
              </div>
            ))}
          </div>

          <button onClick={() => setWorkout(null)} className="btn-primary mt-4">
             Finish Session
          </button>
        </div>
      )}

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
