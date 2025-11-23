import { Link } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import medproLogo from '@/assets/medpro-logo.jpg';

interface HeaderProps {
  autoOpenWallet?: boolean;
}

export function Header({ autoOpenWallet }: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/ai-chat', label: 'AI Chat' },
    { href: '/health-library', label: 'Health Library' },
    ...(isConnected ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/vital-signs', label: 'Vital Signs' },
      { href: '/activity-history', label: 'Activity' },
    ] : []),
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src={medproLogo}
            alt="MEDPRO logo"
            className="h-8 w-auto object-contain rounded-lg shadow-sm"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MEDPRO
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WalletConnect autoOpenOnMount={autoOpenWallet} />
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
