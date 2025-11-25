import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  const { address } = useAccount();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    checkPremiumStatus();
  }, [address]);

  const checkPremiumStatus = async () => {
    if (!address) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('user_address', address)
        .eq('active', true)
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking premium status:', error);
      }

      setIsPremium(!!data);
      setSubscription(data);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isPremium, isLoading, subscription, refetch: checkPremiumStatus };
};
