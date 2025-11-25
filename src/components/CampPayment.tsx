import { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
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
  onSuccess 
}: CampPaymentProps) => {
  const { address } = useAccount();
  const [isPaying, setIsPaying] = useState(false);
  const { sendTransaction, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsPaying(true);

      // Send CAMP tokens
      sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error?.message || 'Payment failed');
      setIsPaying(false);
    }
  };

  // Handle successful payment
  if (isSuccess && hash && !isPaying) {
    (async () => {
      try {
        // Record subscription in database
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);

        const { error } = await supabase
          .from('premium_subscriptions')
          .insert({
            user_address: address!,
            subscription_type: subscriptionType,
            amount_paid: parseFloat(amount),
            transaction_hash: hash,
            end_date: endDate.toISOString(),
            active: true,
          } as any);

        if (error) throw error;

        toast.success('Payment successful! Premium features unlocked.');
        setIsPaying(false);
        onSuccess?.();
      } catch (error: any) {
        console.error('Error recording subscription:', error);
        toast.error('Payment recorded but subscription update failed');
        setIsPaying(false);
      }
    })();
  }

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
            <span className="font-medium">Payment Successful!</span>
          </motion.div>
        ) : (
          <Button
            onClick={handlePayment}
            disabled={isPaying || isConfirming}
            className="w-full"
            size="lg"
          >
            {isPaying || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Processing...'}
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
