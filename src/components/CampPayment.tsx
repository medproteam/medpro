import { useEffect, useRef, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSendTransaction, useReadContract } from 'wagmi';
import { BaseError, parseEther } from 'viem';
import { campTestnet, MEDPRO_CONTRACT_ADDRESS, MEDPRO_PAYMENT_ADDRESS } from '@/config/campNetwork';
import { HEALTH_RECORDS_ABI } from '@/config/healthRecordsABI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Wallet, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CampPaymentProps {
  amount: string;
  subscriptionType: string;
  durationDays: number;
  onSuccess?: () => void;
}

export const CampPayment = ({
  amount,
  subscriptionType,
  durationDays,
  onSuccess,
}: CampPaymentProps) => {
  const { address, chainId } = useAccount();
  const [useDirectTransfer, setUseDirectTransfer] = useState(false);
  
  // Contract payment hooks
  const {
    writeContract,
    data: contractHash,
    isPending: isContractPending,
    error: contractError,
    reset: resetContract,
  } = useWriteContract();
  
  // Direct transfer hooks
  const {
    sendTransaction,
    data: transferHash,
    isPending: isTransferPending,
    error: transferError,
    reset: resetTransfer,
  } = useSendTransaction();
  
  // Check if contract is deployed by trying to read from it
  const { data: contractCode, isError: contractCheckError } = useReadContract({
    address: MEDPRO_CONTRACT_ADDRESS as `0x${string}`,
    abi: HEALTH_RECORDS_ABI,
    functionName: 'hasActiveSubscription',
    args: [address as `0x${string}`],
    chainId: campTestnet.id,
    query: {
      enabled: !!address,
    },
  });
  
  const hash = contractHash || transferHash;
  const isPending = isContractPending || isTransferPending;
  const error = contractError || transferError;
  const reset = useDirectTransfer ? resetTransfer : resetContract;
  
  const {
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    if (!error) return;

    console.error('Payment error:', error);
    const message =
      (error as BaseError).shortMessage ||
      (error as BaseError).details ||
      (error as Error).message ||
      'Payment failed';
    toast.error(`Transaction failed: ${message}`);
  }, [error]);

  const handlePayment = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (chainId !== campTestnet.id) {
      toast.error('Please switch your wallet to Camp Network Testnet before paying');
      return;
    }

    try {
      hasRecordedRef.current = false;
      reset();
      
      // Try contract payment first if not forcing direct transfer
      if (!useDirectTransfer && !contractCheckError) {
        console.log('Initiating smart contract payment:', {
          contract: MEDPRO_CONTRACT_ADDRESS,
          value: amount,
          durationDays,
          subscriptionType,
        });

        writeContract({
          address: MEDPRO_CONTRACT_ADDRESS as `0x${string}`,
          abi: HEALTH_RECORDS_ABI,
          functionName: 'paySubscription',
          args: [BigInt(durationDays), subscriptionType],
          value: parseEther(amount),
          chain: campTestnet,
          account: address as `0x${string}`,
        });
      } else {
        // Fallback to direct wallet transfer
        console.log('Initiating direct transfer payment:', {
          to: MEDPRO_PAYMENT_ADDRESS,
          value: amount,
        });

        sendTransaction({
          to: MEDPRO_PAYMENT_ADDRESS as `0x${string}`,
          value: parseEther(amount),
          chain: campTestnet,
        });
      }
    } catch (e) {
      console.error('Payment error:', e);
      const message =
        (e as BaseError).shortMessage ||
        (e as BaseError).message ||
        (e as Error).message ||
        'Payment failed';
      toast.error(`Transaction failed: ${message}`);
      
      // If contract payment fails, suggest direct transfer
      if (!useDirectTransfer) {
        toast.info('Switching to direct wallet transfer...');
        setUseDirectTransfer(true);
      }
    }
  };

  useEffect(() => {
    if (!isSuccess || !hash || !address || hasRecordedRef.current) return;

    hasRecordedRef.current = true;

    const recordSubscription = async () => {
      try {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);

        const { error: insertError } = await supabase
          .from('premium_subscriptions')
          .insert({
            user_address: address,
            subscription_type: subscriptionType,
            amount_paid: parseFloat(amount),
            transaction_hash: hash,
            end_date: endDate.toISOString(),
            active: true,
          } as any);

        if (insertError) throw insertError;

        toast.success('Payment successful. Premium features unlocked.');
        onSuccess?.();
      } catch (e) {
        console.error('Error recording subscription:', e);
        toast.error('Payment recorded but subscription update failed');
      }
    };

    recordSubscription();
  }, [
    isSuccess,
    hash,
    address,
    durationDays,
    subscriptionType,
    amount,
    onSuccess,
  ]);

  const isProcessing = isPending || isConfirming;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Payment with CAMP Tokens
        </CardTitle>
        <CardDescription>
          Secure blockchain payment on Camp Network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contractCheckError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Smart contract not yet deployed. Using direct wallet transfer as payment method.
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-bold">{amount} CAMP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Subscription:</span>
            <span className="font-medium">{subscriptionType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Duration:</span>
            <span className="font-medium">{durationDays} days</span>
          </div>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg text-primary"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Payment Successful.</span>
          </motion.div>
        ) : (
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Processing in wallet...'}
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Pay {amount} CAMP
              </>
            )}
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          {useDirectTransfer || contractCheckError 
            ? `Payment will be sent directly to ${MEDPRO_PAYMENT_ADDRESS.slice(0, 6)}...${MEDPRO_PAYMENT_ADDRESS.slice(-4)}`
            : 'Payment will be processed via smart contract on Camp Network Testnet'
          }
        </p>
      </CardContent>
    </Card>
  );
};
