CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    activity_type text NOT NULL,
    activity_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bonanza_rewards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bonanza_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    amount numeric NOT NULL,
    reason text NOT NULL,
    claimed boolean DEFAULT false NOT NULL,
    transaction_hash text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    claimed_at timestamp with time zone
);


--
-- Name: feature_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    feature_name text NOT NULL,
    usage_count integer DEFAULT 1 NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: health_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    record_type text NOT NULL,
    title text NOT NULL,
    data jsonb NOT NULL,
    interpretation text,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: medication_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medication_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    medication_id uuid NOT NULL,
    user_address text NOT NULL,
    taken_at timestamp with time zone DEFAULT now() NOT NULL,
    status text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT medication_logs_status_check CHECK ((status = ANY (ARRAY['taken'::text, 'missed'::text, 'skipped'::text])))
);


--
-- Name: medications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    name text NOT NULL,
    dosage text NOT NULL,
    frequency text NOT NULL,
    time_of_day text NOT NULL,
    notes text,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: premium_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.premium_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    subscription_type text NOT NULL,
    amount_paid numeric NOT NULL,
    transaction_hash text NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wallet_address text NOT NULL,
    full_name text,
    date_of_birth date,
    blood_type text,
    height_cm numeric,
    weight_kg numeric,
    medical_history text[],
    allergies text[],
    chronic_conditions text[],
    emergency_contact_name text,
    emergency_contact_phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vital_signs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vital_signs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_address text NOT NULL,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL,
    blood_pressure_systolic integer,
    blood_pressure_diastolic integer,
    heart_rate integer,
    temperature_celsius numeric,
    blood_sugar_mg_dl integer,
    oxygen_saturation integer,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: bonanza_rewards bonanza_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bonanza_rewards
    ADD CONSTRAINT bonanza_rewards_pkey PRIMARY KEY (id);


--
-- Name: feature_usage feature_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_usage
    ADD CONSTRAINT feature_usage_pkey PRIMARY KEY (id);


--
-- Name: feature_usage feature_usage_user_address_feature_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_usage
    ADD CONSTRAINT feature_usage_user_address_feature_name_key UNIQUE (user_address, feature_name);


--
-- Name: health_records health_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_records
    ADD CONSTRAINT health_records_pkey PRIMARY KEY (id);


--
-- Name: medication_logs medication_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medication_logs
    ADD CONSTRAINT medication_logs_pkey PRIMARY KEY (id);


--
-- Name: medications medications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_pkey PRIMARY KEY (id);


--
-- Name: premium_subscriptions premium_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.premium_subscriptions
    ADD CONSTRAINT premium_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: premium_subscriptions premium_subscriptions_transaction_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.premium_subscriptions
    ADD CONSTRAINT premium_subscriptions_transaction_hash_key UNIQUE (transaction_hash);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_wallet_address_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_wallet_address_key UNIQUE (wallet_address);


--
-- Name: vital_signs vital_signs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_logs_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_user ON public.activity_logs USING btree (user_address, created_at DESC);


--
-- Name: idx_bonanza_claimed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bonanza_claimed ON public.bonanza_rewards USING btree (claimed);


--
-- Name: idx_bonanza_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bonanza_user ON public.bonanza_rewards USING btree (user_address);


--
-- Name: idx_feature_usage_user_feature; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feature_usage_user_feature ON public.feature_usage USING btree (user_address, feature_name);


--
-- Name: idx_health_records_user_address; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_health_records_user_address ON public.health_records USING btree (user_address);


--
-- Name: idx_medication_logs_medication_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medication_logs_medication_id ON public.medication_logs USING btree (medication_id);


--
-- Name: idx_medication_logs_user_address; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medication_logs_user_address ON public.medication_logs USING btree (user_address);


--
-- Name: idx_medications_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medications_active ON public.medications USING btree (active);


--
-- Name: idx_medications_user_address; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medications_user_address ON public.medications USING btree (user_address);


--
-- Name: idx_premium_subscriptions_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_premium_subscriptions_active ON public.premium_subscriptions USING btree (active);


