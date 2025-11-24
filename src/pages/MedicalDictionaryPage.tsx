import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { BookOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDICAL_TERMS = [
  { term: 'Hypertension', definition: 'High blood pressure, a condition where the force of blood against artery walls is too high.' },
  { term: 'Diabetes', definition: 'A chronic condition affecting how your body processes blood sugar (glucose).' },
  { term: 'Arthritis', definition: 'Inflammation of one or more joints, causing pain and stiffness.' },
  { term: 'Asthma', definition: 'A respiratory condition marked by spasms in the bronchi, causing difficulty breathing.' },
  { term: 'Anemia', definition: 'A condition where you lack enough healthy red blood cells to carry adequate oxygen.' },
  { term: 'Antibiotic', definition: 'A medicine that inhibits the growth of or destroys microorganisms.' },
  { term: 'Biopsy', definition: 'A procedure to remove a sample of tissue for laboratory examination.' },
  { term: 'Cardiovascular', definition: 'Relating to the heart and blood vessels.' },
  { term: 'CT Scan', definition: 'Computed Tomography, an imaging procedure using X-rays to create detailed body images.' },
  { term: 'Diagnosis', definition: 'The identification of a disease or condition by examining symptoms.' },
  { term: 'ECG/EKG', definition: 'Electrocardiogram, a test recording the electrical activity of the heart.' },
  { term: 'Inflammation', definition: 'A localized physical condition with heat, swelling, and pain as a reaction to injury or infection.' },
  { term: 'MRI', definition: 'Magnetic Resonance Imaging, using magnetic fields to create detailed organ and tissue images.' },
  { term: 'Prognosis', definition: 'The likely course or outcome of a disease.' },
  { term: 'Vaccine', definition: 'A substance used to stimulate immunity against diseases.' },
];

export default function MedicalDictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return MEDICAL_TERMS;
    const search = searchTerm.toLowerCase();
    return MEDICAL_TERMS.filter(
      item => item.term.toLowerCase().includes(search) || 
              item.definition.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-40 backdrop-blur-lg">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-medical-cyan" />
          Medical Dictionary
        </h1>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search medical terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {/* Terms List */}
          <div className="space-y-3">
            {filteredTerms.map((item, index) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-medical-cyan mb-2">
                    {item.term}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                </Card>
              </motion.div>
            ))}
            {filteredTerms.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No terms found matching "{searchTerm}"</p>
              </Card>
            )}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
