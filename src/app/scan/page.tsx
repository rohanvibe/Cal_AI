"use client";

import { useState, useRef } from "react";
import { Camera, RefreshCw, Upload, Check, X, Info } from "lucide-react";

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
    <div className="animate-fade-in flex flex-col gap-6">
      <header className="py-4">
        <h1 className="text-2xl font-semibold tracking-tight">Scan Meal</h1>
        <p className="text-sm text-[#8a8a8e]">Verify nutrition via machine vision.</p>
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="glass flex-col items-center justify-center gap-4 cursor-pointer min-h-[360px] flex border-dashed border-2"
        >
          <Camera size={32} className="text-[#8a8a8e]" />
          <div className="text-center">
            <span className="text-sm font-medium block">Begin Analysis</span>
            <span className="text-xs text-[#4c4c50]">Supports JPEG, PNG</span>
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
          <div className="relative glass p-1 overflow-hidden bg-black">
            <img src={image} alt="Meal preview" className="w-full aspect-video object-cover rounded-xl" />
            {!result && !loading && (
              <button 
                onClick={reset}
                className="absolute top-4 right-4 glass p-2 rounded-full text-white bg-black/60 border-none"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {!result ? (
            <button 
              onClick={analyzeMeal}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 h-14"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
              {loading ? "Processing" : "Analyze Meal"}
            </button>
          ) : (
            <div className="flex flex-col gap-6 pb-10">
              <section className="glass border-none flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{result.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.ingredients?.slice(0, 3).map((ing: string) => (
                        <span key={ing} className="text-[10px] bg-[#1c1c1f] px-2 py-1 rounded text-[#8a8a8e] font-medium uppercase tracking-tight">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{result.calories}</span>
                    <p className="text-[10px] text-[#4c4c50] uppercase font-bold tracking-wider">Calories</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#1c1c1f]">
                  <div className="text-center">
                    <p className="text-sm font-semibold">{result.protein}g</p>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-wider">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{result.carbs}g</p>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-wider">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{result.fats}g</p>
                    <p className="text-[9px] text-[#4c4c50] uppercase font-bold tracking-wider">Fats</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#111114] p-4 rounded-xl border border-[#1c1c1f]">
                  <Info size={16} className="text-[#8a8a8e] mt-0.5" />
                  <p className="text-xs text-[#8a8a8e] leading-relaxed">{result.tips}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={reset} className="flex-1 glass py-3 text-xs font-semibold">Cancel</button>
                  <button className="flex-[2] btn-primary py-3 flex items-center justify-center gap-2">
                    <Check size={16} /> Save Data
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
