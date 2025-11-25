import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsRequest {
  userId: string;
  timeRange?: 'week' | 'month' | 'year';
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

    const { userId, timeRange = 'month' }: AnalyticsRequest = await req.json();

    const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data: vitals, error: vitalsError } = await supabaseClient
      .from('vital_signs')
      .select('*')
      .eq('user_address', userId)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (vitalsError) {
      throw vitalsError;
    }

    const { data: medications, error: medsError } = await supabaseClient
      .from('medications')
      .select('*')
      .eq('user_address', userId)
      .eq('active', true);

    if (medsError) {
      throw medsError;
    }

    const { data: activities, error: activitiesError } = await supabaseClient
      .from('activity_logs')
      .select('*')
      .eq('user_address', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (activitiesError) {
      throw activitiesError;
    }

    const analytics = {
      timeRange,
      vitals: {
        count: vitals?.length || 0,
        averages: calculateVitalAverages(vitals || []),
        trends: calculateTrends(vitals || []),
      },
      medications: {
        active: medications?.length || 0,
        adherenceRate: calculateAdherence(activities || []),
      },
      activities: {
        total: activities?.length || 0,
        byType: groupActivitiesByType(activities || []),
      },
    };

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in health-analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

function calculateVitalAverages(vitals: any[]) {
  if (vitals.length === 0) return null;

  const sum = vitals.reduce((acc, v) => ({
    heartRate: acc.heartRate + (v.heart_rate || 0),
    bpSystolic: acc.bpSystolic + (v.blood_pressure_systolic || 0),
    bpDiastolic: acc.bpDiastolic + (v.blood_pressure_diastolic || 0),
    temperature: acc.temperature + (v.temperature_celsius || 0),
    oxygenSat: acc.oxygenSat + (v.oxygen_saturation || 0),
  }), { heartRate: 0, bpSystolic: 0, bpDiastolic: 0, temperature: 0, oxygenSat: 0 });

  const count = vitals.length;
  return {
    heartRate: Math.round(sum.heartRate / count),
    bloodPressure: `${Math.round(sum.bpSystolic / count)}/${Math.round(sum.bpDiastolic / count)}`,
    temperature: (sum.temperature / count).toFixed(1),
    oxygenSaturation: Math.round(sum.oxygenSat / count),
  };
}

function calculateTrends(vitals: any[]) {
  if (vitals.length < 2) return { improving: false, stable: true };

  const recent = vitals.slice(-5);
  const older = vitals.slice(-10, -5);

  if (older.length === 0) return { improving: false, stable: true };

  const recentAvg = recent.reduce((sum, v) => sum + (v.heart_rate || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, v) => sum + (v.heart_rate || 0), 0) / older.length;

  return {
    improving: Math.abs(recentAvg - 72) < Math.abs(olderAvg - 72),
    stable: Math.abs(recentAvg - olderAvg) < 5,
  };
}

function calculateAdherence(activities: any[]) {
  const medActivities = activities.filter(a => a.activity_type === 'medication');
  if (medActivities.length === 0) return 0;

  const adherent = medActivities.filter(a => 
    a.activity_data?.action === 'taken'
  ).length;

  return Math.round((adherent / medActivities.length) * 100);
}

function groupActivitiesByType(activities: any[]) {
  return activities.reduce((acc, activity) => {
    const type = activity.activity_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}