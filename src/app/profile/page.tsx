"use client";

import { useState, useEffect } from "react";
import { User, Settings, Shield, Trash2, ChevronRight, Save, Activity } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('cal-ai-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleReset = () => {
    if (confirm("Reset all data? This will return you to onboarding.")) {
        localStorage.removeItem('cal-ai-profile');
        window.location.href = '/';
    }
  };

  if (!profile) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-10">
      <header className="py-4">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      </header>

      <section className="glass flex flex-col items-center gap-4 text-center py-8">
        <div className="w-20 h-20 rounded-2xl bg-[#1c1c1f] flex items-center justify-center border border-[#222226]">
           <User size={32} className="text-[#8a8a8e]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{profile.name}</h2>
          <p className="text-xs text-[#8a8a8e] mt-1 font-medium">Standard Account</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-[#8a8a8e] uppercase tracking-wider">Parameters</h3>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-white px-3 py-1 bg-[#1c1c1f] rounded-lg"
            >
                {isEditing ? "Save" : "Edit"}
            </button>
        </div>

        <div className="glass p-0 divide-y divide-[#1c1c1f] overflow-hidden">
            {[
                { label: "Weight", value: `${profile?.weight || 0} kg` },
                { label: "Height", value: `${profile?.height || 0} cm` },
                { label: "Goal", value: profile?.suggestedGoal || "Calculated" },
                { label: "Activity", value: (profile?.activity || "moderate") }
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4">
                    <span className="text-sm text-[#8a8a8e]">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                </div>
            ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-[#8a8a8e] uppercase tracking-wider">Security</h3>
        <div className="glass p-0 overflow-hidden divide-y divide-[#1c1c1f]">
            <div onClick={handleReset} className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1a1a1e] transition-colors">
                <div className="flex items-center gap-3">
                    <Trash2 size={16} className="text-[#8a8a8e]" />
                    <span className="text-sm font-medium">Reset Profile</span>
                </div>
                <ChevronRight size={14} className="text-[#4c4c50]" />
            </div>
        </div>
      </section>
    </div>
  );
}
