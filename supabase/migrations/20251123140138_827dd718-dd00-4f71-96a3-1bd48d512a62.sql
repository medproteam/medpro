-- Create medications table for tracking user medications
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  notes TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medication_logs table for tracking medication intake
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('taken', 'missed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_records table for storing test results
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  interpretation TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medications (wallet-based)
CREATE POLICY "Users can view their own medications"
ON public.medications FOR SELECT
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can create their own medications"
ON public.medications FOR INSERT
WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update their own medications"
ON public.medications FOR UPDATE
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can delete their own medications"
ON public.medications FOR DELETE
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS Policies for medication_logs
CREATE POLICY "Users can view their own medication logs"
ON public.medication_logs FOR SELECT
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can create their own medication logs"
ON public.medication_logs FOR INSERT
WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS Policies for health_records
CREATE POLICY "Users can view their own health records"
ON public.health_records FOR SELECT
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can create their own health records"
ON public.health_records FOR INSERT
WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update their own health records"
ON public.health_records FOR UPDATE
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can delete their own health records"
ON public.health_records FOR DELETE
USING (user_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create indexes for better query performance
CREATE INDEX idx_medications_user_address ON public.medications(user_address);
CREATE INDEX idx_medications_active ON public.medications(active);
CREATE INDEX idx_medication_logs_user_address ON public.medication_logs(user_address);
CREATE INDEX idx_medication_logs_medication_id ON public.medication_logs(medication_id);
CREATE INDEX idx_health_records_user_address ON public.health_records(user_address);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on medications
CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON public.medications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();