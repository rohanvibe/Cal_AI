"use client";

import { useState, useEffect } from "react";
import { User, Settings, Bell, Shield, LogOut, Award, ChevronRight, Save, Trash2 } from "lucide-react";

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
    <div className="flex flex-col gap-6 pb-20 animate-fade-in">
      <header className="py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Settings size={20} className="text-[var(--text-secondary)]" />
      </header>

      {/* Profile Card */}
      <section className="glass p-6 flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] p-1">
            <div className="w-full h-full rounded-full bg-[var(--bg-color)] flex items-center justify-center overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${profile.name}`} alt="avatar" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--accent)] border-4 border-[var(--bg-color)] flex items-center justify-center">
            <Award size={14} className="text-black" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-[var(--text-secondary)]">Level 1 • Cal AI Member</p>
        </div>
      </section>

      {/* Profile Form / Info */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="font-bold uppercase text-xs tracking-widest text-[var(--text-secondary)]">Personal Stats</h3>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-[var(--primary)] flex items-center gap-1 font-semibold"
            >
                {isEditing ? <><Save size={14} /> Save</> : "Edit Info"}
            </button>
        </div>

        <div className="glass p-4 divide-y divide-[var(--card-border)]">
            {[
                { label: "Weight", value: `${profile?.weight || 0} kg`, key: "weight" },
                { label: "Height", value: `${profile?.height || 0} cm`, key: "height" },
                { label: "Goal", value: (profile?.suggestedGoal || "Plan Calculated"), key: "goal" },
                { label: "Activity", value: (profile?.activity || "moderate").charAt(0).toUpperCase() + (profile?.activity || "moderate").slice(1), key: "activity" }
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                    <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                    {isEditing ? (
                        <input 
                            type="text" 
                            defaultValue={item.value} 
                            className="bg-transparent text-right text-sm font-semibold text-[var(--primary)] border-b border-[var(--primary)] outline-none"
                        />
                    ) : (
                        <span className="text-sm font-semibold">{item.value}</span>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* App Settings */}
      <section className="flex flex-col gap-3">
        <h3 className="font-bold px-1 uppercase text-xs tracking-widest text-[var(--text-secondary)]">App Settings</h3>
        <div className="glass overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-3 text-blue-500">
                    <Bell size={18} />
                    <span className="text-sm text-white">Notifications</span>
                </div>
                <ChevronRight size={16} className="text-[var(--text-secondary)]" />
            </div>
            
            <div onClick={handleReset} className="flex items-center justify-between p-4 text-red-500 bg-red-500/5 cursor-pointer">
                <div className="flex items-center gap-3">
                    <Trash2 size={18} />
                    <span className="text-sm font-semibold">Reset App Data</span>
                </div>
            </div>
        </div>
      </section>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .gap-6 { gap: 24px; }
        .gap-4 { gap: 16px; }
        .gap-3 { gap: 12px; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-2xl { font-size: 1.5rem; }
        .text-xl { font-size: 1.25rem; }
        .text-sm { font-size: 0.875rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .rounded-full { border-radius: 9999px; }
        .divide-y > * + * { border-top-width: 1px; }
        .tracking-widest { letter-spacing: 0.1em; }
        .font-semibold { font-weight: 600; }
      `}</style>
    </div>
  );
}
