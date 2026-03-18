"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Camera, MessageCircle, Activity, User } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Today', icon: LayoutGrid, path: '/' },
    { label: 'Scan', icon: Camera, path: '/scan' },
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
    { label: 'Workout', icon: Activity, path: '/workout' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-link ${isActive ? 'active' : ''}`}
          >
            <div className={`nav-icon ${isActive ? 'active-icon' : ''}`}>
               <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
      
      <style jsx>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 16px 12px 36px;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(8, 8, 10, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1000;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #64748b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none !important;
          flex: 1;
        }

        .nav-icon {
            padding: 10px;
            border-radius: 16px;
            transition: all 0.3s ease;
        }

        .active-icon {
            background: rgba(188, 19, 254, 0.08);
            color: #bc13fe;
            box-shadow: 0 0 20px rgba(188, 19, 254, 0.1);
        }

        .nav-link span {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .nav-link.active {
          color: #bc13fe;
        }

        .nav-link:hover:not(.active) {
          color: #94a3b8;
        }
      `}</style>
    </nav>
  );
}
