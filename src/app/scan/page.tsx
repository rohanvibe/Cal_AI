"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, RefreshCw, Upload, Check, X, AlertCircle } from "lucide-react";

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
    <div className="flex flex-col gap-6 h-full min-h-[80vh]">
      <header className="py-4">
        <h1 className="text-2xl">AI Meal Scanner</h1>
        <p className="text-[var(--text-secondary)] text-sm">Snap a photo to get instant nutrition data.</p>
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 glass border-dashed border-2 border-[var(--card-border)] flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[300px]"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--primary-glow)] flex items-center justify-center text-[var(--primary)] animate-pulse">
            <Camera size={40} />
          </div>
          <span className="font-semibold">Tap to Scan Meal</span>
          <span className="text-xs text-[var(--text-secondary)]">Supported: JPEG, PNG</span>
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
          <div className="relative glass p-2 overflow-hidden rounded-3xl aspect-[4/3]">
            <img src={image} alt="Meal preview" className="w-full h-full object-cover rounded-2xl" />
            {!result && !loading && (
              <button 
                onClick={reset}
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white backdrop-blur-md"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {!result ? (
            <button 
              onClick={analyzeMeal}
              disabled={loading}
              className="btn-primary w-full h-14"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Upload size={20} />}
              {loading ? "Analyzing..." : "Analyze Meal"}
            </button>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in pb-10">
              <div className="glass p-5 border-l-4 border-l-[var(--accent)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{result.name}</h2>
                    <div className="flex gap-2 mt-1">
                      {result.ingredients?.slice(0, 3).map((ing: string) => (
                        <span key={ing} className="text-[10px] bg-[var(--card-border)] px-2 py-0.5 rounded-full text-[var(--text-secondary)]">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[var(--primary)]">{result.calories}</span>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase">Calories</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-[var(--card-border)]">
                  <div className="text-center">
                    <p className="text-lg font-bold">{result.protein}g</p>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{result.carbs}g</p>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{result.fats}g</p>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase">Fats</p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 bg-[var(--primary-glow)] p-3 rounded-xl border border-[var(--primary)]/20">
                  <AlertCircle size={16} className="text-[var(--primary)] mt-1 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--primary)]">HEALTH TIPS</p>
                    <p className="text-xs text-white/80 leading-relaxed mt-1">{result.tips}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={reset} className="flex-1 glass p-3 text-sm font-semibold">Cancel</button>
                  <button className="flex-[2] btn-primary h-12 flex items-center justify-center gap-2">
                    <Check size={18} /> Add to Log
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1; }
        .gap-6 { gap: 24px; }
        .gap-4 { gap: 16px; }
        .gap-2 { gap: 8px; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; }
        .text-xl { font-size: 1.25rem; font-weight: 700; }
        .text-lg { font-size: 1.125rem; font-weight: 700; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .h-full { height: 100%; }
        .aspect-[4/3] { aspect-ratio: 4/3; }
        .object-cover { object-fit: cover; }
        .rounded-3xl { border-radius: 1.5rem; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-full { border-radius: 9999px; }
        .border-dashed { border-style: dashed; }
        .border-2 { border-width: 2px; }
        .cursor-pointer { cursor: pointer; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .hidden { display: none; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .grid { display: grid; }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-0.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
        .p-5 { padding: 1.25rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
        .p-2 { padding: 0.5rem; }
        .shrink-0 { flex-shrink: 0; }
        .mt-4 { margin-top: 1rem; }
        .mt-1 { margin-top: 0.25rem; }
        .mb-4 { margin-bottom: 1rem; }
        .border-y { border-top-width: 1px; border-bottom-width: 1px; }
      `}</style>
    </div>
  );
}
