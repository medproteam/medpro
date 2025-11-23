import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import medproLogo from '@/assets/medpro-logo-clean.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Welcome | MEDPRO';
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Splash Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <img 
            src={medproLogo} 
            alt="MEDPRO" 
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-medical-cyan">MEDPRO</h1>
          <p className="text-muted-foreground mt-2">Your Health Companion</p>
          
          {/* Loading indicator */}
          <div className="mt-8 flex justify-center">
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-medical-cyan"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={medproLogo} alt="MEDPRO" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold">MEDPRO</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-3">Welcome to MEDPRO</h1>
            <p className="text-muted-foreground">
              Your AI-Powered Health Companion on Web3
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/signup')}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl"
            >
              Sign up
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full h-14 border-2 text-lg rounded-xl"
            >
              Log in
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            MEDPRO provides educational health guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
