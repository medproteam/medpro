import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Heart, Pill, Bell, AlertTriangle, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string;
  start_date: string;
  notes?: string;
  active: boolean;
}

export function MedicationTracker() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time_of_day: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (address) {
      fetchMedications();
    }
  }, [address]);

  const fetchMedications = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_address', address)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error: any) {
      console.error('Error fetching medications:', error);
      toast.error('Failed to load medications');
    }
  };

  const addMedication = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!newMed.name || !newMed.dosage || !newMed.frequency || !newMed.time_of_day) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('medications')
        .insert([{
          user_address: address,
          name: newMed.name,
          dosage: newMed.dosage,
          frequency: newMed.frequency,
          time_of_day: newMed.time_of_day,
          start_date: newMed.start_date,
          notes: newMed.notes,
          active: true
        }]);

      if (error) throw error;

      toast.success('Medication added successfully!');
      setNewMed({ name: '', dosage: '', frequency: '', time_of_day: '', start_date: new Date().toISOString().split('T')[0], notes: '' });
      setIsDialogOpen(false);
      fetchMedications();
    } catch (error: any) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <Card className="p-8 text-center">
        <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Connect your wallet to start tracking your medications
        </p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Medication Management</h2>
      </div>

      {/* Vital Signs Card */}
      <Card 
        className="p-4 bg-primary/10 border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
        onClick={() => navigate('/vital-signs')}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Vital Signs</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Medications List */}
      <AnimatePresence>
        {medications.length === 0 ? (
          <Card className="p-8 text-center">
            <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Medications Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your medications to stay on schedule
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {medications.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      {index % 2 === 0 ? (
                        <Heart className="w-6 h-6 text-primary" />
                      ) : (
                        <Pill className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{med.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {med.dosage} • {med.frequency} • {med.time_of_day}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Start Date: {formatDate(med.start_date)}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card className="p-5 text-center cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Reminders & Alerts</h3>
        </Card>
        
        <Card className="p-5 text-center cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Side Effects & Interactions</h3>
        </Card>
      </div>

      {/* Add Medication Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-full">
            Add Medication
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Medication Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Lisinopril"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                placeholder="e.g., 10 mg"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency *</Label>
              <Input
                id="frequency"
                placeholder="e.g., Once daily"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Time of Day *</Label>
              <Input
                id="time"
                placeholder="e.g., With breakfast"
                value={newMed.time_of_day}
                onChange={(e) => setNewMed({ ...newMed, time_of_day: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={newMed.start_date}
                onChange={(e) => setNewMed({ ...newMed, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any special instructions"
                value={newMed.notes}
                onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
              />
            </div>
            <Button 
              onClick={addMedication} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Adding...' : 'Add Medication'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}