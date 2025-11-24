import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { Brain, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_QUESTIONS = [
  {
    question: 'How many hours of sleep should adults get per night?',
    options: ['4-5 hours', '6-7 hours', '7-9 hours', '10-12 hours'],
    correct: 2,
    explanation: 'Adults typically need 7-9 hours of sleep for optimal health and cognitive function.'
  },
  {
    question: 'What is the recommended daily water intake?',
    options: ['2-3 glasses', '4-5 glasses', '6-8 glasses', '10-12 glasses'],
    correct: 2,
    explanation: '8 glasses (about 2 liters) of water daily helps maintain proper hydration and body functions.'
  },
  {
    question: 'How often should you wash your hands?',
    options: ['Once a day', 'Only when visibly dirty', 'Before meals and after restroom', 'Every hour'],
    correct: 2,
    explanation: 'Regular handwashing, especially before meals and after restroom use, prevents disease spread.'
  },
  {
    question: 'What is a normal resting heart rate for adults?',
    options: ['40-50 bpm', '60-100 bpm', '110-130 bpm', '140-160 bpm'],
    correct: 1,
    explanation: 'A normal resting heart rate for adults is 60-100 beats per minute.'
  },
  {
    question: 'How much exercise is recommended per week?',
    options: ['30 minutes total', '75 minutes moderate', '150 minutes moderate', '300 minutes moderate'],
    correct: 2,
    explanation: 'At least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week.'
  }
];

export default function HealthQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const completeQuiz = () => {
    const today = new Date().toISOString();
    const savedData = localStorage.getItem('healthQuizData');
    let streak = 1;

    if (savedData) {
      const parsed = JSON.parse(savedData);
      const lastPlayed = new Date(parsed.lastPlayed);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastPlayed.toDateString() === yesterday.toDateString()) {
        streak = (parsed.streak || 0) + 1;
      } else if (lastPlayed.toDateString() !== new Date().toDateString()) {
        streak = 1;
      } else {
        streak = parsed.streak || 1;
      }
    }

    localStorage.setItem('healthQuizData', JSON.stringify({
      lastPlayed: today,
      streak: streak,
      score: score,
    }));

    setQuizComplete(true);
  };

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-40 backdrop-blur-lg">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-medical-cyan" />
          Health Quiz
        </h1>
      </header>

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!quizComplete ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Progress */}
              <Card className="p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
                  <span className="font-semibold">Score: {score}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-medical-cyan to-medical-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </Card>

              {/* Question */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
                
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && handleAnswer(index)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showResult
                          ? index === question.correct
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : index === selectedAnswer
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                            : 'border-border opacity-50'
                          : selectedAnswer === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && index === question.correct && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showResult && index === selectedAnswer && index !== question.correct && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-muted rounded-lg"
                  >
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </motion.div>
                )}
              </Card>

              {showResult && (
                <Button
                  onClick={handleNext}
                  className="w-full bg-medical-cyan hover:bg-medical-cyan/90 text-white"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-5xl font-bold text-medical-cyan my-6">
                  {score}/{QUIZ_QUESTIONS.length}
                </p>
                <p className="text-muted-foreground mb-6">
                  {score === QUIZ_QUESTIONS.length
                    ? 'Perfect score! You know your health facts!'
                    : score >= QUIZ_QUESTIONS.length * 0.7
                    ? 'Great job! You have good health knowledge.'
                    : 'Keep learning! Review the explanations to improve.'}
                </p>
                <Button
                  onClick={resetQuiz}
                  className="w-full bg-medical-cyan hover:bg-medical-cyan/90 text-white"
                >
                  Try Again
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
