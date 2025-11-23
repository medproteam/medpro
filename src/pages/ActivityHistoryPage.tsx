import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity, Pill, FileText, Heart, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ActivityHistoryPage() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      navigate('/');
      return;
    }
    loadActivities();
  }, [isConnected, address]);

  const loadActivities = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_address', address)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activity history');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return Pill;
      case 'vital_sign':
        return Activity;
      case 'health_record':
        return FileText;
      default:
        return Heart;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'from-primary to-primary/70';
      case 'vital_sign':
        return 'from-secondary to-secondary/70';
      case 'health_record':
        return 'from-accent to-accent/70';
      default:
        return 'from-medical-orange to-medical-orange/70';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="container px-4 py-12 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Activity History
            </h1>
            <p className="text-muted-foreground">
              Track all your health activities and interactions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading activities...
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No activities yet</p>
                  <p className="text-sm mt-2">Start using MEDPRO to see your activity history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.activity_type);
                    const color = getActivityColor(activity.activity_type);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium capitalize">
                                {activity.activity_type.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {JSON.stringify(activity.activity_data)}
                              </p>
                            </div>
                            <time className="text-xs text-muted-foreground flex-shrink-0">
                              {format(new Date(activity.created_at), 'MMM d, h:mm a')}
                            </time>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
