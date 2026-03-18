"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, RefreshCw, Upload, Check, X, AlertCircle, Sparkles, Utensils } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeal = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const response = await fetch("/api/meal-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    
    // Get existing stats for TODAY
    const today = new Date().toISOString().split('T')[0];
    const savedStats = localStorage.getItem(`cal-ai-stats-${today}`);
    let data = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    if (savedStats) {
      data = JSON.parse(savedStats);
    }
    
    // Increment stats
    data.calories += Number(result.calories || 0);
    data.protein += Number(result.protein || 0);
    data.carbs += Number(result.carbs || 0);
    data.fats += Number(result.fats || 0);
    
    localStorage.setItem(`cal-ai-stats-${today}`, JSON.stringify(data));
    
    // Success redirect
    router.push('/');
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-lg mx-auto w-full pt-4 pb-10 px-4">
      {!image ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-10">
           {/* BIG CONTRASTY BUTTON */}
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="w-full h-full flex flex-col items-center justify-center gap-10 bg-[#bc13fe] rounded-[60px] shadow-[0_30px_90px_-15px_rgba(188,19,254,0.6)] border-none transition-all active:scale-[0.96] relative overflow-hidden group"
           >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-8">
                 {/* 
                    FIX: Contrast Issue 
                    Was: white circle + violet icon (confusing in some lighting)
                    Now: Deep Black circle + Pure White Icon (IMPOSSIBLE to miss)
                 */}
                 <div className="w-28 h-28 rounded-[40px] bg-black flex items-center justify-center text-white shadow-2xl transition-transform group-active:scale-90">
                    <Camera size={56} strokeWidth={2.5} />
                 </div>
                 
                 <div className="text-center">
                    <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none mb-3">Add Meal</h2>
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] inline-block py-1 px-3 bg-black/20 rounded-full">Vision Engine Engaged</span>
                 </div>
              </div>
           </button>
           
           <input 
             type="file" 
             accept="image/*" 
             capture="environment" 
             ref={fileInputRef} 
             onChange={handleCapture}
             className="hidden" 
           />
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-fade-in flex-1">
          {/* ULTRA MINI PREVIEW TO SAVE SPACE */}
          {!result && (
            <div className="relative h-2/3 flex items-center justify-center">
              <div className="relative glass p-2 bg-black/40 rounded-[32px] overflow-hidden max-w-[200px] w-full">
                <img src={image} alt="Meal preview" className="w-full aspect-square object-cover rounded-[24px]" />
                <button 
                    onClick={reset}
                    className="absolute top-4 right-4 glass p-2 rounded-full text-white bg-black/60 border-none"
                >
                    <X size={18} />
                </button>
              </div>
            </div>
          )}

          {!result ? (
            <div className="mt-auto pb-10">
                <button 
                onClick={analyzeMeal}
                disabled={loading}
                className="btn-primary h-20 rounded-[30px] shadow-[0_15px_40px_-5px_var(--primary-glow)] flex items-center justify-center gap-4 text-2xl"
                >
                {loading ? <RefreshCw className="animate-spin" size={32} /> : <Upload size={32} />}
                <span className="font-black uppercase italic">{loading ? "Scanning..." : "Sync Meal"}</span>
                </button>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-fade-in justify-end pb-4">
              {/* COMPACT FLOATING RESULT CARD */}
              <section className="glass border-none flex flex-col gap-4 bg-[#111114] rounded-[40px] shadow-2xl p-6 border-t-2 border-t-[#bc13fe]/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter text-[#bc13fe] uppercase leading-none mb-2">{result.name}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] opacity-60 line-clamp-1">{result.ingredients?.join(' • ')}</p>
                  </div>
                  <div className="text-right glass bg-white/5 border-none p-3 px-5 rounded-3xl">
                    <span className="text-3xl font-black tracking-tighter text-white">{result.calories}</span>
                    <p className="text-[8px] text-[#bc13fe] uppercase font-black tracking-widest mt-0.5">Calories</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-5 border-y border-white/5 mx-2">
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{result.protein}g</p>
                    <p className="text-[7px] text-[#4c4c50] uppercase font-bold tracking-widest">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{result.carbs}g</p>
                    <p className="text-[7px] text-[#4c4c50] uppercase font-bold tracking-widest">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{result.fats}g</p>
                    <p className="text-[7px] text-[#4c4c50] uppercase font-bold tracking-widest">Fats</p>
                  </div>
                </div>

                {/* SUPER COMPACT BUTTONS - NO SCROLLING */}
                <div className="flex gap-4 pt-2">
                  <button onClick={reset} className="flex-1 glass py-5 text-[10px] font-black uppercase tracking-widest border-none bg-white/5 text-[#94a3b8] rounded-[24px]">Cancel</button>
                  <button onClick={handleSave} className="flex-[3] btn-primary py-5 flex items-center justify-center gap-3 rounded-[24px] text-lg">
                    <Check size={24} /> <span className="font-black uppercase italic">Add Entry</span>
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .grid { display: grid; }
        .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
