"use client";

import { useState } from "react";
import { User, Settings, Bell, Shield, LogOut, Award, ChevronRight, Save } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Rohan",
    weight: 78.5,
    height: 180,
    age: 24,
    goal: "leangain",
    activity: "active"
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="py-4 flex justify-between items-center">
        <h1 className="text-2xl">Profile</h1>
        <Settings size={20} className="text-[var(--text-secondary)]" />
      </header>

      {/* Profile Card */}
      <section className="glass p-6 flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] p-1">
            <div className="w-full h-full rounded-full bg-[var(--bg-color)] flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=Rohan" alt="avatar" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--accent)] border-4 border-[var(--bg-color)] flex items-center justify-center">
            <Award size={14} className="text-black" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-[var(--text-secondary)]">Elite Member • Level 15</p>
        </div>
        <div className="flex gap-4 w-full mt-2">
            <div className="flex-1 glass p-3">
                <p className="text-lg font-bold">12</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase">Streak</p>
            </div>
            <div className="flex-1 glass p-3">
                <p className="text-lg font-bold">84%</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase">Accuracy</p>
            </div>
        </div>
      </section>

      {/* Profile Form / Info */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
            <h3 className="font-bold">Personal Stats</h3>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-[var(--primary)] flex items-center gap-1"
            >
                {isEditing ? <><Save size={14} /> Save</> : "Edit Info"}
            </button>
        </div>

        <div className="glass p-4 divide-y divide-[var(--card-border)]">
            {[
                { label: "Current Weight", value: `${profile.weight} kg`, key: "weight" },
                { label: "Height", value: `${profile.height} cm`, key: "height" },
                { label: "Target Goal", value: "Leangain", key: "goal" },
                { label: "Activity Level", value: "Highly Active", key: "activity" }
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
        <h3 className="font-bold px-1">App Settings</h3>
        <div className="glass overflow-hidden">
            {[
                { icon: Bell, label: "Reminders & Notifications", color: "text-blue-500" },
                { icon: Shield, label: "Privacy & Security", color: "text-purple-500" },
                { icon: LogOut, label: "Sign Out", color: "text-red-500" }
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer transition-colors border-b border-[var(--card-border)] last:border-0">
                    <div className="flex items-center gap-3">
                        <item.icon size={18} className={item.color} />
                        <span className="text-sm">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-secondary)]" />
                </div>
            ))}
        </div>
      </section>

      <style jsx>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .flex-1 { flex: 1; }
        .gap-6 { gap: 24px; }
        .gap-4 { gap: 16px; }
        .gap-3 { gap: 12px; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; }
        .text-xl { font-size: 1.25rem; font-weight: 700; }
        .text-lg { font-size: 1.125rem; font-weight: 700; }
        .text-sm { font-size: 0.875rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
        .rounded-full { border-radius: 9999px; }
        .divide-y > * + * { border-top-width: 1px; }
      `}</style>
    </div>
  );
}
