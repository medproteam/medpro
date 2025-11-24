import { useState, useEffect } from 'react';
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
import { User, Heart, AlertCircle, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    date_of_birth: '',
    blood_type: '',
    height_cm: '',
    weight_kg: '',
    medical_history: '',
    allergies: '',
    chronic_conditions: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  useEffect(() => {
    if (!isConnected || !address) return;
    loadProfile();
  }, [isConnected, address]);

  const loadProfile = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          date_of_birth: data.date_of_birth || '',
          blood_type: data.blood_type || '',
          height_cm: data.height_cm?.toString() || '',
          weight_kg: data.weight_kg?.toString() || '',
          medical_history: data.medical_history?.join(', ') || '',
          allergies: data.allergies?.join(', ') || '',
          chronic_conditions: data.chronic_conditions?.join(', ') || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    try {
      const profileData = {
        wallet_address: address,
        full_name: profile.full_name,
        date_of_birth: profile.date_of_birth || null,
        blood_type: profile.blood_type || null,
        height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
        weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
        medical_history: profile.medical_history ? profile.medical_history.split(',').map(s => s.trim()) : [],
        allergies: profile.allergies ? profile.allergies.split(',').map(s => s.trim()) : [],
        chronic_conditions: profile.chronic_conditions ? profile.chronic_conditions.split(',').map(s => s.trim()) : [],
        emergency_contact_name: profile.emergency_contact_name || null,
        emergency_contact_phone: profile.emergency_contact_phone || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'wallet_address' });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-cyan/10 via-background to-medical-blue/10 pb-20">
      <Header />
      <main className="container px-4 py-12 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-medical-cyan/15 mx-auto">
              <Activity className="w-8 h-8 text-medical-cyan" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 text-medical-blue">
                Create your MEDPRO profile
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Add your key medical details so MEDPRO can personalize its recommendations.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic details about you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Blood Type</Label>
                    <Input
                      id="blood_type"
                      value={profile.blood_type}
                      onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                      placeholder="A+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height_cm">Height (cm)</Label>
                    <Input
                      id="height_cm"
                      type="number"
                      value={profile.height_cm}
                      onChange={(e) => setProfile({ ...profile, height_cm: e.target.value })}
                      placeholder="175"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      type="number"
                      value={profile.weight_kg}
                      onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value })}
                      placeholder="70"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Medical Information
                </CardTitle>
                <CardDescription>Your health history and conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                  <Textarea
                    id="allergies"
                    value={profile.allergies}
                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                    placeholder="Penicillin, Peanuts, Latex"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chronic_conditions">Chronic Conditions (comma-separated)</Label>
                  <Textarea
                    id="chronic_conditions"
                    value={profile.chronic_conditions}
                    onChange={(e) => setProfile({ ...profile, chronic_conditions: e.target.value })}
                    placeholder="Diabetes, Hypertension"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical_history">Medical History (comma-separated)</Label>
                  <Textarea
                    id="medical_history"
                    value={profile.medical_history}
                    onChange={(e) => setProfile({ ...profile, medical_history: e.target.value })}
                    placeholder="Surgery 2020, Broken arm 2018"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>Who to contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={profile.emergency_contact_name}
                      onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      value={profile.emergency_contact_phone}
                      onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
