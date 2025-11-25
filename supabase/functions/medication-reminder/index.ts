import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MedicationReminderRequest {
  userId: string;
  medicationId: string;
  phoneNumber?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { userId, medicationId, phoneNumber }: MedicationReminderRequest = await req.json();

    const { data: medication, error: medError } = await supabaseClient
      .from('medications')
      .select('*')
      .eq('id', medicationId)
      .eq('user_address', userId)
      .single();

    if (medError || !medication) {
      throw new Error('Medication not found');
    }

    const reminderMessage = `Reminder: Time to take ${medication.name} - ${medication.dosage}. ${medication.notes || ''}`;

    console.log('Reminder scheduled:', {
      medication: medication.name,
      user: userId,
      time: medication.time_of_day,
    });

    const response = {
      success: true,
      message: reminderMessage,
      medication: {
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        timeOfDay: medication.time_of_day,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in medication-reminder:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});