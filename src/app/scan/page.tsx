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
    <div className="flex flex-col gap-10 max-w-lg mx-auto w-full pt-10 pb-20 px-4">
      <header className="py-6 flex justify-between items-center border-b border-white/5 px-2">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/20">
                <Utensils size={18} className="text-[#bc13fe]" />
            </div>
            <div>
                <h1 className="text-xl font-extrabold tracking-tight">Meal Scan</h1>
                <p className="text-[10px] font-bold text-[#bc13fe] uppercase tracking-widest mt-0.5">Optic Engine Live</p>
            </div>
        </div>
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="glass flex-col items-center justify-center gap-6 cursor-pointer min-h-[420px] flex border-dashed border-2 border-white/10 hover:border-[#bc13fe]/40 bg-white/[0.01]/[0.02] rounded-[48px] shadow-2xl transition-all hover:bg-white/[0.03] group"
        >
          <div className="relative">
             <div className="w-24 h-24 rounded-[36px] bg-[#bc13fe]/[0.08] flex items-center justify-center text-[#bc13fe] group-hover:scale-110 transition-transform duration-500">
                <Camera size={48} />
             </div>
             <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#bc13fe] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={16} />
             </div>
          </div>
          <div className="text-center">
            <span className="text-lg font-extrabold tracking-tight block mb-2">Capture Meal Insight</span>
            <span className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest">Supports Multi-Component Recognition</span>
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
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="relative glass p-2 overflow-hidden bg-black/40 border-none rounded-[40px] shadow-2xl">
            <img src={image} alt="Meal preview" className="w-full aspect-video object-cover rounded-[32px]" />
            {!result && !loading && (
              <button 
                onClick={reset}
                className="absolute top-6 right-6 glass p-3 rounded-full text-white bg-black/60 border-none shadow-xl hover:bg-black/80 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {!result ? (
            <button 
              onClick={analyzeMeal}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-3 h-16 rounded-[24px] shadow-[0_10px_30px_-5px_var(--primary-glow)]"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
              <span className="font-extrabold text-lg">{loading ? "Synchronizing" : "Begin Analysis"}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in pb-20">
              <section className="glass border-none flex flex-col gap-8 bg-gradient-to-br from-[#bc13fe]/[0.05] to-transparent rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                   <Utensils size={180} />
                </div>
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#bc13fe] uppercase">{result.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {result.ingredients?.slice(0, 4).map((ing: string) => (
                        <span key={ing} className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-[#94a3b8]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right glass bg-white/5 border-none p-4 rounded-3xl">
                    <span className="text-3xl font-black tracking-tighter">{result.calories}</span>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-widest mt-1">Total Cal</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-8 border-y border-white/5 z-10">
                  <div className="text-center">
                    <p className="text-2xl font-black">{result.protein}g</p>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-widest mt-1">Protein Index</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black">{result.carbs}g</p>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-widest mt-1">Carb Load</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black">{result.fats}g</p>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-widest mt-1">Fat Ratio</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 glass bg-white/[0.01] border-white/5 p-6 rounded-[28px] z-10">
                  <div className="w-10 h-10 rounded-2xl bg-[#bc13fe]/10 flex items-center justify-center text-[#bc13fe] shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#bc13fe] mb-1">AI Health Advisory</p>
                    <p className="text-sm text-[#94a3b8] leading-relaxed font-medium">{result.tips}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-2 z-10">
                  <button onClick={reset} className="flex-1 glass py-5 text-xs font-black uppercase tracking-widest bg-white/5 border-none hover:bg-white/10 transition-colors">Discard</button>
                  <button className="flex-[2] btn-primary py-5 flex items-center justify-center gap-3 rounded-[24px]">
                    <Check size={20} /> <span className="font-extrabold uppercase">Confirm Entry</span>
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
