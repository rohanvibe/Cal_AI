"use client";

import { useState, useEffect } from "react";
import { Activity, Play, RefreshCw, Zap, ClipboardList, Info, Sparkles, Target } from "lucide-react";

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
    <div className="animate-fade-in flex flex-col gap-8 max-w-lg mx-auto w-full pt-10 px-4 pb-24">
      <header className="py-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/20">
                <Activity size={18} className="text-[#bc13fe]" />
            </div>
            <div>
                <h1 className="text-xl font-extrabold tracking-tight">Workouts</h1>
                <p className="text-[10px] font-bold text-[#bc13fe] uppercase tracking-widest mt-0.5">AI Guided</p>
            </div>
        </div>
      </header>

      {!workout && !loading && (
        <div className="flex flex-col gap-8 animate-fade-in">
          <section className="glass border-[#bc13fe]/10 bg-white/[0.01] flex flex-col gap-6 p-8 rounded-[40px] shadow-2xl overflow-hidden relative group">
             <div>
                <h3 className="text-xs font-black text-[#bc13fe] uppercase tracking-widest px-3 py-1 bg-[#bc13fe]/10 rounded-full inline-block mb-4">Workout Style</h3>
                <textarea 
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="E.g. only pushups, no equipment, joint pain, cardio focus..."
                    className="glass-input !min-h-[160px] !bg-black/40 !border-white/5 !rounded-[28px] !p-6 text-sm leading-relaxed outline-none"
                />
             </div>
             
             <div className="flex flex-col items-center gap-2 pt-4">
               <div className="flex items-center gap-2 text-[#94a3b8] text-[10px] font-black uppercase tracking-widest">
                  <Info size={12} />
                  <span>Age-Safe Exercises Active</span>
               </div>
               <button onClick={generateNewWorkout} className="btn-primary mt-4 h-16 rounded-[24px]">
                 <Sparkles size={18} className="mr-2" />
                 Create Workout Plan
               </button>
             </div>
          </section>
        </div>
      )}

      {loading && (
        <div className="glass py-24 flex flex-col items-center justify-center text-center gap-8 border-none bg-gradient-to-br from-[#bc13fe]/[0.05] to-transparent rounded-[48px] shadow-2xl">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-[#bc13fe] animate-spin"></div>
                <Activity size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Creating Plan</h2>
                <p className="text-sm text-[#94a3b8] mt-2 font-medium tracking-wide">Choosing the best exercises for you...</p>
            </div>
        </div>
      )}

      {workout && !loading && (
        <div className="flex flex-col gap-8 animate-fade-in">
          <section className="glass border-none bg-gradient-to-tr from-[#bc13fe] to-[#8a2be2] p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <Target size={120} className="text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase text-white leading-none">{workout.planName}</h2>
            <div className="flex gap-3 mt-5">
                <span className="text-[9px] font-black text-white/50 bg-black/20 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Exercises</span>
                <span className="text-[9px] font-black text-white/50 bg-black/20 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">AI Result</span>
            </div>
          </section>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 px-4 mb-2">
                <ClipboardList size={14} className="text-[#94a3b8]" />
                <h3 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em]">Exercise List</h3>
             </div>
            {workout?.exercises?.map((ex: any, idx: number) => (
              <div key={idx} className="glass flex items-center justify-between p-6 bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all rounded-[28px] border ripple">
                <div className="flex gap-5 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#bc13fe]/10 flex items-center justify-center text-[#bc13fe] text-xs font-black">
                     0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-black tracking-tight">{ex.name}</h4>
                    <p className="text-[10px] font-bold text-[#64748b] mt-1 space-x-2 tracking-widest uppercase">
                        <span>{ex.muscle}</span>
                        <span className="opacity-30">•</span>
                        <span>{ex.sets} Sets</span>
                        <span className="opacity-30">•</span>
                        <span>{ex.reps} Reps</span>
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                    <Play size={16} className="text-[#bc13fe]" />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setWorkout(null)} className="btn-primary h-16 rounded-[24px] mt-4 shadow-xl">
             Done
          </button>
        </div>
      )}

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .tracking-widest { letter-spacing: 0.15em; }
        .ripple { position: relative; overflow: hidden; }
      `}</style>
    </div>
  );
}
