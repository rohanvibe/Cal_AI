"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Dumbbell, User, MessageSquare } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Today', icon: Home, path: '/' },
    { label: 'Scan', icon: Camera, path: '/scan' },
    { label: 'Chat', icon: MessageSquare, path: '/chat' },
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
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-500 ${
              isActive ? 'active-item' : 'inactive-item'
            }`}
          >
            <div className={`icon-container ${isActive ? 'active-icon' : ''}`}>
               <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
      
      <style jsx>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 10px 30px;
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
        .gap-1 { gap: 6px; }
        
        .icon-container {
            padding: 8px;
            border-radius: 14px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .active-icon {
            background: var(--primary-glow);
            color: var(--primary);
            box-shadow: 0 0 20px var(--primary-glow);
            transform: translateY(-4px);
        }

        .active-item span {
            color: var(--primary);
            opacity: 1;
        }

        .inactive-item {
            color: var(--text-secondary);
        }
        
        .inactive-item span {
            opacity: 0.6;
        }

        .inactive-item:hover .icon-container {
            background: rgba(255, 255, 255, 0.05);
            color: white;
        }
      `}</style>
    </nav>
  );
}
