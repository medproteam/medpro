import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { AIChat } from '@/components/AIChat';
import { MedicationTracker } from '@/components/MedicationTracker';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <AIChat />
        
        {/* Medication Tracker Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Health Dashboard
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Track medications and manage your health with blockchain security
              </p>
            </motion.div>
            
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 h-12">
                <TabsTrigger value="medications" className="gap-2">
                  <Pill className="w-4 h-4" />
                  Medications
                </TabsTrigger>
                <TabsTrigger value="chat" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Quick Chat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="medications" className="mt-0">
                <MedicationTracker />
              </TabsContent>
              
              <TabsContent value="chat" className="mt-0">
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Scroll up to use the full AI chat experience with voice support
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;