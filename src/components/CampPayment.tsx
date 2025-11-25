import { useEffect, useRef } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { BaseError, parseEther } from 'viem';
import { campTestnet } from '@/config/campNetwork';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Wallet, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CampPaymentProps {
  amount: string;
  recipientAddress: string;
  subscriptionType: string;
  durationDays: number;
  onSuccess?: () => void;
}

export const CampPayment = ({
  amount,
  recipientAddress,
  subscriptionType,
  durationDays,
  onSuccess,
}: CampPaymentProps) => {
  const { address, chainId } = useAccount();
  const {
    sendTransaction,
    data: hash,
    isPending,
    error,
    reset,
  } = useSendTransaction();
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
      (error as Error).message ||
      'Payment failed';
    toast.error(message);
  }, [error]);

  const handlePayment = () => {
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
      sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (e) {
      console.error('Payment error:', e);
      const message =
        (e as BaseError).shortMessage ||
        (e as Error).message ||
        'Payment failed';
      toast.error(message);
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
          Your payment will be processed on Camp Network Testnet
        </p>
      </CardContent>
    </Card>
  );
};
