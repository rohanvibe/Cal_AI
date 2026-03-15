"use client";

import React, { useState } from 'react';
import { User, Activity, Target, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'other',
    age: '',
    weight: '',
    height: '',
    activity: 'moderate',
    goal: 'maintenance'
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
      alert(`AI Error: ${error.message}. Please check your API key and try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-overlay animate-fade-in">
      <div className="onboarding-card glass p-8 w-full max-w-md">
        {loading ? (
            <div className="flex flex-col items-center gap-6 py-10 text-center animate-fade-in">
                <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <div>
                   <h2 className="text-xl font-bold">Consulting Cal AI...</h2>
                   <p className="text-sm text-[var(--text-secondary)] mt-2">Designing your personalized nutrition and workout plan based on your metrics.</p>
                </div>
            </div>
        ) : (
            <>
        <div className="progress-bar mb-8">
            <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h2 className="text-2xl font-bold">Welcome to Cal AI</h2>
              <p className="text-[var(--text-secondary)] text-sm">Let's start with your basics.</p>
              
              <div className="input-group">
                <label>What's your name?</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="glass-input"
                />
              </div>

              <div className="input-group">
                <label>Age</label>
                <input 
                  type="number" 
                  required
                  placeholder="Years"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="glass-input"
                />
              </div>

              <button type="button" onClick={nextStep} className="btn-primary mt-4">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h2 className="text-2xl font-bold">Body Metrics</h2>
              <p className="text-[var(--text-secondary)] text-sm">This helps us calculate your calorie targets.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="kg"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="glass-input"
                  />
                </div>
                <div className="input-group">
                  <label>Height (cm)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="cm"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Activity Level</label>
                <select 
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    className="glass-input"
                >
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="moderate">Moderate (3-4 workouts/week)</option>
                    <option value="active">Active (Daily workouts)</option>
                    <option value="elite">Elite Athlete</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={prevStep} className="flex-1 glass p-3 text-sm">Back</button>
                <button type="button" onClick={nextStep} className="flex-[2] btn-primary">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h2 className="text-2xl font-bold">Your Ambition</h2>
              <p className="text-[var(--text-secondary)] text-sm">Tell Cal AI exactly what you want to achieve. Be as specific as you like.</p>
              
              <div className="input-group">
                <label>Define Your Goal</label>
                <textarea 
                  required
                  placeholder="e.g. I want to lose 5kg of fat while maintaining my current muscle mass and improving my stamina for a 5k run."
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="glass-input min-h-[120px] resize-none"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={prevStep} className="flex-1 glass p-3 text-sm">Back</button>
                <button type="submit" className="flex-[2] btn-primary">Analyze & Finish</button>
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
          background: var(--bg-color);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .progress-bar {
          height: 4px;
          background: var(--card-border);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-group label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          padding: 14px;
          border-radius: 12px;
          color: white;
          outline: none;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }
        .glass-input:focus {
          border-color: var(--primary);
        }
        select.glass-input {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
        }
      `}</style>
    </div>
  );
}
