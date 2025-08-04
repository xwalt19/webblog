/// <reference lib="deno.ns" />
// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { channelHandle } = await req.json();

    if (!channelHandle) {
      return new Response(JSON.stringify({ error: 'Channel handle is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // @ts-ignore: Deno global is available in Supabase Edge Functions runtime
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    if (!YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY is not set in Supabase secrets. Please add it via Supabase Console -> Edge Functions -> Manage Secrets.');
    }

    // 1. Get channel ID and uploads playlist ID from channel handle
    const channelSearchUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${encodeURIComponent(channelHandle)}&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelSearchUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok || channelData.error) {
      console.error('YouTube API Channel Search Error:', channelData.error);
      throw new Error(`Failed to fetch channel details: ${channelData.error?.message || channelResponse.statusText}`);
    }

    if (channelData.items.length === 0) {
      return new Response(JSON.stringify({ error: 'YouTube channel not found for the given handle.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    const channelId = channelData.items[0].id;
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    if (!uploadsPlaylistId) {
      return new Response(JSON.stringify({ error: 'Could not find uploads playlist for this channel.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // 2. Fetch videos from the uploads playlist
    const videos: any[] = [];
    let nextPageToken: string | null = null;
    const MAX_PAGES = 3; // Limit to 3 pages for performance (approx 150 videos)
    let pageCount = 0;

    do {
      const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const playlistResponse = await fetch(playlistItemsUrl);
      const playlistData = await playlistResponse.json();

      if (!playlistResponse.ok || playlistData.error) {
        console.error('YouTube API Playlist Items Error:', playlistData.error);
        throw new Error(`Failed to fetch playlist items: ${playlistData.error?.message || playlistResponse.statusText}`);
      }

      videos.push(...playlistData.items);
      nextPageToken = playlistData.nextPageToken;
      pageCount++;
    } while (nextPageToken && pageCount < MAX_PAGES);

    const extractedVideos = videos.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      video_url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      published_at: item.snippet.publishedAt,
    }));

    return new Response(JSON.stringify({ videos: extractedVideos }), {
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