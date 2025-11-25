CREATE TABLE IF NOT EXISTS public.feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 1,
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_address, feature_name)
);

ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to view feature usage"
ON public.feature_usage
FOR SELECT
USING (true);

CREATE POLICY "Allow all to insert feature usage"
ON public.feature_usage
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to update feature usage"
ON public.feature_usage
FOR UPDATE
USING (true);

CREATE INDEX idx_feature_usage_user_feature ON public.feature_usage(user_address, feature_name);

CREATE TABLE IF NOT EXISTS public.bonanza_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  claimed BOOLEAN NOT NULL DEFAULT false,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.bonanza_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all to view bonanza rewards"
ON public.bonanza_rewards
FOR SELECT
USING (true);

CREATE POLICY "Allow all to insert bonanza rewards"
ON public.bonanza_rewards
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to update bonanza rewards"
ON public.bonanza_rewards
FOR UPDATE
USING (true);

CREATE INDEX idx_bonanza_user ON public.bonanza_rewards(user_address);
CREATE INDEX idx_bonanza_claimed ON public.bonanza_rewards(claimed);