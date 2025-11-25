import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MEDPRO_CONTRACT_ADDRESS } from '@/config/campNetwork';

export const BonanzaNotification = () => {
  const { address } = useAccount();
  const [reward, setReward] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { sendTransaction, data: hash } = useSendTransaction();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    checkForRewards();
    const interval = setInterval(checkForRewards, 60000);
    return () => clearInterval(interval);
  }, [address]);

  useEffect(() => {
    if (isSuccess && hash && reward) {
      markRewardAsClaimed(reward.id, hash);
    }
  }, [isSuccess, hash]);

  const checkForRewards = async () => {
    if (!address) return;

    try {
      const { data } = await supabase
        .from('bonanza_rewards')
        .select('*')
        .eq('user_address', address)
        .eq('claimed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setReward(data);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking rewards:', error);
    }
  };

  const markRewardAsClaimed = async (rewardId: string, txHash: string) => {
    try {
      await supabase
        .from('bonanza_rewards')
        .update({
          claimed: true,
          transaction_hash: txHash,
          claimed_at: new Date().toISOString(),
        })
        .eq('id', rewardId);

      toast.success('Bonanza reward claimed!');
      setIsVisible(false);
      setReward(null);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const handleClaim = async () => {
    if (!reward || !address) return;

    try {
      sendTransaction({
        to: address as `0x${string}`,
        value: parseEther(reward.amount.toString()),
      });
    } catch (error: any) {
      console.error('Claim error:', error);
      toast.error('Failed to claim reward');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && reward && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 right-4 z-50 max-w-sm"
        >
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">Bonanza Reward!</h3>
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{reward.reason}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {reward.amount} CAMP
                    </span>
                    <Button onClick={handleClaim} size="sm" className="gap-1">
                      <Gift className="w-4 h-4" />
                      Claim
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
