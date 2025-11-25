import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { Brain, AlertTriangle, Activity, ThermometerSun, Heart, Pill } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const COMMON_SYMPTOMS = [
  'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness',
  'chest pain', 'shortness of breath', 'abdominal pain', 'sore throat',
  'runny nose', 'body aches', 'chills', 'sweating', 'loss of appetite',
  'vomiting', 'diarrhea', 'constipation', 'rash', 'itching',
  'joint pain', 'muscle pain', 'back pain', 'neck pain', 'toothache',
  'ear pain', 'eye pain', 'blurred vision', 'sensitivity to light',
  'difficulty sleeping', 'anxiety', 'depression', 'memory problems'
];

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!symptoms || symptoms.length < 2) return [];
    const searchTerm = symptoms.toLowerCase();
    return COMMON_SYMPTOMS.filter(s => s.includes(searchTerm)).slice(0, 5);
  }, [symptoms]);

  const handleCheck = () => {
    if (!symptoms.trim()) return;
    
    // Simulated results based on symptom input
    const possibleConditions = [
      { name: 'Common Cold', probability: 75, color: 'text-medical-green' },
      { name: 'Flu', probability: 60, color: 'text-yellow-500' },
      { name: 'Tension Headache', probability: 85, color: 'text-medical-green' },
      { name: 'Migraine', probability: 60, color: 'text-yellow-500' },
      { name: 'Allergic Reaction', probability: 70, color: 'text-medical-green' },
      { name: 'Gastritis', probability: 65, color: 'text-yellow-500' },
    ];
    
    // Select random conditions for variety
    const selectedConditions = possibleConditions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    setResults({
      symptom: symptoms,
      conditions: selectedConditions,
    });
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
            <h2 className="text-3xl font-bold mb-2">Symptom Checker</h2>
          </div>

          {/* Input Section */}
          <Card className="p-6 space-y-4">
            <div className="relative">
              <label className="text-sm font-medium mb-2 block">Describe your symptoms</label>
              <Input
                placeholder="e.g., headache, fever, cough..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="mb-2"
              />
              {showSuggestions && suggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 p-2 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSymptoms(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </Card>
              )}
              <Button
                onClick={handleCheck}
                className="w-full bg-medical-cyan hover:bg-medical-cyan/90 text-white mt-2"
                disabled={!symptoms}
              >
                Check Symptoms
              </Button>
            </div>
          </Card>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-medical-cyan" />
                  <h3 className="text-lg font-semibold">Insights & Recommendations</h3>
                </div>

                {/* Disclaimer */}
                <div className="bg-medical-cyan/10 border border-medical-cyan/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-medical-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-medical-cyan">This is NOT a diagnosis.</p>
                    <p className="text-sm text-muted-foreground">Consult a healthcare professional.</p>
                  </div>
                </div>

                {/* Possible Causes */}
                <div>
                  <h4 className="font-semibold mb-3">Possible Causes (Disclaimer)</h4>
                  <div className="space-y-3">
                    {results.conditions.map((condition: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{condition.name}</span>
                          <Activity className={`w-5 h-5 ${condition.color}`} />
                        </div>
                        <Progress value={condition.probability} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">Next Steps</h4>
                  <Button className="w-full bg-medical-cyan hover:bg-medical-cyan/90 text-white flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5" />
                    Book a Doctor's Appointment
                  </Button>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Monitor Symptoms at Home
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => navigate('/vital-signs')}>
              <Card className="p-4 text-center space-y-2 hover:shadow-lg transition-shadow cursor-pointer">
                <Heart className="w-8 h-8 mx-auto text-medical-cyan" />
                <p className="text-xs font-medium">Track Vitals</p>
              </Card>
            </button>
            <button onClick={() => navigate('/medications')}>
              <Card className="p-4 text-center space-y-2 hover:shadow-lg transition-shadow cursor-pointer">
                <Pill className="w-8 h-8 mx-auto text-medical-blue" />
                <p className="text-xs font-medium">Medications</p>
              </Card>
            </button>
            <button onClick={() => navigate('/ai-chat')}>
              <Card className="p-4 text-center space-y-2 hover:shadow-lg transition-shadow cursor-pointer">
                <Brain className="w-8 h-8 mx-auto text-medical-green" />
                <p className="text-xs font-medium">AI Insights</p>
              </Card>
            </button>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
