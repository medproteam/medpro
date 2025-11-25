import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const reasons = [
      'Daily login bonus!',
      'Health tracking milestone reached!',
      'Completed weekly medication adherence!',
      'Recorded vital signs consistently!',
      'Engaged with AI health assistant!',
      'Updated your health profile!',
    ];

    const { data: users } = await supabaseClient
      .from('user_profiles')
      .select('wallet_address');

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const rewards = [];
    for (const user of users) {
      const shouldGetReward = Math.random() > 0.7;
      
      if (shouldGetReward) {
        const amount = (Math.random() * 0.0005).toFixed(6);
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        
        rewards.push({
          user_address: user.wallet_address,
          amount: parseFloat(amount),
          reason: reason,
          claimed: false,
        });
      }
    }

    if (rewards.length > 0) {
      const { error } = await supabaseClient
        .from('bonanza_rewards')
        .insert(rewards);

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ message: `Created ${rewards.length} bonanza rewards` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
