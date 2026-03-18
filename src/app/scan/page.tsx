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
    <div className="flex flex-col gap-4 max-w-lg mx-auto w-full pt-4 pb-20 px-4">
      <header className="py-2 flex justify-between items-center border-b border-white/5 px-2">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/20">
                <Utensils size={16} className="text-[#bc13fe]" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Scanner</h1>
        </div>
      </header>

      {!image ? (
        <div className="flex flex-col items-center justify-center py-10 gap-8 animate-fade-in">
           {/* ONE BUTTON DESIGN */}
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="w-full h-[60vh] flex flex-col items-center justify-center gap-8 bg-[#bc13fe] rounded-[48px] shadow-[0_20px_60px_-10px_rgba(188,19,254,0.5)] border-none transition-all active:scale-[0.98] group relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                 <div className="w-24 h-24 rounded-[36px] bg-white flex items-center justify-center text-[#bc13fe] shadow-2xl">
                    <Camera size={48} />
                 </div>
                 <div className="text-center">
                    <span className="text-3xl font-black tracking-tight block text-white uppercase italic">Scan Meal</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-2">Activate Optic Tracking</span>
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
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* ULTRA COMPACT IMAGE PREVIEW */}
          <div className="relative px-2">
            <div className="glass p-1.5 overflow-hidden bg-black/40 border-none rounded-[24px] shadow-xl w-32 h-24 mx-auto relative">
                <img src={image} alt="Meal preview" className="w-full h-full object-cover rounded-[18px]" />
                {!result && !loading && (
                <button 
                    onClick={reset}
                    className="absolute top-2 right-2 glass p-1.5 rounded-full text-white bg-black/60 border-none shadow-xl"
                >
                    <X size={14} />
                </button>
                )}
            </div>
          </div>

          {!result ? (
            <button 
              onClick={analyzeMeal}
              disabled={loading}
              className="btn-primary h-16 rounded-[24px] shadow-[0_10px_30px_-5px_var(--primary-glow)] flex items-center justify-center gap-3"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
              <span className="font-extrabold text-xl uppercase italic">{loading ? "Analyzing..." : "Analyze Meal"}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in pb-10">
              <section className="glass border-none flex flex-col gap-4 bg-[#16161a] rounded-[32px] shadow-2xl relative overflow-hidden p-6">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#bc13fe] uppercase leading-tight">{result.name}</h2>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {result.ingredients?.slice(0, 3).map((ing: string) => (
                        <span key={ing} className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full text-[#94a3b8]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right glass bg-white/5 border-none p-3 rounded-2xl min-w-[80px]">
                    <span className="text-2xl font-black tracking-tighter">{result.calories}</span>
                    <p className="text-[8px] text-[#4c4c50] uppercase font-bold tracking-widest">Kcal</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 z-10">
                  <div className="text-center">
                    <p className="text-lg font-black">{result.protein}g</p>
                    <p className="text-[7px] text-[#4c4c50] uppercase font-bold tracking-widest">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black">{result.carbs}g</p>
                    <p className="text-[7px] text-[#4c4c50] uppercase font-bold tracking-widest">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black">{result.fats}g</p>
                    <p className="text-[7px] text-[#4c4c50] uppercase font-bold tracking-widest">Fats</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass bg-white/[0.01] border-white/5 p-4 rounded-[18px] z-10">
                    <AlertCircle size={14} className="text-[#bc13fe] mt-0.5" />
                    <p className="text-[11px] text-[#94a3b8] leading-tight font-medium line-clamp-2">{result.tips}</p>
                </div>

                <div className="flex gap-3 mt-1 z-10">
                  <button onClick={reset} className="flex-1 glass py-4 text-[9px] font-black uppercase tracking-widest bg-white/5 border-none">Discard</button>
                  <button onClick={handleSave} className="flex-[2] btn-primary py-4 flex items-center justify-center gap-2 rounded-[18px]">
                    <Check size={18} /> <span className="font-extrabold uppercase text-xs">Add Entry</span>
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
