import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import medproLogo from '@/assets/medpro-logo.jpg';
import { Heart, Shield, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Welcome | MEDPRO';
  }, []);

  const healthImages = [
    { icon: Heart, label: 'Health Monitoring', color: 'text-medical-cyan' },
    { icon: Shield, label: 'Secure & Private', color: 'text-medical-blue' },
    { icon: Users, label: 'Community Care', color: 'text-medical-green' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-cyan/10 via-background to-medical-blue/10">
      {/* Hero Section with Slides */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-cyan/20 to-medical-blue/20 backdrop-blur-sm" />
        
        {/* Animated Health Icons Background */}
        <div className="absolute inset-0 overflow-hidden">
          {healthImages.map((item, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                delay: i * 2
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`
              }}
            >
              <item.icon className={`w-32 h-32 ${item.color} opacity-20`} />
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl w-full">
            {/* Left: Info & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={medproLogo} alt="MEDPRO" className="w-20 h-20 rounded-2xl shadow-lg" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-medical-blue">MEDPRO</h1>
                  <p className="text-sm text-medical-cyan">AI-Powered Health Companion</p>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Your Health, <span className="text-medical-cyan">Secured</span> on <span className="text-medical-blue">Web3</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Connect your wallet to access personalized health insights, AI-powered diagnostics, medication tracking, and vital signs monitoring—all secured on the blockchain.
              </p>

              <div className="space-y-3">
                <Button
                  className="w-full md:w-auto bg-medical-cyan text-white hover:bg-medical-cyan/90 shadow-lg"
                  size="lg"
                  onClick={() => navigate('/profile')}
                >
                  Sign Up with Wallet
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-medical-blue text-medical-blue hover:bg-medical-blue/10"
                  size="lg"
                  onClick={() => navigate('/profile')}
                >
                  Log In with Wallet
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                MEDPRO provides educational health guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </motion.div>

            {/* Right: Feature Cards Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {healthImages.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-medical-cyan/20 to-medical-blue/20 flex items-center justify-center`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.label}</h3>
                        <p className="text-sm text-muted-foreground">Powered by Web3 & AI</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Africa Health Initiative Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-medical-cyan/5 to-medical-blue/5 py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-medical-blue mb-3">Built for Africa Builder Program Hackathon</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empowering communities with accessible, blockchain-secured healthcare solutions across Africa
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
