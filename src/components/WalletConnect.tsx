import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, ExternalLink, Activity } from 'lucide-react';
import { campTestnet } from '@/config/campNetwork';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showDialog, setShowDialog] = useState(false);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);

  // Auto-switch to Camp Network if connected to wrong chain
  useEffect(() => {
    if (isConnected && chain?.id !== campTestnet.id && switchChain) {
      handleAddNetwork();
    }
  }, [isConnected, chain, switchChain]);

  const handleAddNetwork = async () => {
    if (!switchChain) return;
    
    setIsAddingNetwork(true);
    try {
      await switchChain({ chainId: campTestnet.id });
      toast.success('Switched to Camp Network Testnet!');
    } catch (error: any) {
      // If network doesn't exist in wallet, add it manually
      if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
        try {
          if (typeof window !== 'undefined' && window.ethereum) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${campTestnet.id.toString(16)}`,
                  chainName: campTestnet.name,
                  nativeCurrency: campTestnet.nativeCurrency,
                  rpcUrls: [campTestnet.rpcUrls.default.http[0]],
                  blockExplorerUrls: [campTestnet.blockExplorers.default.url],
                },
              ],
            });
            toast.success('Camp Network added to wallet!');
          }
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add Camp Network. Please add it manually.');
        }
      } else {
        console.error('Error switching network:', error);
        toast.error('Failed to switch network. Please switch manually.');
      }
    } finally {
      setIsAddingNetwork(false);
    }
  };

  const handleConnect = async (connector: any) => {
    try {
      // Check if mobile and no wallet installed
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile && !window.ethereum) {
        // Redirect to Play Store/App Store
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const storeUrl = isIOS 
          ? 'https://apps.apple.com/app/metamask/id1438144202'
          : 'https://play.google.com/store/apps/details?id=io.metamask';
        
        window.open(storeUrl, '_blank');
        toast.info('Please install a Web3 wallet to continue');
        return;
      }

      await connect({ connector });
      setShowDialog(false);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {chain?.id !== campTestnet.id && (
          <Button
            onClick={handleAddNetwork}
            disabled={isAddingNetwork}
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            {isAddingNetwork ? 'Switching...' : 'Wrong Network'}
          </Button>
        )}
        <Card className="px-4 py-2 shadow-md border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </Card>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription>
              Choose your preferred wallet to connect to MEDPRO on Camp Network
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {connectors.map((connector, index) => (
              <motion.div
                key={connector.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleConnect(connector)}
                  disabled={isPending}
                  variant="outline"
                  className="w-full justify-between h-auto py-4 hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{connector.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              By connecting, you agree to MEDPRO's Terms of Service and Privacy Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Extend window type for ethereum provider
declare global {
  interface Window {
    ethereum?: any;
  }
}
