-- Add gathering time settings to teams
ALTER TABLE teams
  ADD COLUMN default_gathering_minutes integer NOT NULL DEFAULT 60,
  ADD COLUMN home_address text;

-- Add gathering time and travel time to matches
ALTER TABLE matches
  ADD COLUMN gathering_time timestamptz,
  ADD COLUMN travel_time_minutes integer;
