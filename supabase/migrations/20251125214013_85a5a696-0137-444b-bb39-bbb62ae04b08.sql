-- Create premium subscriptions table to track CAMP token payments
CREATE TABLE IF NOT EXISTS public.premium_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  subscription_type TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow all users to view subscriptions (needed to check premium status)
CREATE POLICY "Allow all to view premium subscriptions"
ON public.premium_subscriptions
FOR SELECT
USING (true);

-- Allow all users to create subscriptions (when they pay)
CREATE POLICY "Allow all to create premium subscriptions"
ON public.premium_subscriptions
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_premium_subscriptions_user_address ON public.premium_subscriptions(user_address);
CREATE INDEX idx_premium_subscriptions_active ON public.premium_subscriptions(active);