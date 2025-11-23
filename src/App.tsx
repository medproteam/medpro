import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { wagmiConfig } from '@/lib/wagmiConfig';
import Index from "./pages/Index";
import LoginWalletPage from "./pages/LoginWalletPage";
import AIChatPage from "./pages/AIChatPage";
import HealthSearchPage from "./pages/HealthSearchPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ActivityHistoryPage from "./pages/ActivityHistoryPage";
import VitalSignsPage from "./pages/VitalSignsPage";
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
            <Route path="/login" element={<LoginWalletPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/health-library" element={<HealthSearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activity-history" element={<ActivityHistoryPage />} />
            <Route path="/vital-signs" element={<VitalSignsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
