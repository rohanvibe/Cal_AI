"use client";

interface StatsRingProps {
  label: string;
  value: number;
  total: number;
  color: string;
  size?: number;
}

export default function StatsRing({ label, value, total, color, size = 180 }: StatsRingProps) {
  const strokeWidth = size * 0.05;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="stats-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#1c1c1f"
          strokeWidth={strokeWidth}
        />
        
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
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] font-medium text-[#8a8a8e] uppercase tracking-wider mb-1">{label}</span>
        <span className="text-3xl font-bold tracking-tight">
            {Math.round(value)}
        </span>
        <span className="text-[12px] font-medium text-[#4c4c50] mt-1">/ {total}</span>
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
          transition: all 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}
