"use client";

import React from 'react';

interface StatsRingProps {
  label: string;
  value: number;
  total: number;
  color: string;
  size?: number;
}

export default function StatsRing({ label, value, total, color, size = 160 }: StatsRingProps) {
  const percentage = Math.min((value / total) * 100, 100);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="stats-ring-container animate-fade-in">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="stats-content">
        <span className="stats-value">{Math.round(value)}</span>
        <span className="stats-label">{label}</span>
      </div>

      <style jsx>{`
        .stats-ring-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .stats-content {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stats-value {
          font-size: 28px;
          font-weight: 800;
          color: white;
          line-height: 1;
        }
        .stats-label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }
        svg { transform: rotate(-90deg); }
      `}</style>
    </div>
  );
}
