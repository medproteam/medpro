import { motion } from 'framer-motion';
import { Brain, MessageSquare, FileText, Clock, LineChart, Pill, Bell, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'Real-time Tracking',
    description: 'Monitor your health metrics in real-time with AI-powered insights',
    color: 'from-primary to-primary/70',
  },
  {
    icon: Pill,
    title: 'Medication Tracking',
    description: 'Never miss a dose with intelligent reminders and adherence monitoring',
    color: 'from-primary to-secondary',
  },
  {
    icon: Shield,
    title: 'Blockchain Security',
    description: 'Your health data is encrypted and secured on Camp Network blockchain',
    color: 'from-secondary to-primary',
  },
  {
    icon: MessageSquare,
    title: 'Voice Interactions',
    description: 'Communicate with MEDPRO using voice for hands-free health management',
    color: 'from-primary to-primary/80',
  },
  {
    icon: FileText,
    title: 'Test Result Interpretation',
    description: 'AI-powered analysis of medical tests with clear explanations',
    color: 'from-secondary to-secondary/70',
  },
  {
    icon: LineChart,
    title: 'Health Analytics',
    description: 'Visualize your health trends and progress over time',
    color: 'from-secondary to-primary',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'SMS and push notifications to keep you on track',
    color: 'from-primary to-secondary',
  },
  {
    icon: Clock,
    title: 'Activity History',
    description: 'Complete timeline of your health activities and checkups',
    color: 'from-primary to-primary/70',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your health journey
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="group relative p-6 h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
