/*
  # Add Audio Support to Insights

  ## Summary
  Adds text-to-speech audio capability to the Insights blog section.
  Audio files are generated via Deepgram Aura TTS and cached in
  Supabase Storage for subsequent playback.

  ## Changes
  - Adds `audio_url` column to `insights` table (nullable text)
  - Creates `article-audio` Storage bucket for MP3 files
  - RLS policies: public read, service-role write
*/

-- Add audio_url column to insights table
ALTER TABLE insights ADD COLUMN IF NOT EXISTS audio_url text;

-- Create Storage bucket for article audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-audio',
  'article-audio',
  true,
  52428800,
  ARRAY['audio/mpeg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to audio files
CREATE POLICY "Public read access on article-audio"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-audio');

-- Allow service role to upload audio files
CREATE POLICY "Service role can insert article-audio"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'article-audio');

-- Allow service role to overwrite audio files (upsert)
CREATE POLICY "Service role can update article-audio"
  ON storage.objects FOR UPDATE
  TO service_role
  USING (bucket_id = 'article-audio');
