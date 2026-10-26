-- Realtime postgres_changes only fire for tables in the supabase_realtime
-- publication. It was empty, so the availability grid and event attendance
-- never updated live on either client.
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability, public.event_attendance;
