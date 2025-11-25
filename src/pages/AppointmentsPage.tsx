import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
  });
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Appointment request sent! A doctor will confirm shortly.');
    setBookingData({ date: '', time: '', reason: '' });
    setShowBookingForm(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent to medical team!');
    setMessageData({ subject: '', message: '' });
    setShowMessageForm(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container px-4 py-8 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Appointments & Messages</h1>
            <p className="text-muted-foreground">Book appointments and message our medical team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setShowBookingForm(true);
                setShowMessageForm(false);
              }}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant={showBookingForm ? "default" : "outline"}
            >
              <Calendar className="w-8 h-8" />
              <span className="font-semibold">Book Appointment</span>
            </Button>

            <Button
              onClick={() => {
                setShowMessageForm(true);
                setShowBookingForm(false);
              }}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant={showMessageForm ? "default" : "outline"}
            >
              <MessageSquare className="w-8 h-8" />
              <span className="font-semibold">Message Doctor</span>
            </Button>
          </div>

          {showBookingForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book an Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe your symptoms or reason for appointment..."
                        value={bookingData.reason}
                        onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Appointment Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {showMessageForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Message Medical Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What is this about?"
                        value={messageData.subject}
                        onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={messageData.message}
                        onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                        required
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!showBookingForm && !showMessageForm && (
            <Card className="bg-muted/30">
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">Select an Option Above</h3>
                <p className="text-muted-foreground">Choose to book an appointment or send a message to our medical team</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}