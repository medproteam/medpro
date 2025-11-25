import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, useOpenAI = false } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // System prompt for medical assistant
    const systemPrompt = `You are MEDPRO, an AI-powered medical adherence assistant. You help users:
- Track medications and set reminders
- Understand their prescriptions and medical conditions
- Interpret basic health metrics and test results
- Provide health tips and wellness advice
- Answer general health questions (always recommend consulting healthcare providers for serious issues)

Always be empathetic, clear, and encouraging. Never diagnose conditions or replace professional medical advice.`;

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    let aiResponse;

    if (useOpenAI) {
      // Use OpenAI API
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-mini-2025-08-07',
          messages: fullMessages,
          temperature: 0.7,
          max_completion_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await response.json();
      aiResponse = data.choices[0].message.content;
    } else {
      const AI_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!AI_API_KEY) {
        throw new Error('AI API key not configured');
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: fullMessages,
          temperature: 0.7,
        }),
      });

      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits depleted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!response.ok) {
        const error = await response.text();
        console.error('AI error:', error);
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      aiResponse = data.choices[0].message.content;
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error in ai-health-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});