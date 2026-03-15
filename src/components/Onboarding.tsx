"use client";

import { useState } from "react";
import { ChevronRight, Ruler, Scale, Activity, Target, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 bg-[#0c0c0e] z-[2000] flex items-center justify-center p-8 animate-fade-in">
      {/* 
          FIX: Balanced and Centered Content
          Content is now strictly centered and uses SOLID buttons that don't look like text.
      */}
      <div className="w-full max-w-lg flex flex-col gap-12 text-center items-center">
        {loading ? (
            <div className="flex flex-col items-center gap-10 py-20 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-[#1c1c1f] flex items-center justify-center border border-[#222226] animate-pulse">
                    <Activity size={40} className="text-white" />
                </div>
                <div>
                   <h2 className="text-3xl font-extrabold tracking-tight">Syncing Biology</h2>
                   <p className="text-lg text-[#8a8a8e] mt-4 font-medium max-w-xs">Connecting your biometric data to the AI nutrition engine.</p>
                </div>
            </div>
        ) : (
            <>
        <header className="flex flex-col gap-6 items-center">
            <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-[4px] rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-white' : 'w-6 bg-[#222226]'}`}></div>
                ))}
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter leading-none mt-4">
                {step === 1 && "Personal details"}
                {step === 2 && "Physical metrics"}
                {step === 3 && "Your ambition"}
            </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in w-full">
              <input 
                required 
                type="text" 
                placeholder="Full Name" 
                className="glass-input text-center !py-6"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                required 
                type="number" 
                placeholder="Birth Age" 
                className="glass-input text-center !py-6"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
              <button type="button" onClick={nextStep} className="btn-primary mt-6 !py-6">
                Next <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5 animate-fade-in w-full">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required 
                  type="number" 
                  placeholder="KG"
                  className="glass-input text-center !py-6"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
                <input 
                  required 
                  type="number" 
                  placeholder="CM"
                  className="glass-input text-center !py-6"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>

              <select 
                className="glass-input text-center appearance-none bg-[#1c1c21] !py-6"
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
              >
                <option value="sedentary">Sedentary Profile</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Training</option>
                <option value="active">High Performance</option>
              </select>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" onClick={prevStep} className="glass font-bold uppercase tracking-widest text-[#8a8a8e] !py-6 bg-[#111114] border-[#222226] hover:bg-[#16161a]">Back</button>
                <button type="button" onClick={nextStep} className="btn-primary !py-6">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in w-full">
              <textarea 
                required
                placeholder="Define your health destination..."
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="glass-input min-h-[180px] !py-6 !leading-relaxed text-center"
              />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" onClick={prevStep} className="glass font-bold uppercase tracking-widest text-[#8a8a8e] !py-6 bg-[#111114] border-[#222226] hover:bg-[#16161a]">Back</button>
                <button type="submit" className="btn-primary !py-6">Finish Sync</button>
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
      `}</style>
    </div>
  );
}
