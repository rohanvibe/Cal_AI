"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Dumbbell, User } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Today', icon: Home, path: '/' },
    { label: 'Scan', icon: Camera, path: '/scan' },
    { label: 'Workout', icon: Dumbbell, path: '/workout' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="bottom-nav glass-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
              isActive ? 'text-[var(--primary)] scale-110' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
      
      <style jsx>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-1 { gap: 4px; }
      `}</style>
    </nav>
  );
}
