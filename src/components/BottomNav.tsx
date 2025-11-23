import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, FileSearch, MessageSquare } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileSearch, label: 'Symptom Checker', path: '/symptom-checker' },
    { icon: Activity, label: 'Health Tracking', path: '/health-tracking' },
    { icon: MessageSquare, label: 'Expert Q&A', path: '/ai-chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 min-w-[70px]"
            >
              <item.icon 
                className={`w-6 h-6 ${isActive ? 'text-medical-cyan' : 'text-muted-foreground'}`}
              />
              <span className={`text-xs ${isActive ? 'text-medical-cyan font-medium' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
