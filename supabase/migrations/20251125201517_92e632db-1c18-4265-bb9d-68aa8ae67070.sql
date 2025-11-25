-- Drop and recreate RLS policies for medications to allow anon access

DROP POLICY IF EXISTS "Users can create their own medications" ON public.medications;
DROP POLICY IF EXISTS "Users can view their own medications" ON public.medications;
DROP POLICY IF EXISTS "Users can update their own medications" ON public.medications;
DROP POLICY IF EXISTS "Users can delete their own medications" ON public.medications;

CREATE POLICY "Allow all to create medications"
ON public.medications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to view medications"
ON public.medications
FOR SELECT
USING (true);

CREATE POLICY "Allow all to update medications"
ON public.medications
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all to delete medications"
ON public.medications
FOR DELETE
USING (true);

-- Drop and recreate RLS policies for medication_logs

DROP POLICY IF EXISTS "Users can create their own medication logs" ON public.medication_logs;
DROP POLICY IF EXISTS "Users can view their own medication logs" ON public.medication_logs;

CREATE POLICY "Allow all to create medication logs"
ON public.medication_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to view medication logs"
ON public.medication_logs
FOR SELECT
USING (true);