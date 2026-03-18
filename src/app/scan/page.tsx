"use client";

import { useState, useRef } from "react";
import { Camera, RefreshCw, Upload, Check, X, AlertCircle, Sparkles, Utensils } from "lucide-react";

export default function ScanPage() {
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

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full pt-6 pb-20 px-4">
      <header className="py-4 flex justify-between items-center border-b border-white/5 px-2">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/20">
                <Utensils size={16} className="text-[#bc13fe]" />
            </div>
            <div>
                <h1 className="text-xl font-extrabold tracking-tight">Meal Scan</h1>
                <p className="text-[9px] font-bold text-[#bc13fe] uppercase tracking-widest mt-0.5">Optic Engine Live</p>
            </div>
        </div>
      </header>

      {!image ? (
        <div className="flex flex-col items-center justify-center py-10 gap-8 animate-fade-in">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="w-full flex flex-col items-center justify-center gap-6 cursor-pointer py-16 bg-[#bc13fe]/[0.02] border-2 border-dashed border-[#bc13fe]/20 rounded-[40px] shadow-xl hover:bg-[#bc13fe]/[0.05] transition-all group"
           >
              <div className="relative">
                 <div className="w-20 h-20 rounded-[28px] bg-[#bc13fe] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(188,19,254,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <Camera size={36} />
                 </div>
                 <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#bc13fe] shadow-lg">
                    <Sparkles size={14} />
                 </div>
              </div>
              <div className="text-center">
                <span className="text-xl font-black tracking-tight block mb-1">Click to Scan Meal</span>
                <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest">Immediate Vision Analysis</span>
              </div>
           </div>
           
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
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* COMPACT IMAGE PREVIEW */}
          <div className="relative glass p-1.5 overflow-hidden bg-black/40 border-none rounded-[32px] shadow-xl max-w-[280px] mx-auto">
            <img src={image} alt="Meal preview" className="w-full h-32 object-cover rounded-[24px]" />
            {!result && !loading && (
              <button 
                onClick={reset}
                className="absolute top-4 right-4 glass p-2 rounded-full text-white bg-black/60 border-none shadow-xl hover:bg-black/80 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {!result ? (
            <button 
              onClick={analyzeMeal}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-3 h-14 rounded-[20px] shadow-[0_10px_30px_-5px_var(--primary-glow)]"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Upload size={20} />}
              <span className="font-extrabold text-base">{loading ? "Synchronizing" : "Begin Analysis"}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in pb-10">
              <section className="glass border-none flex flex-col gap-5 bg-gradient-to-br from-[#bc13fe]/[0.05] to-transparent rounded-[32px] shadow-xl relative overflow-hidden p-6 pb-2">
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                   <Utensils size={140} />
                </div>
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-[#bc13fe] uppercase leading-none">{result.name}</h2>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {result.ingredients?.slice(0, 3).map((ing: string) => (
                        <span key={ing} className="text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-[#94a3b8]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right glass bg-white/10 border-none p-3 rounded-2xl">
                    <span className="text-2xl font-black tracking-tighter leading-none">{result.calories}</span>
                    <p className="text-[8px] text-[#4c4c50] uppercase font-bold tracking-widest mt-0.5">Total Cal</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-5 border-y border-white/5 z-10">
                  <div className="text-center">
                    <p className="text-xl font-black">{result.protein}g</p>
                    <p className="text-[8px] text-[#4c4c50] uppercase font-bold tracking-widest mt-0.5">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black">{result.carbs}g</p>
                    <p className="text-[8px] text-[#4c4c50] uppercase font-bold tracking-widest mt-0.5">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black">{result.fats}g</p>
                    <p className="text-[8px] text-[#4c4c50] uppercase font-bold tracking-widest mt-0.5">Fats</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass bg-white/[0.01] border-white/5 p-4 rounded-[20px] z-10">
                  <div className="w-8 h-8 rounded-xl bg-[#bc13fe]/10 flex items-center justify-center text-[#bc13fe] shrink-0">
                    <AlertCircle size={18} />
                  </div>
                  <p className="text-[12px] text-[#94a3b8] leading-snug font-medium line-clamp-3">{result.tips}</p>
                </div>

                <div className="flex gap-3 mt-1 z-10 pb-4">
                  <button onClick={reset} className="flex-1 glass py-4 text-[10px] font-black uppercase tracking-widest bg-white/5 border-none hover:bg-white/10 transition-colors">Discard</button>
                  <button className="flex-[2] btn-primary py-4 flex items-center justify-center gap-2 rounded-[18px]">
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
