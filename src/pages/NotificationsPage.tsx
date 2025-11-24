import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Bell, Smartphone, MessageSquare, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState({
    pushEnabled: false,
    smsEnabled: false,
    emailEnabled: false,
    medicationReminders: true,
    appointmentReminders: true,
    healthInsights: true,
    vitalSignAlerts: true,
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/database
    toast.success('Notification settings saved successfully!');
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings({ ...settings, pushEnabled: true });
        toast.success('Push notifications enabled!');
      } else {
        toast.error('Push notification permission denied');
      }
    } else {
      toast.error('Push notifications not supported in this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <Header />
      <main className="container px-4 py-12 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 mx-auto mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Notification Settings
            </h1>
            <p className="text-muted-foreground">
              Manage how you receive health updates and reminders
            </p>
          </div>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Receive instant notifications on this device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push">Enable Push Notifications</Label>
                <div className="flex items-center gap-3">
                  <Switch
                    id="push"
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestPushPermission();
                      } else {
                        setSettings({ ...settings, pushEnabled: false });
                      }
                    }}
                  />
                </div>
              </div>
              {!settings.pushEnabled && (
                <Button
                  onClick={requestPushPermission}
                  variant="outline"
                  className="w-full"
                >
                  Enable Push Notifications
                </Button>
              )}
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                SMS Notifications
              </CardTitle>
              <CardDescription>
                Get text messages for important health updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms">Enable SMS Notifications</Label>
                <Switch
                  id="sms"
                  checked={settings.smsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, smsEnabled: checked })
                  }
                  disabled={!phoneNumber}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Standard messaging rates may apply
              </p>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Receive detailed health reports and summaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotif">Enable Email Notifications</Label>
                <Switch
                  id="emailNotif"
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailEnabled: checked })
                  }
                  disabled={!email}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="medication">Medication Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Never miss a dose
                  </p>
                </div>
                <Switch
                  id="medication"
                  checked={settings.medicationReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, medicationReminders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appointment">Appointment Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Get reminded before appointments
                  </p>
                </div>
                <Switch
                  id="appointment"
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, appointmentReminders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="insights">Health Insights</Label>
                  <p className="text-xs text-muted-foreground">
                    Personalized health tips
                  </p>
                </div>
                <Switch
                  id="insights"
                  checked={settings.healthInsights}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, healthInsights: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="vitals">Vital Sign Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get alerted for abnormal readings
                  </p>
                </div>
                <Switch
                  id="vitals"
                  checked={settings.vitalSignAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, vitalSignAlerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white h-12"
          >
            Save Settings
          </Button>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
