import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, Pill, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string;
  notes?: string;
  active: boolean;
}

export function MedicationTracker() {
  const { address } = useAccount();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time_of_day: '',
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
        .eq('user_address', address.toLowerCase())
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

    if (!newMed.name || !newMed.dosage || !newMed.frequency) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('medications')
        .insert([{
          user_address: address.toLowerCase(),
          name: newMed.name,
          dosage: newMed.dosage,
          frequency: newMed.frequency,
          time_of_day: newMed.time_of_day,
          notes: newMed.notes,
          active: true
        }]);

      if (error) throw error;

      toast.success('Medication added successfully!');
      setNewMed({ name: '', dosage: '', frequency: '', time_of_day: '', notes: '' });
      setIsDialogOpen(false);
      fetchMedications();
    } catch (error: any) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };

  const logMedication = async (medicationId: string, status: 'taken' | 'missed' | 'skipped') => {
    if (!address) return;

    try {
      const { error } = await supabase
        .from('medication_logs')
        .insert([{
          medication_id: medicationId,
          user_address: address.toLowerCase(),
          status,
          taken_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success(status === 'taken' ? 'Medication logged!' : `Marked as ${status}`);
    } catch (error: any) {
      console.error('Error logging medication:', error);
      toast.error('Failed to log medication');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Medications</h2>
          <p className="text-muted-foreground">Track and manage your medication schedule</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="w-4 h-4 mr-2" />
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
                  placeholder="e.g., Aspirin"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 100mg"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  placeholder="e.g., Twice daily"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time of Day</Label>
                <Input
                  id="time"
                  placeholder="e.g., Morning and Evening"
                  value={newMed.time_of_day}
                  onChange={(e) => setNewMed({ ...newMed, time_of_day: e.target.value })}
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
          <div className="grid gap-4">
            {medications.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">{med.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Dosage:</strong> {med.dosage}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Frequency:</strong> {med.frequency}
                      </p>
                      {med.time_of_day && (
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {med.time_of_day}
                        </p>
                      )}
                      {med.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          {med.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-500/10"
                        onClick={() => logMedication(med.id, 'taken')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                        onClick={() => logMedication(med.id, 'skipped')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}