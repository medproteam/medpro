import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { usePremiumStatus } from './usePremiumStatus';

export const useFeatureAccess = (featureName: string, freeUsageLimit: number = 1) => {
  const { address } = useAccount();
  const { isPremium } = usePremiumStatus();
  const [hasAccess, setHasAccess] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [address, isPremium, featureName]);

  const checkAccess = async () => {
    if (!address) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    if (isPremium) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('feature_usage')
        .select('usage_count')
        .eq('user_address', address)
        .eq('feature_name', featureName)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking feature access:', error);
      }

      const count = data?.usage_count || 0;
      setUsageCount(count);
      setHasAccess(count < freeUsageLimit);
    } catch (error) {
      console.error('Error checking feature access:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const trackUsage = async () => {
    if (!address) return;

    try {
      const { data: existing } = await supabase
        .from('feature_usage')
        .select('id, usage_count')
        .eq('user_address', address)
        .eq('feature_name', featureName)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('feature_usage')
          .update({
            usage_count: existing.usage_count + 1,
            last_used_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('feature_usage')
          .insert({
            user_address: address,
            feature_name: featureName,
            usage_count: 1,
          });
      }

      await checkAccess();
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  return { hasAccess, usageCount, isLoading, isPremium, trackUsage, refetch: checkAccess };
};
