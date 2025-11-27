import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

interface ProfileData {
  // Step 1: Health Profile
  dateOfBirth: string;
  gender: string;
  heightCm: string;
  weightKg: string;
  commonSickness: string;
  bloodType: string;
  
  // Step 2: Goals
  primaryGoal: string;
  goalTimeline: string;
  targetWeight: string;
  
  // Step 3: Preferences
  insightsFrequency: string;
  reminderTime: string;
  notificationTypes: string[];
}

export function SignupFlow() {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    dateOfBirth: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    commonSickness: '',
    bloodType: '',
    primaryGoal: '',
    goalTimeline: '',
    targetWeight: '',
    insightsFrequency: '',
    reminderTime: '',
    notificationTypes: [],
  });
  const navigate = useNavigate();
  const { address } = useAccount();

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSkip = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save to database if wallet is connected
      if (address) {
        try {
          const { error } = await supabase.from('user_profiles').upsert({
            wallet_address: address.toLowerCase(),
            date_of_birth: profileData.dateOfBirth || null,
            height_cm: profileData.heightCm ? parseFloat(profileData.heightCm) : null,
            weight_kg: profileData.weightKg ? parseFloat(profileData.weightKg) : null,
            blood_type: profileData.bloodType || null,
          });
          
          if (error) throw error;
          toast.success('Profile saved successfully!');
        } catch (error) {
          console.error('Error saving profile:', error);
        }
      }
      navigate('/login');
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Step {step} of 3</span>
            <button onClick={handleSkip} className="text-medical-cyan hover:underline">
              Skip
            </button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-8 text-sm">
          <button
            onClick={() => setStep(1)}
            className={step === 1 ? 'text-medical-cyan font-semibold' : 'text-muted-foreground'}
          >
            Health Profile
          </button>
          <button
            onClick={() => setStep(2)}
            className={step === 2 ? 'text-medical-cyan font-semibold' : 'text-muted-foreground'}
          >
            Goals
          </button>
          <button
            onClick={() => setStep(3)}
            className={step === 3 ? 'text-medical-cyan font-semibold' : 'text-muted-foreground'}
          >
            Preferences
          </button>
        </div>

        <Card className="p-6 space-y-6">
          {/* Step 1: Health Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground font-normal">Date of Birth</Label>
                  <Input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    placeholder="/mm/yyyy"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground font-normal">Gender</Label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-muted-foreground"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label className="text-muted-foreground font-normal">Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="170"
                    value={profileData.heightCm}
                    onChange={(e) => updateField('heightCm', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground font-normal">Current Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={profileData.weightKg}
                    onChange={(e) => updateField('weightKg', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground font-normal">Common Sickness</Label>
                  <Input
                    placeholder="e.g., Allergies, Asthma"
                    value={profileData.commonSickness}
                    onChange={(e) => updateField('commonSickness', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground font-normal">Blood Group</Label>
                  <select
                    value={profileData.bloodType}
                    onChange={(e) => updateField('bloodType', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-muted-foreground"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">What are your goals?</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>What is your primary Health Goal?</Label>
                  <Input
                    placeholder="e.g., Weight loss, Fitness, Disease management"
                    value={profileData.primaryGoal}
                    onChange={(e) => updateField('primaryGoal', e.target.value)}
                  />
                </div>

                <div>
                  <Label>How soon do you hope to achieve this goal?</Label>
                  <Input
                    placeholder="e.g., 3 months, 6 months, 1 year"
                    value={profileData.goalTimeline}
                    onChange={(e) => updateField('goalTimeline', e.target.value)}
                  />
                </div>

                <div>
                  <Label>What is your Target Weight?</Label>
                  <Input
                    type="number"
                    placeholder="65"
                    value={profileData.targetWeight}
                    onChange={(e) => updateField('targetWeight', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Communication & Alerts</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>How often would you like to receive personalized Health Insights?</Label>
                  <select
                    value={profileData.insightsFrequency}
                    onChange={(e) => updateField('insightsFrequency', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <Label>Preferred time for Medication Reminders</Label>
                  <Input
                    type="time"
                    value={profileData.reminderTime}
                    onChange={(e) => updateField('reminderTime', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Which types of notifications are you comfortable receiving?</Label>
                  <div className="space-y-2 mt-2">
                    {['Health Insights', 'Medication Reminders', 'Appointment Alerts', 'Wellness Tips'].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          checked={profileData.notificationTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField('notificationTypes', [...profileData.notificationTypes, type].join(','));
                            } else {
                              updateField('notificationTypes', profileData.notificationTypes.filter(t => t !== type).join(','));
                            }
                          }}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base rounded-full"
          >
            {step === 3 ? 'Complete' : 'Next'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
