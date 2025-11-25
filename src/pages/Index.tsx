import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import medproLogo from '@/assets/medpro-logo-clean.jpg';

const healthFacts = [
  "💧 Drinking water first thing in the morning helps activate your internal organs.",
  "🏃 Just 30 minutes of daily exercise can reduce the risk of heart disease by 50%.",
  "😴 Adults need 7-9 hours of sleep for optimal health and cognitive function.",
  "🥗 Eating a rainbow of colorful fruits and vegetables provides essential antioxidants.",
  "🧘 Meditation for 10 minutes daily can reduce stress and improve mental clarity.",
  "🦷 Brushing your teeth can prevent heart disease by reducing oral bacteria.",
  "☀️ 15 minutes of sunlight exposure helps your body produce vitamin D naturally.",
  "🚶 Walking 10,000 steps a day improves cardiovascular health and mood.",
  "🧠 Learning new skills helps create new neural pathways and keeps your brain young.",
  "💪 Strength training twice a week helps maintain bone density as you age.",
  "🍵 Green tea contains antioxidants that can boost metabolism and brain function.",
  "🫀 Laughing increases blood flow and improves the function of blood vessels.",
  "🥤 Limiting sugar intake can reduce inflammation and improve immune function.",
  "🧘‍♀️ Deep breathing exercises activate the parasympathetic nervous system, reducing stress.",
  "🏋️ Regular exercise releases endorphins, your body's natural mood elevators.",
];

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    document.title = 'Welcome | MEDPRO';
    
    const usedFacts = JSON.parse(localStorage.getItem('usedHealthFacts') || '[]');
    const availableFacts = healthFacts.filter((_, index) => !usedFacts.includes(index));
    
    let selectedIndex;
    if (availableFacts.length === 0) {
      localStorage.setItem('usedHealthFacts', '[]');
      selectedIndex = Math.floor(Math.random() * healthFacts.length);
    } else {
      const randomAvailable = availableFacts[Math.floor(Math.random() * availableFacts.length)];
      selectedIndex = healthFacts.indexOf(randomAvailable);
    }
    
    const newUsedFacts = [...usedFacts, selectedIndex];
    localStorage.setItem('usedHealthFacts', JSON.stringify(newUsedFacts));
    
    setCurrentFact(healthFacts[selectedIndex]);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10 max-w-2xl mx-auto"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8 w-full flex items-center justify-center"
          >
            <img 
              src={medproLogo} 
              alt="MEDPRO" 
              className="w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-w-[900px] h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            MEDPRO
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-foreground/80 mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Your AI-Powered Health Companion on Web3
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8 p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-lg"
          >
            <p className="text-sm text-muted-foreground mb-2 font-semibold tracking-wider uppercase">Daily Health Tip</p>
            <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">{currentFact}</p>
          </motion.div>
          
          <div className="flex justify-center">
            <div className="w-64 h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden z-0">
        {[...Array(3)].map((_, i) => (
          <motion.img
            key={i}
            src={medproLogo}
            alt=""
            className="absolute"
            style={{
              width: '40vw',
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 5, 0],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 p-4 sm:p-6 relative z-10">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <img src={medproLogo} alt="MEDPRO" className="h-14 w-auto object-contain" />
          <span className="text-2xl font-bold bg-gradient-to-r from-medical-cyan to-medical-blue bg-clip-text text-transparent">
            MEDPRO
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center space-y-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                MEDPRO
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Your AI-Powered Health Companion on Web3
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/80 mt-2">
              Secure • Decentralized • Intelligent
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={() => navigate('/signup')}
              className="w-full h-14 sm:h-16 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-base sm:text-lg rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Sign up
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full h-14 sm:h-16 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-base sm:text-lg rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Log in
            </Button>

            <Button
              onClick={() => navigate('/home')}
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Explore Features
            </Button>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <span className="text-xs text-muted-foreground font-medium">POWERED BY</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="font-semibold">Web3</span>
              <span>•</span>
              <span className="font-semibold">AI</span>
              <span>•</span>
              <span className="font-semibold">Blockchain</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-8 leading-relaxed px-4">
            MEDPRO provides educational health guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
