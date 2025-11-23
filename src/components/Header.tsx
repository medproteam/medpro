import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary">
            <Activity className="w-5 h-5 text-white" />
            <span className="font-bold text-white text-lg">MEDPRO</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <Link
            to="/ai-chat"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            AI Chat
          </Link>
          <Link
            to="/health-library"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Health Library
          </Link>
          <a 
            href="https://docs.campnetwork.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Docs
          </a>
        </nav>

        <WalletConnect />
      </div>
    </motion.header>
  );
}
