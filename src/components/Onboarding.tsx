"use client";

import { useState } from "react";
import { ChevronRight, Ruler, Scale, Activity, Target } from "lucide-react";

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
      alert(`AI Error: ${error.message}. Please verify your API key.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0c0c0e] z-[2000] flex items-center justify-center p-8 animate-fade-in">
      <div className="w-full max-w-md flex flex-col gap-10">
        {loading ? (
            <div className="flex flex-col items-center gap-8 py-10 text-center animate-fade-in">
                <div className="relative">
                    <Activity size={48} className="text-white animate-pulse" />
                </div>
                <div>
                   <h2 className="text-3xl font-bold tracking-tight">Syncing Profile</h2>
                   <p className="text-lg text-[#8a8a8e] mt-3 font-medium">Fine-tuning AI models for your biometrics...</p>
                </div>
            </div>
        ) : (
            <>
        <header className="flex flex-col gap-4">
            <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-[3px] rounded-full transition-all duration-300 ${step >= i ? 'w-12 bg-white' : 'w-6 bg-[#222226]'}`}></div>
                ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight mt-2">
                {step === 1 && "Personal details"}
                {step === 2 && "Physical metrics"}
                {step === 3 && "Your ambition"}
            </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <input 
                required 
                type="text" 
                placeholder="Name" 
                className="glass-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                required 
                type="number" 
                placeholder="Age" 
                className="glass-input"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
              <button type="button" onClick={nextStep} className="btn-primary mt-6">
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required 
                  type="number" 
                  placeholder="Weight (kg)"
                  className="glass-input"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
                <input 
                  required 
                  type="number" 
                  placeholder="Height (cm)"
                  className="glass-input"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>

              <select 
                className="glass-input appearance-none bg-[#1c1c21]"
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
              >
                <option value="sedentary">Sedentary (Office/School)</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Very Active (Daily)</option>
              </select>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button type="button" onClick={prevStep} className="glass py-5 text-sm font-bold uppercase tracking-widest bg-transparent border-[#222226] hover:bg-[#16161a] transition-all">Back</button>
                <button type="button" onClick={nextStep} className="btn-primary">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <textarea 
                required
                placeholder="Describe your health goal..."
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="glass-input min-h-[160px] resize-none leading-relaxed"
              />

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button type="button" onClick={prevStep} className="glass py-5 text-sm font-bold uppercase tracking-widest bg-transparent border-[#222226] hover:bg-[#16161a] transition-all">Back</button>
                <button type="submit" className="btn-primary">Complete</button>
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
