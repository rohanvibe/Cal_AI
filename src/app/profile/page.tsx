"use client";

import { useState, useEffect } from "react";
import { User, Settings, Shield, Trash2, ChevronRight, Activity, TrendingUp } from "lucide-react";

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
    <div className="animate-fade-in flex flex-col gap-10 max-w-lg mx-auto w-full pt-10 pb-20 px-2">
      <header className="py-6 flex justify-between items-center border-b border-white/5">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        <div className="glass p-3 rounded-2xl bg-white/5 border-white/5 active:scale-95 transition-transform">
            <Settings size={22} className="text-[#94a3b8]" />
        </div>
      </header>

      {/* Modern Profile Identity */}
      <section className="glass p-8 flex flex-col items-center gap-6 text-center rounded-[40px] relative overflow-hidden bg-gradient-to-br from-[#bc13fe]/[0.05] to-transparent border-none shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#bc13fe] to-transparent opacity-30"></div>
        <div className="relative">
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-[#bc13fe] to-[#8a2be2] p-[2px] shadow-2xl">
            <div className="w-full h-full rounded-[30px] bg-[#0c0c0e] flex items-center justify-center overflow-hidden">
               <User size={48} className="text-[#bc13fe]" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-[#bc13fe] flex items-center justify-center text-white shadow-xl border-4 border-[#0c0c0e]">
            <Activity size={14} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#bc13fe] bg-[#bc13fe]/10 px-4 py-1.5 rounded-full inline-block">
            Member Type: Elite
          </div>
        </div>
      </section>

      {/* Rebuilt Registry List - Balanced Modernity */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#94a3b8]" />
                <h3 className="font-bold uppercase text-[10px] tracking-widest text-[#94a3b8]">Biometric Registry</h3>
            </div>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-[#bc13fe] hover:bg-[#bc13fe]/5 px-4 py-2 rounded-xl transition-colors"
            >
                {isEditing ? "Save Sync" : "Edit Details"}
            </button>
        </div>

        <div className="glass p-2 divide-y divide-white/5 rounded-[32px] bg-white/[0.02] border-none shadow-xl">
            {[
                { label: "Weight Registry", value: `${profile?.weight || 0} KG`, key: "weight" },
                { label: "Height Vertical", value: `${profile?.height || 0} CM`, key: "height" },
                { label: "Calculated Plan", value: (profile?.suggestedGoal || "Elite Sync"), key: "goal" },
                { label: "Activity Index", value: (profile?.activity || "moderate").toUpperCase(), key: "activity" }
            ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-6 first:pt-4 last:pb-4 transition-all hover:bg-white/[0.01]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">{item.label}</span>
                    {isEditing ? (
                        <input 
                            type="text" 
                            defaultValue={item.value} 
                            className="bg-white/5 text-right text-sm font-bold text-[#bc13fe] border-none px-4 py-2 rounded-xl outline-none w-32"
                        />
                    ) : (
                        <span className="text-sm font-bold tracking-tight">{item.value}</span>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* Managed Purge Zone */}
      <section className="flex flex-col gap-4 mb-10">
         <div className="flex items-center gap-2 px-4">
            <h3 className="font-black uppercase text-[10px] tracking-widest text-red-500/50">Internal Management</h3>
        </div>
        <div className="glass rounded-[32px] overflow-hidden border-red-500/10 bg-red-500/[0.02]">
            <div onClick={handleReset} className="flex items-center justify-between p-6 cursor-pointer hover:bg-red-500/[0.05] transition-colors group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-red-500">Purge Registry</span>
                        <p className="text-[9px] font-bold text-red-500/40 uppercase tracking-widest mt-0.5">Reset entire health profile</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-red-500/20" />
            </div>
        </div>
      </section>
    </div>
  );
}
