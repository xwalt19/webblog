/// <reference lib="deno.ns" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, countryCode = 'id' } = await req.json(); // Default to 'id' for Indonesia

    if (!year) {
      return new Response(JSON.stringify({ error: 'Year is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // @ts-ignore
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get('GOOGLE_CALENDAR_API_KEY');
    if (!GOOGLE_CALENDAR_API_KEY) {
      throw new Error('GOOGLE_CALENDAR_API_KEY is not set in Supabase secrets. Please add it via Supabase Console -> Edge Functions -> Manage Secrets.');
    }

    // Google's public holiday calendar ID for Indonesia
    // Format: en.<country_code>#holiday@group.v.calendar.google.com
    const calendarId = `en.${countryCode}%23holiday%40group.v.calendar.google.com`;
    const timeMin = `${year}-01-01T00:00:00Z`;
    const timeMax = `${year}-12-31T23:59:59Z`;

    const googleCalendarApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

    const googleResponse = await fetch(googleCalendarApiUrl);
    const googleData = await googleResponse.json();

    if (!googleResponse.ok || googleData.error) {
      console.error('Google Calendar API Error:', googleData.error);
      throw new Error(`Failed to fetch holidays from Google Calendar: ${googleData.error?.message || googleResponse.statusText}`);
    }

    const holidays = googleData.items.map((item: any) => ({
      title: item.summary,
      description: item.description || null,
      date: item.start.date || item.start.dateTime, // Use date or dateTime
      isHoliday: true, // Mark as holiday
    }));

    return new Response(JSON.stringify({ holidays }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});