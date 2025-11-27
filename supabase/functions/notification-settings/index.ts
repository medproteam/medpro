import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationSettingsPayload {
  action: 'get' | 'save';
  userAddress: string;
  phoneNumber?: string;
  email?: string;
  settings?: {
    pushEnabled: boolean;
    smsEnabled: boolean;
    emailEnabled: boolean;
    medicationReminders: boolean;
    appointmentReminders: boolean;
    healthInsights: boolean;
    vitalSignAlerts: boolean;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as NotificationSettingsPayload;

    if (!payload?.userAddress) {
      return new Response(
        JSON.stringify({ error: 'userAddress is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    if (payload.action === 'get') {
      const { data, error } = await supabaseClient
        .from('notification_settings')
        .select('*')
        .eq('user_address', payload.userAddress)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading notification settings:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ settings: data ?? null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (payload.action === 'save') {
      const settings = payload.settings ?? {
        pushEnabled: false,
        smsEnabled: false,
        emailEnabled: false,
        medicationReminders: true,
        appointmentReminders: true,
        healthInsights: true,
        vitalSignAlerts: true,
      };

      const { error } = await supabaseClient
        .from('notification_settings')
        .upsert({
          user_address: payload.userAddress,
          phone_number: payload.phoneNumber ?? null,
          email: payload.email ?? null,
          push_enabled: settings.pushEnabled,
          sms_enabled: settings.smsEnabled,
          email_enabled: settings.emailEnabled,
          medication_reminders: settings.medicationReminders,
          appointment_reminders: settings.appointmentReminders,
          health_insights: settings.healthInsights,
          vital_sign_alerts: settings.vitalSignAlerts,
        }, {
          onConflict: 'user_address',
        });

      if (error) {
        console.error('Error saving notification settings:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    console.error('Error in notification-settings function:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
