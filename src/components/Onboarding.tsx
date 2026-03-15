"use client";

import { useState } from "react";
import { ChevronRight, ArrowLeft, Ruler, Scale, Activity, Target, Sparkles, User, Zap } from "lucide-react";

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
      alert(`AI Error: ${error.message}. Please check your API key.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-overlay animate-fade-in">
      <div className="onboarding-card glass p-8 w-full max-w-lg relative overflow-hidden">
        {/* Dynamic mesh gradient in card */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"></div>
        
        {loading ? (
            <div className="flex flex-col items-center gap-8 py-16 text-center animate-fade-in">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primary)]" size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-black italic uppercase tracking-tighter">Consulting Cal AI</h2>
                   <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed max-w-[280px]">Generating your biological profile and personalized nutrition blueprint...</p>
                </div>
            </div>
        ) : (
            <>
        <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">Setup Phase {step}/3</span>
            <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-white/10'}`}></div>
                ))}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 min-h-[340px]">
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Fundamentals</h2>
                <p className="text-[var(--text-secondary)] text-sm">Let's start with your basics.</p>
              </div>
              
              <div className="grid gap-6">
                <div className="input-group">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        required 
                        type="text" 
                        placeholder="e.g. Alex" 
                        className="glass-input pl-12"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-2 block">Age</label>
                  <input 
                    required 
                    type="number" 
                    placeholder="e.g. 24" 
                    className="glass-input"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="btn-primary mt-4 flex items-center justify-center gap-2">
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
               <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Metrics</h2>
                <p className="text-[var(--text-secondary)] text-sm">Your biological data points.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale size={14} className="text-[var(--primary)]" />
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Weight (kg)</label>
                  </div>
                  <input 
                    required 
                    type="number" 
                    className="glass-input"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler size={14} className="text-[var(--secondary)]" />
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Height (cm)</label>
                  </div>
                  <input 
                    required 
                    type="number" 
                    className="glass-input"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="flex items-center gap-2 mb-3">
                    <Activity size={14} className="text-[var(--accent)]" />
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Frequency</label>
                </div>
                <select 
                  className="glass-input appearance-none bg-black/40"
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                >
                  <option value="sedentary">Sedentary (Office/School)</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Very Active (Daily)</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={prevStep} className="flex-1 glass p-4 text-xs font-bold uppercase tracking-widest rounded-2xl">Back</button>
                <button type="button" onClick={nextStep} className="flex-[2] btn-primary">Define Goal</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Ambition</h2>
                <p className="text-[var(--text-secondary)] text-sm">Tell Cal AI exactly what you want.</p>
              </div>
              
              <div className="input-group">
                <div className="flex items-center gap-2 mb-3">
                    <Target size={14} className="text-[var(--primary)]" />
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">Main Objective</label>
                </div>
                <textarea 
                  required
                  placeholder="e.g. I want to build core strength and stay energetic for school without heavy lifting."
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="glass-input min-h-[140px] resize-none leading-relaxed text-sm"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={prevStep} className="flex-1 glass p-4 text-xs font-bold uppercase tracking-widest rounded-2xl">Back</button>
                <button type="submit" className="flex-[2] btn-primary flex items-center justify-center gap-2 group">
                    <Zap size={18} className="group-hover:animate-pulse" />
                    Start Bio-Sync
                </button>
              </div>
            </div>
          )}
        </form>
        </>
        )}
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(40px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2000;
        }
        .onboarding-card {
            border-radius: 32px;
            box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8), 0 0 40px rgba(var(--primary-rgb), 0.1);
        }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: 1fr 1fr; }
        .group:hover .btn-primary { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
