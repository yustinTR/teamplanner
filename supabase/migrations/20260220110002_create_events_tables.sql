-- Events feature: events, attendance, tasks
create type public.attendance_status as enum ('coming','not_coming','maybe');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  description text,
  event_date timestamptz not null,
  end_date timestamptz,
  location text,
  notes text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_events_team_id on public.events(team_id);

create table public.event_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  status public.attendance_status not null,
  responded_at timestamptz not null default now(),
  unique (event_id, player_id)
);

create table public.event_tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references public.players(id) on delete set null,
  deadline timestamptz,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_event_tasks_event_id on public.event_tasks(event_id);

-- RLS for events
alter table public.events enable row level security;
alter table public.event_attendance enable row level security;
alter table public.event_tasks enable row level security;

-- Events: coach full CRUD
create policy "Coach can manage events" on public.events for all
  using (team_id in (select id from public.teams where created_by = auth.uid()))
  with check (team_id in (select id from public.teams where created_by = auth.uid()));

-- Events: team members can view
create policy "Players can view events" on public.events for select
  using (
    team_id in (select id from public.teams where created_by = auth.uid())
    or team_id in (select team_id from public.players where user_id = auth.uid())
  );

-- Event attendance: coach full CRUD
create policy "Coach can manage event attendance" on public.event_attendance for all
  using (event_id in (
    select e.id from public.events e
    join public.teams t on t.id = e.team_id where t.created_by = auth.uid()
  ))
  with check (event_id in (
    select e.id from public.events e
    join public.teams t on t.id = e.team_id where t.created_by = auth.uid()
  ));

-- Event attendance: players can view all and upsert own
create policy "Players can view event attendance" on public.event_attendance for select
  using (event_id in (
    select e.id from public.events e
    where e.team_id in (select id from public.teams where created_by = auth.uid())
       or e.team_id in (select team_id from public.players where user_id = auth.uid())
  ));

create policy "Players can set own event attendance" on public.event_attendance for insert
  with check (player_id in (select id from public.players where user_id = auth.uid()));

create policy "Players can update own event attendance" on public.event_attendance for update
  using (player_id in (select id from public.players where user_id = auth.uid()));

-- Event tasks: coach full CRUD
create policy "Coach can manage event tasks" on public.event_tasks for all
  using (event_id in (
    select e.id from public.events e
    join public.teams t on t.id = e.team_id where t.created_by = auth.uid()
  ))
  with check (event_id in (
    select e.id from public.events e
    join public.teams t on t.id = e.team_id where t.created_by = auth.uid()
  ));

-- Event tasks: players can view and claim unassigned tasks
create policy "Players can view event tasks" on public.event_tasks for select
  using (event_id in (
    select e.id from public.events e
    where e.team_id in (select id from public.teams where created_by = auth.uid())
       or e.team_id in (select team_id from public.players where user_id = auth.uid())
  ));

create policy "Players can claim event tasks" on public.event_tasks for update
  using (
    assigned_to is null
    and event_id in (
      select e.id from public.events e
      where e.team_id in (select team_id from public.players where user_id = auth.uid())
    )
  );

-- Updated_at trigger for events
create trigger on_events_updated before update on public.events
  for each row execute function public.handle_updated_at();
