import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AIChat } from '@/components/AIChat';

const AIChatPage = () => {
  useEffect(() => {
    document.title = 'AI Health Chat | MEDPRO';
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main>
        <AIChat />
      </main>
      <BottomNav />
    </div>
  );
};

export default AIChatPage;