--
-- Name: idx_premium_subscriptions_user_address; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_premium_subscriptions_user_address ON public.premium_subscriptions USING btree (user_address);


--
-- Name: idx_user_profiles_wallet; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_profiles_wallet ON public.user_profiles USING btree (wallet_address);


--
-- Name: idx_vital_signs_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vital_signs_user ON public.vital_signs USING btree (user_address, recorded_at DESC);


--
-- Name: medications update_medications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: medication_logs medication_logs_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medication_logs
    ADD CONSTRAINT medication_logs_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id) ON DELETE CASCADE;


--
-- Name: medication_logs Allow all to create medication logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to create medication logs" ON public.medication_logs FOR INSERT WITH CHECK (true);


--
-- Name: medications Allow all to create medications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to create medications" ON public.medications FOR INSERT WITH CHECK (true);


--
-- Name: premium_subscriptions Allow all to create premium subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to create premium subscriptions" ON public.premium_subscriptions FOR INSERT WITH CHECK (true);


--
-- Name: medications Allow all to delete medications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to delete medications" ON public.medications FOR DELETE USING (true);


--
-- Name: bonanza_rewards Allow all to insert bonanza rewards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to insert bonanza rewards" ON public.bonanza_rewards FOR INSERT WITH CHECK (true);


--
-- Name: feature_usage Allow all to insert feature usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to insert feature usage" ON public.feature_usage FOR INSERT WITH CHECK (true);


--
-- Name: bonanza_rewards Allow all to update bonanza rewards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to update bonanza rewards" ON public.bonanza_rewards FOR UPDATE USING (true);


--
-- Name: feature_usage Allow all to update feature usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to update feature usage" ON public.feature_usage FOR UPDATE USING (true);


--
-- Name: medications Allow all to update medications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to update medications" ON public.medications FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: bonanza_rewards Allow all to view bonanza rewards; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to view bonanza rewards" ON public.bonanza_rewards FOR SELECT USING (true);


--
-- Name: feature_usage Allow all to view feature usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to view feature usage" ON public.feature_usage FOR SELECT USING (true);


--
-- Name: medication_logs Allow all to view medication logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to view medication logs" ON public.medication_logs FOR SELECT USING (true);


--
-- Name: medications Allow all to view medications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to view medications" ON public.medications FOR SELECT USING (true);


--
-- Name: premium_subscriptions Allow all to view premium subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all to view premium subscriptions" ON public.premium_subscriptions FOR SELECT USING (true);


--
-- Name: vital_signs Allow users to insert vitals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to insert vitals" ON public.vital_signs FOR INSERT WITH CHECK (true);


--
-- Name: vital_signs Allow users to update their vitals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to update their vitals" ON public.vital_signs FOR UPDATE USING (true);


--
-- Name: vital_signs Allow users to view their vitals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow users to view their vitals" ON public.vital_signs FOR SELECT USING (true);


--
-- Name: activity_logs Users can create their own activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own activity logs" ON public.activity_logs FOR INSERT WITH CHECK ((user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: health_records Users can create their own health records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own health records" ON public.health_records FOR INSERT WITH CHECK ((user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: user_profiles Users can create their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK ((wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: health_records Users can delete their own health records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own health records" ON public.health_records FOR DELETE USING ((user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: health_records Users can update their own health records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own health records" ON public.health_records FOR UPDATE USING ((user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: user_profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING ((wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: activity_logs Users can view their own activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs FOR SELECT USING ((user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: health_records Users can view their own health records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own health records" ON public.health_records FOR SELECT USING ((user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: user_profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING ((wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)));


--
-- Name: activity_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: bonanza_rewards; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bonanza_rewards ENABLE ROW LEVEL SECURITY;

--
-- Name: feature_usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

--
-- Name: health_records; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

--
-- Name: medication_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: medications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

--
-- Name: premium_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profiles user_profiles_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_profiles_insert ON public.user_profiles FOR INSERT WITH CHECK (true);


--
-- Name: user_profiles user_profiles_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_profiles_select ON public.user_profiles FOR SELECT USING (true);


--
-- Name: user_profiles user_profiles_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_profiles_update ON public.user_profiles FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: vital_signs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


