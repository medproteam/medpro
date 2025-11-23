import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Welcome | MEDPRO';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-cyan/10 via-background to-medical-blue/10 flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-none bg-gradient-to-b from-background to-medical-cyan/10 p-8 space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-medical-cyan/15 flex items-center justify-center">
            <Activity className="w-8 h-8 text-medical-cyan" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-medical-blue/70 mb-1">MEDPRO</p>
            <h1 className="text-3xl font-bold tracking-tight text-medical-blue">Welcome to MedPro</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your personal AI-powered health companion. Use your Web3 wallet to create a secure health profile
            and get personalized insights.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-medical-cyan text-primary-foreground hover:bg-medical-cyan/90"
            onClick={() => navigate('/profile')}
          >
            Sign up with wallet
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Log in with wallet
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground mt-2">
          MEDPRO provides educational health guidance only and is not a substitute for professional medical advice,
          diagnosis, or treatment.
        </p>
      </Card>
    </div>
  );
};

export default Index;
