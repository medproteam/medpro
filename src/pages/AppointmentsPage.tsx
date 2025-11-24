import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppointmentsPage() {
  const [appointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-01-15',
      time: '10:00 AM',
      location: 'City Medical Center',
      type: 'In-person',
      status: 'Upcoming',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      date: '2024-01-20',
      time: '2:30 PM',
      location: 'Virtual',
      type: 'Telemedicine',
      status: 'Upcoming',
    },
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container px-4 py-8 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Appointments</h1>
              <p className="text-muted-foreground">Manage your medical appointments</p>
            </div>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>

          <div className="space-y-4">
            {appointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h3 className="font-semibold text-lg">{apt.doctor}</h3>
                          <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{apt.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {apt.type === 'Telemedicine' ? (
                              <Video className="w-4 h-4 text-secondary" />
                            ) : (
                              <MapPin className="w-4 h-4 text-accent" />
                            )}
                            <span>{apt.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {appointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No appointments scheduled</h3>
                <p className="text-muted-foreground mb-4">Book your first appointment to get started</p>
                <Button>Book Appointment</Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
