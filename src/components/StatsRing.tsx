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
        {/* Background Track with glass effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Stroke with Gradient and Glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ 
              filter: `drop-shadow(0 0 8px ${color}88)`,
          }}
        />

        {/* Inner Gradient for "Premium" look */}
        <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black italic tracking-tighter transition-all duration-500">
                {Math.round(value)}
            </span>
            <span className="text-xs font-bold opacity-30 italic">/ {total}</span>
        </div>
        <div className="mt-2 text-[10px] font-black italic text-[var(--accent)] tracking-widest bg-[var(--accent)]/10 px-3 py-1 rounded-full uppercase">
            {100 - Math.round(percentage)}% TO GO
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
          transition-property: all;
        }
        .duration-1000 {
          transition-duration: 1000ms;
        }
        .text-4xl {
          font-size: 2.25rem;
          line-height: 2.5rem;
        }
      `}</style>
    </div>
  );
}
