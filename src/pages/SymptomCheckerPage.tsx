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
  'difficulty sleeping', 'anxiety', 'depression', 'memory problems',
  'weakness', 'numbness', 'tingling', 'confusion', 'seizures',
  'tremors', 'balance problems', 'difficulty swallowing', 'hoarseness',
  'wheezing', 'rapid breathing', 'rapid heartbeat', 'palpitations',
  'irregular heartbeat', 'swelling', 'bruising', 'bleeding',
  'frequent urination', 'painful urination', 'blood in urine', 'dark urine',
  'pale stools', 'bloody stools', 'bloating', 'gas', 'heartburn',
  'indigestion', 'jaundice', 'skin changes', 'hair loss', 'nail changes',
  'excessive thirst', 'excessive hunger', 'weight loss', 'weight gain',
  'night sweats', 'hot flashes', 'cold intolerance', 'heat intolerance'
];

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    if (!symptoms || symptoms.length < 2) return [];
    const searchTerm = symptoms.toLowerCase();
    return COMMON_SYMPTOMS.filter(s => s.toLowerCase().includes(searchTerm)).slice(0, 8);
  }, [symptoms]);

  const handleCheck = () => {
    if (!symptoms.trim()) return;
    
    const possibleConditions = [
      { 
        name: 'Common Cold', 
        probability: 75, 
        color: 'text-medical-green',
        description: 'A viral infection affecting your nose and throat. Usually harmless and symptoms improve within 7-10 days.',
        selfCare: 'Rest, drink plenty of fluids, use over-the-counter pain relievers for aches, and gargle with salt water for sore throat.',
        whenToSeek: 'If symptoms worsen after 7 days, fever above 101.3°F (38.5°C), or difficulty breathing.'
      },
      { 
        name: 'Flu (Influenza)', 
        probability: 60, 
        color: 'text-yellow-500',
        description: 'A contagious respiratory illness caused by flu viruses. More severe than common cold with body-wide symptoms.',
        selfCare: 'Complete bed rest, stay hydrated, take fever reducers, and isolate yourself to prevent spreading to others.',
        whenToSeek: 'High fever lasting more than 3 days, difficulty breathing, chest pain, or confusion.'
      },
      { 
        name: 'Tension Headache', 
        probability: 85, 
        color: 'text-medical-green',
        description: 'The most common type of headache, often caused by stress or muscle tension. Feels like a tight band around your head.',
        selfCare: 'Apply warm compress to neck/shoulders, practice relaxation techniques, stay hydrated, and use over-the-counter pain medication.',
        whenToSeek: 'If headaches become more frequent, severe, or are accompanied by vision changes or numbness.'
      },
      { 
        name: 'Migraine', 
        probability: 60, 
        color: 'text-yellow-500',
        description: 'A neurological condition causing intense throbbing pain, usually on one side of the head. Often accompanied by nausea and light sensitivity.',
        selfCare: 'Rest in a dark, quiet room, apply cold compress to forehead, stay hydrated, and avoid triggers like bright lights or loud sounds.',
        whenToSeek: 'First-time severe headache, headache with fever/stiff neck, or sudden change in headache pattern.'
      },
      { 
        name: 'Allergic Reaction', 
        probability: 70, 
        color: 'text-medical-green',
        description: 'Your immune system reacting to a normally harmless substance. Can cause sneezing, itching, rashes, or respiratory symptoms.',
        selfCare: 'Identify and avoid the allergen, use antihistamine medications, keep skin moisturized for rashes, and use nasal rinses for nasal symptoms.',
        whenToSeek: 'Difficulty breathing, swelling of face/lips/tongue, rapid pulse, or dizziness (signs of severe allergic reaction).'
      },
      { 
        name: 'Gastritis', 
        probability: 65, 
        color: 'text-yellow-500',
        description: 'Inflammation of the stomach lining causing burning pain, nausea, and indigestion. Often caused by stress, certain medications, or infection.',
        selfCare: 'Eat smaller, more frequent meals, avoid spicy/acidic foods, reduce stress, stop smoking/drinking alcohol, and use antacids.',
        whenToSeek: 'Severe abdominal pain, vomiting blood, black/tarry stools, or persistent symptoms despite treatment.'
      },
    ];
    
    const selectedConditions = possibleConditions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
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

                <div>
                  <h4 className="font-semibold mb-3">Possible Causes</h4>
                  <div className="space-y-6">
                    {results.conditions.map((condition: any, i: number) => (
                      <Card key={i} className="p-4 space-y-3 border-l-4" style={{ borderLeftColor: condition.probability > 70 ? '#4ade80' : '#f59e0b' }}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-base">{condition.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{condition.probability}%</span>
                            <Activity className={`w-5 h-5 ${condition.color}`} />
                          </div>
                        </div>
                        <Progress value={condition.probability} className="h-2" />
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="font-medium text-foreground mb-1">What is this?</p>
                            <p className="text-muted-foreground">{condition.description}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-foreground mb-1">Self-Care Tips</p>
                            <p className="text-muted-foreground">{condition.selfCare}</p>
                          </div>
                          
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
                            <p className="font-medium text-orange-600 mb-1">When to See a Doctor</p>
                            <p className="text-sm text-muted-foreground">{condition.whenToSeek}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">Recommended Next Steps</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/appointments')}
                      className="w-full bg-medical-cyan hover:bg-medical-cyan/90 text-white flex items-center justify-center gap-2"
                    >
                      <ThermometerSun className="w-5 h-5" />
                      Book Doctor Appointment
                    </Button>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 px-2">
                      <Activity className="w-4 h-4" />
                      Track your symptoms daily and note any changes
                    </p>
                  </div>
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
