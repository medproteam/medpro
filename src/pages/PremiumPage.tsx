import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CampPayment } from '@/components/CampPayment';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { toast } from 'sonner';
import { Crown, Check, Zap, Shield, Brain, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MEDPRO_PAYMENT_ADDRESS } from '@/config/campNetwork';

export default function PremiumPage() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const { isPremium, isLoading, subscription, refetch } = usePremiumStatus();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      navigate('/');
    }
  }, [isConnected, navigate]);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: '0.01',
      duration: 30,
      icon: Crown,
      description: 'Perfect for getting started',
      popular: false,
    },
    {
      id: 'quarterly',
      name: 'Quarterly Premium',
      price: '0.025',
      duration: 90,
      icon: Zap,
      description: 'Best value for money',
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: '0.08',
      duration: 365,
      icon: Shield,
      description: 'Maximum savings',
      popular: false,
    },
  ];

  const premiumFeatures = [
    { icon: Brain, text: 'Advanced AI Health Analysis', color: 'text-primary' },
    { icon: TrendingUp, text: 'Detailed Health Insights & Trends', color: 'text-secondary' },
    { icon: Shield, text: 'Priority Health Record Storage', color: 'text-accent' },
    { icon: Sparkles, text: 'Personalized Health Recommendations', color: 'text-medical-orange' },
    { icon: Check, text: 'Ad-Free Experience', color: 'text-primary' },
    { icon: Crown, text: 'Early Access to New Features', color: 'text-secondary' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container px-4 py-12 mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse text-muted-foreground">Loading premium status...</div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (isPremium && subscription) {
    const endDate = new Date(subscription.end_date);
    const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container px-4 py-12 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">
                You're <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium!</span>
              </h1>
              <p className="text-muted-foreground">Enjoying all the exclusive benefits</p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Subscription</span>
                  <Badge variant="default" className="gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Plan Type</p>
                    <p className="font-bold capitalize">{subscription.subscription_type}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Days Remaining</p>
                    <p className="font-bold">{daysRemaining} days</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Expires On</p>
                  <p className="font-medium">{endDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Premium Features</CardTitle>
                <CardDescription>All features unlocked and available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container px-4 py-12 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4">
              Upgrade to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Premium</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock advanced health tracking features and personalized insights powered by blockchain technology
            </p>
          </div>

          {/* Features Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Features</CardTitle>
              <CardDescription>Everything you need for comprehensive health management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`relative h-full ${
                      plan.popular ? 'border-2 border-primary shadow-lg' : ''
                    } ${
                      selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <plan.icon className="w-8 h-8 text-primary" />
                        {selectedPlan === plan.id && (
                          <Badge variant="secondary" className="gap-1">
                            <Check className="w-3 h-3" />
                            Selected
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-4xl font-bold mb-1">{plan.price} CAMP</div>
                        <div className="text-sm text-muted-foreground">{plan.duration} days</div>
                      </div>
                      {selectedPlan === plan.id ? (
                        <CampPayment
                          amount={plan.price}
                          recipientAddress={MEDPRO_PAYMENT_ADDRESS}
                          subscriptionType={plan.id}
                          durationDays={plan.duration}
                          onSuccess={() => {
                            refetch();
                            setSelectedPlan(null);
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => setSelectedPlan(plan.id)}
                          className="w-full p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                          Select Plan
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Secure Blockchain Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ All payments processed on Camp Network Testnet</p>
              <p>✓ Your subscription is recorded on-chain for transparency</p>
              <p>✓ Payments sent securely to: {MEDPRO_PAYMENT_ADDRESS.slice(0, 10)}...{MEDPRO_PAYMENT_ADDRESS.slice(-8)}</p>
              <p>✓ No recurring charges - you control when to renew</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
