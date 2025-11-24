import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { wagmiConfig } from '@/lib/wagmiConfig';
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginWalletPage from "./pages/LoginWalletPage";
import AIChatPage from "./pages/AIChatPage";
import HealthSearchPage from "./pages/HealthSearchPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ActivityHistoryPage from "./pages/ActivityHistoryPage";
import VitalSignsPage from "./pages/VitalSignsPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import HealthTrackingPage from "./pages/HealthTrackingPage";
import MedicationsPage from "./pages/MedicationsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotificationsPage from "./pages/NotificationsPage";
import MedicalDictionaryPage from "./pages/MedicalDictionaryPage";
import HealthQuizPage from "./pages/HealthQuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginWalletPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/health-library" element={<HealthSearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activity-history" element={<ActivityHistoryPage />} />
            <Route path="/vital-signs" element={<VitalSignsPage />} />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="/health-tracking" element={<HealthTrackingPage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/medical-dictionary" element={<MedicalDictionaryPage />} />
            <Route path="/health-quiz" element={<HealthQuizPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
