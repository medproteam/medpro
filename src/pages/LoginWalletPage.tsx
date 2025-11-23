import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LoginWalletPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">
              Connect your wallet to access your health dashboard
            </p>
          </div>
          <div className="mt-8">
            <WalletConnect />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginWalletPage;
