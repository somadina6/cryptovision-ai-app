-- Enable pgcron extension if not already enabled
create extension if not exists pg_cron;

-- Schedule the token update function to run every hour
select cron.schedule(
  'update-tokens', -- unique job name
  '0 * * * *',    -- cron expression: run at minute 0 of every hour
  $$
  select
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.functions.supabase.co/update-tokens',
      headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);