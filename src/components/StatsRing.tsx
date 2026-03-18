"use client";

interface StatsRingProps {
  label: string;
  value: number;
  total: number;
  color: string;
  size?: number;
}

export default function StatsRing({ label, value, total, color, size = 180 }: StatsRingProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="stats-ring-container animate-fade-in" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bc13fe" />
            <stop offset="100%" stopColor="#8a2be2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Stroke - Balanced Fancy */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color === '#ffffff' ? 'url(#ringGradient)' : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: 'drop-shadow(0 0 10px rgba(188, 19, 254, 0.2))' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-1 opacity-60">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tighter transition-all duration-500">
                {Math.round(value)}
            </span>
            <span className="text-xs font-bold text-[#4c4c50] tracking-tight">/ {total}</span>
        </div>
        <div className="mt-3 text-[9px] font-black text-[#bc13fe] tracking-widest bg-[#bc13fe]/10 px-4 py-1.5 rounded-full uppercase italic">
            {100 - Math.round(percentage)}% TO TARGET
        </div>
      </div>

      <style jsx>{`
        .stats-ring-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rotate-\[-90deg\] {
          transform: rotate(-90deg);
        }
        .transition-all {
          transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
      `}</style>
    </div>
  );
}
