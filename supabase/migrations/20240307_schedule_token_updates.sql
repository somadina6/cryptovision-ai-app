-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing schedule if it exists
SELECT cron.unschedule('update-tokens-every-30-minutes');

-- Create the new schedule
SELECT cron.schedule(
  'update-tokens-every-30-minutes',
  '*/30 * * * *', -- every 30 minutes
  $$
  SELECT
    net.http_post(
      url:='https://nrjyadiljqryvrqwihvo.supabase.co/functions/v1/update-tokens',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yanlhZGlsanFyeXZycXdpaHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyODUxMDAsImV4cCI6MjA1MTg2MTEwMH0.TL7XuPUx4SXWi6xKtzdqRnqDkhlNmX4mwMffPRHuP0I"}'::jsonb,
      body:=format('{"timestamp": "%s"}', now())::jsonb
    ) as request_id;
  $$
); 