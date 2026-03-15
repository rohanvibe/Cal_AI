"use client";

import { useState, useEffect } from "react";
import { User, Settings, Bell, Shield, LogOut, Award, ChevronRight, Save, Trash2, Activity, Zap } from "lucide-react";

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
    <div className="flex flex-col gap-8 pb-24 animate-fade-in">
      <header className="py-6 flex justify-between items-center pt-10">
        <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary)]">User Terminal</span>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Profile</h1>
        </div>
        <div className="glass p-3 rounded-2xl text-[var(--text-secondary)] border-white/5 active:scale-95 transition-transform">
            <Settings size={20} />
        </div>
      </header>

      {/* Profile Card */}
      <section className="glass p-8 flex flex-col items-center gap-6 text-center rounded-[40px] relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"></div>
        <div className="relative">
          <div className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] p-[3px] rotate-3">
            <div className="w-full h-full rounded-[38px] bg-[var(--bg-color)] flex items-center justify-center overflow-hidden rotate-[-3deg]">
               <img 
                    src={`https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${profile.name}`} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)] border-4 border-[var(--bg-color)]">
            <Zap size={18} className="text-black" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">{profile.name}</h2>
          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-4 py-1.5 rounded-full inline-block">
            Biological Sync Level 1
          </div>
        </div>
      </section>

      {/* Profile Info */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
                <Activity size={14} className="text-[var(--text-secondary)]" />
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-[var(--text-secondary)]">Personal Registry</h3>
            </div>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-[10px] uppercase font-black tracking-widest text-[var(--primary)] bg-[var(--primary-glow)] px-4 py-1.5 rounded-full"
            >
                {isEditing ? "Save Sync" : "Edit Registry"}
            </button>
        </div>

        <div className="glass p-2 divide-y divide-white/5 rounded-[32px] bg-white/[0.01]">
            {[
                { label: "Weight", value: `${profile?.weight || 0} KG`, key: "weight", icon: "⚖️" },
                { label: "Height", value: `${profile?.height || 0} CM`, key: "height", icon: "📏" },
                { label: "Plan", value: (profile?.suggestedGoal || "Generated"), key: "goal", icon: "🎯" },
                { label: "Status", value: (profile?.activity || "moderate").toUpperCase(), key: "activity", icon: "⚡" }
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-5 first:pt-4 last:pb-4 transition-all hover:bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                        <span className="text-sm opacity-40">{item.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{item.label}</span>
                    </div>
                    {isEditing ? (
                        <input 
                            type="text" 
                            defaultValue={item.value} 
                            className="bg-white/5 text-right text-xs font-black italic uppercase tracking-tighter text-[var(--primary)] border-none px-3 py-1.5 rounded-lg outline-none w-32"
                        />
                    ) : (
                        <span className="text-xs font-black italic uppercase tracking-tighter">{item.value}</span>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="flex flex-col gap-4">
         <div className="flex items-center gap-2 px-2">
            <Shield size={14} className="text-red-500/50" />
            <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-red-500/50">Security & Data</h3>
        </div>
        <div className="glass rounded-[32px] overflow-hidden border-red-500/10">
            <div onClick={handleReset} className="flex items-center justify-between p-6 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-black italic uppercase tracking-tighter text-red-500">Purge Data</span>
                        <p className="text-[9px] font-bold text-red-500/40 uppercase tracking-widest mt-0.5">Reset Biological Cache</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-red-500/20" />
            </div>
        </div>
      </section>

      <style jsx>{`
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-5 { padding: 1.25rem; }
        .p-4 { padding: 1rem; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
}
