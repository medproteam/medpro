-- Fix RLS policies for notification_settings to use wallet_address instead of sub
DROP POLICY IF EXISTS "Users can view their own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can insert their own notification settings" ON notification_settings;
DROP POLICY IF EXISTS "Users can update their own notification settings" ON notification_settings;

CREATE POLICY "Users can view their own notification settings"
ON notification_settings
FOR SELECT
USING (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can insert their own notification settings"
ON notification_settings
FOR INSERT
WITH CHECK (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));

CREATE POLICY "Users can update their own notification settings"
ON notification_settings
FOR UPDATE
USING (user_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text));