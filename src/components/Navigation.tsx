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
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      
      <style jsx>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 16px 32px;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #0c0c0e;
          border-top: 1px solid #1c1c1f;
          z-index: 1000;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #4c4c50;
          transition: all 0.2s ease;
          text-decoration: none !important;
          flex: 1;
        }

        .nav-link span {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .nav-link.active {
          color: #ffffff;
        }

        .nav-link:hover:not(.active) {
          color: #8a8a8e;
        }
      `}</style>
    </nav>
  );
}
