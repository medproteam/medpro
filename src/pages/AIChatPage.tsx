import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AIChat } from '@/components/AIChat';

const AIChatPage = () => {
  useEffect(() => {
    document.title = 'AI Health Chat | MEDPRO';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AIChat />
      </main>
      <Footer />
    </div>
  );
};

export default AIChatPage;
