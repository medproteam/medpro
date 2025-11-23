-- Create user profiles table for medical information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  full_name TEXT,
  date_of_birth DATE,
  blood_type TEXT,
  height_cm DECIMAL,
  weight_kg DECIMAL,
  medical_history TEXT[],
  allergies TEXT[],
  chronic_conditions TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can create their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_logs
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can create their own activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create vital signs table
CREATE TABLE IF NOT EXISTS public.vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  temperature_celsius DECIMAL,
  blood_sugar_mg_dl INTEGER,
  oxygen_saturation INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vital_signs
CREATE POLICY "Users can view their own vital signs"
  ON public.vital_signs
  FOR SELECT
  USING (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can create their own vital signs"
  ON public.vital_signs
  FOR INSERT
  WITH CHECK (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can update their own vital signs"
  ON public.vital_signs
  FOR UPDATE
  USING (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_wallet ON public.user_profiles(wallet_address);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_address, created_at DESC);
CREATE INDEX idx_vital_signs_user ON public.vital_signs(user_address, recorded_at DESC);