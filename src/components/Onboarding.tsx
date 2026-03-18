"use client";

import { useState } from "react";
import { ChevronRight, Ruler, Scale, Activity, Target, ArrowRight, Zap, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    activity: 'moderate',
    goal: ''
  });

  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/profile/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to contact AI");
      }

      const aiEnrichedData = await response.json();
      onComplete(aiEnrichedData);
    } catch (error: any) {
      console.error(error);
      alert(`AI Sync Failed: ${error.message}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#08080a] z-[2000] flex items-center justify-center p-8 animate-fade-in overflow-hidden relative">
      {/* Background Decorative Mesh - Modern Fancy Touches */}
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#bc13fe] to-transparent opacity-20"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#bc13fe]/5 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-lg flex flex-col gap-12 text-center items-center">
        {loading ? (
            <div className="flex flex-col items-center gap-10 py-20 animate-fade-in">
                <div className="relative">
                    <div className="w-24 h-24 rounded-[36px] bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/20 animate-pulse">
                        <Activity size={48} className="text-[#bc13fe]" />
                    </div>
                    <Sparkles size={24} className="absolute -top-3 -right-3 text-[#bc13fe]" />
                </div>
                <div>
                   <h2 className="text-4xl font-extrabold tracking-tight uppercase italic leading-none">Syncing Profile</h2>
                   <p className="text-lg text-[#94a3b8] mt-5 font-medium max-w-xs leading-relaxed">Synthesizing biometric data for age-adaptive nutrition.</p>
                </div>
            </div>
        ) : (
            <>
        <header className="flex flex-col gap-6 items-center">
            <div className="flex gap-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-[4px] rounded-full transition-all duration-500 ${step >= i ? 'w-14 bg-[#bc13fe] shadow-[0_0_15px_#bc13fe]' : 'w-6 bg-white/5'}`}></div>
                ))}
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter leading-none mt-4 uppercase italic">
                {step === 1 && "The Genesis"}
                {step === 2 && "Core Metrics"}
                {step === 3 && "Destiny"}
            </h1>
            <p className="text-sm text-[#94a3b8] font-semibold tracking-widest uppercase opacity-60">Phase {step} Data Entry</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-sm">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in w-full">
              <input 
                required 
                type="text" 
                placeholder="Subject Name" 
                className="glass-input text-center !py-6 shadow-2xl !bg-white/[0.03] !border-white/5"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                required 
                type="number" 
                placeholder="Birth Age" 
                className="glass-input text-center !py-6 shadow-2xl !bg-white/[0.03] !border-white/5"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
              <button type="button" onClick={nextStep} className="btn-primary mt-6 !py-6 h-18 text-xl !rounded-[24px]">
                Proceed <ArrowRight size={22} className="ml-3" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in w-full">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required 
                  type="number" 
                  placeholder="KG"
                  className="glass-input text-center !py-6 shadow-2xl !bg-white/[0.03] !border-white/5"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
                <input 
                  required 
                  type="number" 
                  placeholder="CM"
                  className="glass-input text-center !py-6 shadow-2xl !bg-white/[0.03] !border-white/5"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>

              <div className="relative group">
                <select 
                  className="glass-input text-center appearance-none !bg-[#1c1c21] !py-6 shadow-2xl !border-white/5 focus:!border-[#bc13fe]/30"
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                >
                  <option value="sedentary">Sedentary Base</option>
                  <option value="light">Light Activity Index</option>
                  <option value="moderate">Moderate Optimization</option>
                  <option value="active">High Performance Load</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#94a3b8] opacity-20 pointer-events-none group-focus-within:text-[#bc13fe] group-focus-within:opacity-100 transition-all duration-300">
                    <Activity size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" onClick={prevStep} className="glass font-black uppercase tracking-widest text-[#94a3b8] !py-6 !bg-white/[0.01] border-white/5 hover:bg-white/5 transition-all !rounded-[24px] shadow-sm">Back</button>
                <button type="button" onClick={nextStep} className="btn-primary !py-6 h-18 text-xl !rounded-[24px]">Advanced</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in w-full">
              <textarea 
                required
                placeholder="Tell AI your objective destination..."
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="glass-input min-h-[220px] !py-8 !leading-relaxed text-center shadow-2xl !bg-white/[0.03] !border-white/5 !rounded-[32px] md:text-lg"
              />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" onClick={prevStep} className="glass font-black uppercase tracking-widest text-[#94a3b8] !py-6 !bg-white/[0.01] border-white/5 hover:bg-white/5 transition-all !rounded-[24px] shadow-sm">Back</button>
                <button type="submit" className="btn-primary !py-6 h-18 text-xl !rounded-[24px]">Finish Sync</button>
              </div>
            </div>
          )}
        </form>
        </>
        )}
      </div>

      <style jsx>{`
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: 1fr 1fr; }
        .h-18 { height: 72px; }
      `}</style>
    </div>
  );
}
