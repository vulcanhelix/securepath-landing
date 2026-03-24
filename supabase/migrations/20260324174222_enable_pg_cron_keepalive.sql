/*
  # Enable pg_cron and set up daily keep-alive job

  1. Extensions
    - Enable `pg_cron` extension for scheduled database jobs

  2. Scheduled Jobs
    - Create a daily cron job that runs a simple SELECT query
    - This prevents the Supabase free-tier project from pausing due to inactivity

  3. Notes
    - The job runs once every day at 06:00 UTC
    - pg_cron activity counts as database usage, keeping the project awake
*/

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

SELECT cron.schedule(
  'keep-alive-daily',
  '0 6 * * *',
  $$SELECT 1$$
);
