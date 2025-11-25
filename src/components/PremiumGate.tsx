import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumGateProps {
  usageCount: number;
  maxFreeUsage: number;
  featureName: string;
  children?: ReactNode;
}

export const PremiumGate = ({ usageCount, maxFreeUsage, featureName, children }: PremiumGateProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">Premium Feature</CardTitle>
            <CardDescription>
              You've used {usageCount} of {maxFreeUsage} free access to {featureName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Upgrade to Premium for unlimited access to all features
              </p>
            </div>
            <Button
              onClick={() => navigate('/premium')}
              className="w-full gap-2"
              size="lg"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </Button>
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
