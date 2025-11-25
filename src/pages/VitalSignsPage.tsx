import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity, Heart, Thermometer, Droplets, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function VitalSignsPage() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recentVitals, setRecentVitals] = useState<any[]>([]);
  const [vitals, setVitals] = useState({
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    temperature_celsius: '',
    blood_sugar_mg_dl: '',
    oxygen_saturation: '',
    notes: '',
  });

  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      navigate('/');
      return;
    }
    loadRecentVitals();
  }, [isConnected, address]);

  const loadRecentVitals = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('user_address', address)
        .order('recorded_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentVitals(data || []);
    } catch (error) {
      console.error('Error loading vitals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    try {
      const vitalData = {
        user_address: address,
        blood_pressure_systolic: vitals.blood_pressure_systolic ? parseInt(vitals.blood_pressure_systolic) : null,
        blood_pressure_diastolic: vitals.blood_pressure_diastolic ? parseInt(vitals.blood_pressure_diastolic) : null,
        heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
        temperature_celsius: vitals.temperature_celsius ? parseFloat(vitals.temperature_celsius) : null,
        blood_sugar_mg_dl: vitals.blood_sugar_mg_dl ? parseInt(vitals.blood_sugar_mg_dl) : null,
        oxygen_saturation: vitals.oxygen_saturation ? parseInt(vitals.oxygen_saturation) : null,
        notes: vitals.notes || null,
      };

      const { error } = await supabase.from('vital_signs').insert([vitalData]);

      if (error) throw error;

      await supabase.from('activity_logs').insert([{
        user_address: address,
        activity_type: 'vital_sign',
        activity_data: { action: 'recorded', vitals: vitalData },
      }]);

      toast.success('Vital signs recorded successfully!');
      setVitals({
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        temperature_celsius: '',
        blood_sugar_mg_dl: '',
        oxygen_saturation: '',
        notes: '',
      });
      loadRecentVitals();
    } catch (error: any) {
      console.error('Error recording vitals:', error);
      toast.error('Failed to record vitals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <Header />
      <main className="container px-4 py-12 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vital Signs Monitoring
            </h1>
            <p className="text-muted-foreground">
              Track your key health metrics over time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Record New Vitals
                  </CardTitle>
                  <CardDescription>Enter your current measurements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bp_sys" className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        BP Systolic
                      </Label>
                      <Input
                        id="bp_sys"
                        type="number"
                        value={vitals.blood_pressure_systolic}
                        onChange={(e) => setVitals({ ...vitals, blood_pressure_systolic: e.target.value })}
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bp_dia">BP Diastolic</Label>
                      <Input
                        id="bp_dia"
                        type="number"
                        value={vitals.blood_pressure_diastolic}
                        onChange={(e) => setVitals({ ...vitals, blood_pressure_diastolic: e.target.value })}
                        placeholder="80"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heart_rate" className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-secondary" />
                      Heart Rate (bpm)
                    </Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })}
                      placeholder="72"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-accent" />
                      Temperature (°C)
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={vitals.temperature_celsius}
                      onChange={(e) => setVitals({ ...vitals, temperature_celsius: e.target.value })}
                      placeholder="36.6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_sugar" className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-medical-orange" />
                      Blood Sugar (mg/dL)
                    </Label>
                    <Input
                      id="blood_sugar"
                      type="number"
                      value={vitals.blood_sugar_mg_dl}
                      onChange={(e) => setVitals({ ...vitals, blood_sugar_mg_dl: e.target.value })}
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oxygen" className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-medical-purple" />
                      Oxygen Saturation (%)
                    </Label>
                    <Input
                      id="oxygen"
                      type="number"
                      value={vitals.oxygen_saturation}
                      onChange={(e) => setVitals({ ...vitals, oxygen_saturation: e.target.value })}
                      placeholder="98"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={vitals.notes}
                      onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                      placeholder="Any additional observations..."
                      rows={2}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                  >
                    {loading ? 'Recording...' : 'Record Vitals'}
                  </Button>
                </CardContent>
              </Card>
            </form>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Readings</CardTitle>
                  <CardDescription>Your last 5 vital signs entries</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentVitals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No vitals recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentVitals.map((vital) => (
                        <div
                          key={vital.id}
                          className="p-4 bg-muted/30 rounded-lg space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium">
                              {format(new Date(vital.recorded_at), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {vital.blood_pressure_systolic && (
                              <div>
                                <span className="text-muted-foreground">BP:</span> {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                              </div>
                            )}
                            {vital.heart_rate && (
                              <div>
                                <span className="text-muted-foreground">HR:</span> {vital.heart_rate} bpm
                              </div>
                            )}
                            {vital.temperature_celsius && (
                              <div>
                                <span className="text-muted-foreground">Temp:</span> {vital.temperature_celsius}°C
                              </div>
                            )}
                            {vital.oxygen_saturation && (
                              <div>
                                <span className="text-muted-foreground">O2:</span> {vital.oxygen_saturation}%
                              </div>
                            )}
                          </div>
                          {vital.notes && (
                            <p className="text-xs text-muted-foreground">{vital.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
