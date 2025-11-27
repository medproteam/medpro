import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { Thermometer, Wind, Zap, Droplets, Sun, Camera, Leaf, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const COMMON_SYMPTOMS = [
  { name: 'Fever', icon: Thermometer },
  { name: 'Cough', icon: Wind },
  { name: 'Fatigue', icon: Zap },
  { name: 'Fatigue', icon: Zap },
  { name: 'Rash', icon: Droplets },
  { name: 'Sore Throat', icon: Sun },
  { name: 'Nausea', icon: Camera },
  { name: 'Rash', icon: Leaf },
];

const SYMPTOM_SUGGESTIONS = [
  'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness',
  'chest pain', 'shortness of breath', 'abdominal pain', 'sore throat',
  'runny nose', 'body aches', 'chills', 'sweating', 'loss of appetite',
  'vomiting', 'diarrhea', 'constipation', 'rash', 'itching',
  'Severe Headache', 'Cluster Headache', 'Migraine', 'Tension Headache'
];

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!symptoms || symptoms.length < 2) return [];
    const searchTerm = symptoms.toLowerCase();
    return SYMPTOM_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchTerm)).slice(0, 5);
  }, [symptoms]);

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSymptoms('');
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !symptoms.trim()) return;
    // TODO: Implement AI analysis
    console.log('Analyzing symptoms:', [...selectedSymptoms, symptoms].filter(Boolean));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-center">MEDPRO</h1>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Symptom Checker</h2>
          </div>

          {/* Search Input */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Describe your symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && symptoms.trim()) {
                    addSymptom(symptoms);
                  }
                }}
                className="pl-10"
              />
              {showSuggestions && symptoms && suggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-2 p-2 shadow-lg">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => addSymptom(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </Card>
              )}
            </div>

            {/* Selected Symptoms Tags */}
            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSymptoms.map((symptom, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Common Symptoms */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Common Symptoms</h3>
            <div className="grid grid-cols-4 gap-3">
              {COMMON_SYMPTOMS.map((symptom, i) => {
                const Icon = symptom.icon;
                return (
                  <button
                    key={i}
                    onClick={() => addSymptom(symptom.name)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-center">{symptom.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={selectedSymptoms.length === 0 && !symptoms.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-full"
          >
            Analyze Symptoms
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
