-- Push subscriptions: one row per device/browser per user.
-- Web Push (VAPID) rows carry p256dh/auth; the platform column leaves room
-- for a native Android subscription type later (separate sending path).
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL DEFAULT 'web' CHECK (platform IN ('web', 'android')),
  endpoint text NOT NULL UNIQUE,
  p256dh text,
  auth text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  CONSTRAINT push_subscriptions_web_keys_check
    CHECK (platform <> 'web' OR (p256dh IS NOT NULL AND auth IS NOT NULL))
);

CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users manage only their own subscriptions. Sending is done server-side
-- with the service role, which bypasses RLS.
CREATE POLICY "Users can view own push subscriptions"
  ON public.push_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can add own push subscriptions"
  ON public.push_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own push subscriptions"
  ON public.push_subscriptions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON public.push_subscriptions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
