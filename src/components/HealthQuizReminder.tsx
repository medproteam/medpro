import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function HealthQuizReminder() {
  const [quizData, setQuizData] = useState({
    lastPlayed: null as string | null,
    streak: 0,
    playedToday: false,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('healthQuizData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const today = new Date().toDateString();
      const lastPlayedDate = parsed.lastPlayed ? new Date(parsed.lastPlayed).toDateString() : null;
      
      setQuizData({
        lastPlayed: parsed.lastPlayed,
        streak: parsed.streak || 0,
        playedToday: lastPlayedDate === today,
      });
    }
  }, []);

  if (quizData.playedToday) {
    return (
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Trophy className="w-5 h-5" />
            Daily Quiz Complete!
          </CardTitle>
          <CardDescription>Great job! Come back tomorrow to continue your streak.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{quizData.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
            <Link to="/health-quiz">
              <Button variant="outline" size="sm">
                Play Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Daily Health Quiz
          </CardTitle>
          <CardDescription>Test your health knowledge and build your streak!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{quizData.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
            {quizData.streak > 0 && (
              <p className="text-sm text-muted-foreground">
                Keep it going! Don't break your streak.
              </p>
            )}
          </div>
          <Link to="/health-quiz">
            <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Play Today's Quiz
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
