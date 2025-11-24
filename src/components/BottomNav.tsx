import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, FileSearch, MessageSquare, Calendar } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: FileSearch, label: 'Symptoms', path: '/symptom-checker' },
    { icon: Activity, label: 'Tracking', path: '/health-tracking' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: MessageSquare, label: 'AI Chat', path: '/ai-chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 shadow-lg">
      <div className="flex items-center justify-around px-2 py-3 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 min-w-[60px] sm:min-w-[70px] transition-all duration-200 hover:scale-110"
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-transparent'}`}>
                <item.icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`}
                />
              </div>
              <span className={`text-[10px] sm:text-xs ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
