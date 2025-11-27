import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, ExternalLink, Activity } from 'lucide-react';
import { campTestnet } from '@/config/campNetwork';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface WalletConnectProps {
  autoOpenOnMount?: boolean;
}

export function WalletConnect({ autoOpenOnMount }: WalletConnectProps) {
  const { address, isConnected, chain } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showDialog, setShowDialog] = useState(false);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);

  useEffect(() => {
    if (autoOpenOnMount && !isConnected) {
      setShowDialog(true);
    }
  }, [autoOpenOnMount, isConnected]);
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
      await connectAsync({ connector });
      setShowDialog(false);
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Connection error:', error);
      
      // If user rejected, show friendly message
      if (error?.message?.includes('User rejected') || error?.message?.includes('rejected')) {
        toast.error('Connection cancelled');
        return;
      }
      
      // If no wallet found, guide user based on device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (error?.message?.includes('No provider') || error?.message?.includes('ConnectorNotFound')) {
        if (isMobile) {
          toast.error('No wallet detected. Please open MEDPRO inside your wallet app browser (MetaMask, Trust Wallet, etc.).');
        } else {
          toast.error('No browser wallet detected. Please install MetaMask, Rabby, or another EVM wallet extension.');
        }
        return;
      }
      
      if (isMobile && (typeof window !== 'undefined' && !window.ethereum)) {
        toast.error('Please open this app in your wallet browser (MetaMask, Trust Wallet, etc.)');
        return;
      }
      
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
            <DialogTitle className="text-2xl font-bold text-center">
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription className="text-center">
              Choose your preferred wallet to connect
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {connectors.map((connector, index) => {
              // Determine styling based on connector name
              const getConnectorStyle = (name: string) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('metamask')) {
                  return 'from-orange-500 to-orange-600';
                } else if (lowerName.includes('okx')) {
                  return 'from-slate-800 to-slate-900';
                } else if (lowerName.includes('injected') || lowerName.includes('browser')) {
                  return 'from-blue-500 to-purple-600';
                } else {
                  return 'from-primary to-secondary';
                }
              };

              return (
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
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getConnectorStyle(connector.name)} flex items-center justify-center`}>
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-base">{connector.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                📱 <strong>Mobile users:</strong> Open this page in your wallet's browser (MetaMask, Trust Wallet, etc.)
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                By connecting, you agree to MEDPRO's Terms of Service
              </p>
            </div>
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
