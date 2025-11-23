import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity, Pill, Heart, FileText, TrendingUp, Calendar, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    medications: 0,
    vitalSigns: 0,
    healthRecords: 0,
    activitiesThisWeek: 0,
  });

  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [isConnected, address]);

  const loadDashboardData = async () => {
    if (!address) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      setProfile(profileData);

      if (!profileData) {
        toast.info('Please complete your health profile');
        navigate('/profile');
        return;
      }

      // Load stats
      const [medicationsRes, vitalSignsRes, healthRecordsRes, activitiesRes] = await Promise.all([
        supabase.from('medications').select('id', { count: 'exact' }).eq('user_address', address).eq('active', true),
        supabase.from('vital_signs').select('id', { count: 'exact' }).eq('user_address', address),
        supabase.from('health_records').select('id', { count: 'exact' }).eq('user_address', address),
        supabase.from('activity_logs').select('id', { count: 'exact' }).eq('user_address', address).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        medications: medicationsRes.count || 0,
        vitalSigns: vitalSignsRes.count || 0,
        healthRecords: healthRecordsRes.count || 0,
        activitiesThisWeek: activitiesRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const quickActions = [
    { icon: Pill, label: 'Medications', href: '/medications', color: 'from-primary to-primary/70' },
    { icon: Activity, label: 'Record Vitals', href: '/vital-signs', color: 'from-secondary to-secondary/70' },
    { icon: FileText, label: 'AI Chat', href: '/ai-chat', color: 'from-accent to-accent/70' },
    { icon: Heart, label: 'Health Library', href: '/health-library', color: 'from-medical-orange to-medical-orange/70' },
  ];

  const statCards = [
    { label: 'Active Medications', value: stats.medications, icon: Pill, color: 'text-primary' },
    { label: 'Vital Signs Recorded', value: stats.vitalSigns, icon: Activity, color: 'text-secondary' },
    { label: 'Health Records', value: stats.healthRecords, icon: FileText, color: 'text-accent' },
    { label: 'Activities This Week', value: stats.activitiesThisWeek, icon: TrendingUp, color: 'text-medical-orange' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{profile?.full_name || 'User'}</span>
              </h1>
              <p className="text-muted-foreground">Here's your health overview</p>
            </div>
            <Link to="/profile">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${quickActions[index % quickActions.length].color}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to your most used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 flex flex-col items-center gap-2 hover:border-primary transition-all"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming reminders</p>
                  <p className="text-sm mt-1">Add medications to get started</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Activity className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Stay Active</p>
                      <p className="text-xs text-muted-foreground">Log your vital signs regularly for better health tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Heart className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Medication Adherence</p>
                      <p className="text-xs text-muted-foreground">Never miss a dose with our smart reminders</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
