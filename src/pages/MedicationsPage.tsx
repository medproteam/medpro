import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { MedicationTracker } from '@/components/MedicationTracker';

export default function MedicationsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MedicationTracker />
      </main>
      <BottomNav />
    </div>
  );
}
