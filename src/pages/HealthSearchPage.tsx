import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HealthTermSearch } from '@/components/HealthTermSearch';

const HealthSearchPage = () => {
  useEffect(() => {
    document.title = 'Health Library | MEDPRO';
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/40 to-background">
        <div className="container px-4 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-primary mb-2">
              Health Knowledge
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Understand Any Health Term In Seconds
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by MEDPRO&apos;s AI health assistant. Explanations are for education only and never replace a visit to your doctor.
            </p>
          </motion.div>

          <HealthTermSearch />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default HealthSearchPage;
