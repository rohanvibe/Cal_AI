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
    <div className="flex flex-col gap-6 h-full min-h-[80vh] pb-10">
      <header className="py-6 pt-10">
        <div className="flex items-center gap-2 mb-1 text-[var(--primary)] font-black uppercase tracking-[0.2em] text-[10px]">
            <Utensils size={12} />
            <span>Optic Engine</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Meal Scan</h1>
        <p className="text-[var(--text-secondary)] text-xs mt-1 font-medium">Verify your nutrition with computer vision.</p>
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 glass border-dashed border-2 border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-6 cursor-pointer min-h-[400px] rounded-[48px] group active:scale-[0.98] transition-all"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-[32px] bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform duration-500">
                <Camera size={44} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={16} />
            </div>
          </div>
          <div className="text-center">
            <span className="text-lg font-black italic uppercase tracking-tighter block mb-1">Tap to Capture</span>
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">AI analysis of ingredients</span>
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
          <div className="relative glass p-3 border-none bg-black/40 overflow-hidden rounded-[40px] shadow-2xl">
            <img src={image} alt="Meal preview" className="w-full aspect-video object-cover rounded-[32px]" />
            {!result && !loading && (
              <button 
                onClick={reset}
                className="absolute top-6 right-6 glass p-3 rounded-full text-white bg-black/40 hover:bg-black/60 transition-colors border-none"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {!result ? (
            <button 
              onClick={analyzeMeal}
              disabled={loading}
              className="btn-primary w-full h-16 rounded-[24px] flex items-center justify-center gap-3"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
              <span className="font-black italic uppercase tracking-tighter text-lg">{loading ? "Synchronizing..." : "Analyze Biological Profile"}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in pb-10">
              <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border-none">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--primary)]">{result.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {result.ingredients?.slice(0, 4).map((ing: string) => (
                        <span key={ing} className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-[var(--text-secondary)]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right glass p-4 rounded-3xl bg-white/[0.02] border-white/5">
                    <span className="text-3xl font-black italic tracking-tighter text-white">{result.calories}</span>
                    <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Total Cal</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-6 border-y border-white/5">
                  <div className="flex flex-col items-center">
                    <p className="text-xl font-black italic tracking-tighter">{result.protein}g</p>
                    <p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Protein</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xl font-black italic tracking-tighter">{result.carbs}g</p>
                    <p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Carbs</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xl font-black italic tracking-tighter">{result.fats}g</p>
                    <p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-1">Fats</p>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-4 glass-tip p-5 rounded-[24px]">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] mb-1">AI Health Insight</p>
                    <p className="text-xs text-white/80 leading-relaxed font-medium">{result.tips}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={reset} className="flex-1 glass p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Retake</button>
                  <button className="flex-[2] btn-primary h-14 rounded-2xl flex items-center justify-center gap-2">
                    <Check size={20} /> <span className="font-black italic uppercase tracking-tighter">Add to Log</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .glass-tip {
            background: rgba(0, 242, 255, 0.05);
            border: 1px solid rgba(0, 242, 255, 0.1);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .grid { display: grid; }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
      `}</style>
    </div>
  );
}
