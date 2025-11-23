-- Relax RLS on user_profiles to allow inserts/updates from the app (wallet-based, no Supabase auth)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "user_profiles_select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_all" ON public.user_profiles;

-- Allow all operations on user_profiles (suitable for hackathon / wallet-based pseudonymous users)
CREATE POLICY "user_profiles_select"
ON public.user_profiles
FOR SELECT
USING (true);

CREATE POLICY "user_profiles_insert"
ON public.user_profiles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "user_profiles_update"
ON public.user_profiles
FOR UPDATE
USING (true)
WITH CHECK (true);
