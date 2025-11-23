import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { Activity, Heart, Utensils, TrendingUp, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HealthTrackingPage() {
  const navigate = useNavigate();

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
            <h2 className="text-3xl font-bold mb-2">Health Tracking</h2>
            <p className="text-sm text-muted-foreground">Monitor vital signs, activity levels, and nutrition</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto text-medical-green mb-2" />
                <p className="text-sm text-muted-foreground">Vital Signs</p>
                <p className="text-xs text-muted-foreground">Blood Pressure</p>
                <p className="font-semibold text-sm">120/80 mmHg</p>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto text-medical-cyan mb-2" />
                <p className="text-sm text-muted-foreground">Activity</p>
                <p className="font-bold text-xl">8,000</p>
                <p className="text-xs text-muted-foreground">Steps (Daily)</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-medical-green" />
                  <span className="text-xs">350 Calories Burned</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="text-center">
                <Utensils className="w-8 h-8 mx-auto text-medical-orange mb-2" />
                <p className="text-sm text-muted-foreground">Nutrition</p>
                <p className="font-bold text-xl">150 g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="text-xs">350 Calories Burned</p>
              </div>
            </Card>
          </div>

          {/* Vital Signs Section */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Vital Signs</h3>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <button className="pb-2 border-b-2 border-medical-cyan text-medical-cyan font-medium">
                Blood Pressure
              </button>
              <button className="pb-2 border-b-2 border-transparent text-muted-foreground">
                Heart Rate
              </button>
              <button className="pb-2 border-b-2 border-transparent text-muted-foreground">
                Fatigue
              </button>
            </div>

            {/* Chart Area */}
            <div className="h-40 bg-gradient-to-b from-medical-cyan/5 to-medical-cyan/20 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                {[2, 3, 2.5, 3.5, 4, 4.5, 5].map((height, i) => (
                  <div
                    key={i}
                    className="w-8 bg-medical-cyan/60 rounded-t"
                    style={{ height: `${height * 20}%` }}
                  />
                ))}
              </div>
              <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                Last 7 Days
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Systolic (mmHg)</p>
                <p className="text-xs text-muted-foreground">Goals (mmHg)</p>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4 text-medical-cyan" />
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">BPM</p>
                <p className="text-xs text-muted-foreground">1 PMI</p>
                <div className="flex items-center gap-2 mt-1">
                  <ChevronRight className="w-4 h-4 text-medical-cyan" />
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Weight</p>
                <p className="text-xs text-muted-foreground">Post (kg)</p>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-4 h-4 text-medical-cyan" />
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Nausea</p>
                <p className="text-xs text-muted-foreground">Heat (kg)</p>
                <div className="flex items-center gap-2 mt-1">
                  <ChevronRight className="w-4 h-4 text-medical-cyan" />
                </div>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/vital-signs')}
              className="w-full bg-medical-cyan hover:bg-medical-cyan/90 text-white"
            >
              Log New Data
            </Button>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
