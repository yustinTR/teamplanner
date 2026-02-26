-- Exercises & training plans feature

-- Enums
create type public.exercise_category as enum (
  'warming_up', 'passing', 'positiespel', 'verdedigen', 'aanvallen', 'conditie', 'afwerken'
);

create type public.exercise_difficulty as enum (
  'basis', 'gemiddeld', 'gevorderd'
);

-- Global exercises library
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category public.exercise_category not null,
  difficulty public.exercise_difficulty not null default 'gemiddeld',
  team_types text[],
  min_players int,
  max_players int,
  duration_minutes int not null,
  setup_instructions text,
  variations text,
  video_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_exercises_category on public.exercises(category);
create index idx_exercises_is_published on public.exercises(is_published);

-- Team-specific training plans
create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  title text not null,
  notes text,
  total_duration_minutes int,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_training_plans_team_id on public.training_plans(team_id);

-- Join table: exercises within a training plan (ordered)
create table public.training_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.training_plans(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  sort_order int not null,
  unique (plan_id, sort_order)
);
create index idx_training_plan_exercises_plan_id on public.training_plan_exercises(plan_id);

-- RLS
alter table public.exercises enable row level security;
alter table public.training_plans enable row level security;
alter table public.training_plan_exercises enable row level security;

-- Exercises: all authenticated users can read published exercises
create policy "Authenticated users can view published exercises" on public.exercises for select
  using (is_published = true);

-- Training plans: coach full CRUD
create policy "Coach can manage training plans" on public.training_plans for all
  using (team_id in (select id from public.teams where created_by = auth.uid()))
  with check (team_id in (select id from public.teams where created_by = auth.uid()));

-- Training plans: players can view
create policy "Players can view training plans" on public.training_plans for select
  using (
    team_id in (select id from public.teams where created_by = auth.uid())
    or team_id in (select team_id from public.players where user_id = auth.uid())
  );

-- Training plan exercises: coach full CRUD (via plan → team)
create policy "Coach can manage training plan exercises" on public.training_plan_exercises for all
  using (plan_id in (
    select tp.id from public.training_plans tp
    join public.teams t on t.id = tp.team_id where t.created_by = auth.uid()
  ))
  with check (plan_id in (
    select tp.id from public.training_plans tp
    join public.teams t on t.id = tp.team_id where t.created_by = auth.uid()
  ));

-- Training plan exercises: players can view
create policy "Players can view training plan exercises" on public.training_plan_exercises for select
  using (plan_id in (
    select tp.id from public.training_plans tp
    where tp.team_id in (select id from public.teams where created_by = auth.uid())
       or tp.team_id in (select team_id from public.players where user_id = auth.uid())
  ));

-- Updated_at triggers
create trigger on_exercises_updated before update on public.exercises
  for each row execute function public.handle_updated_at();

create trigger on_training_plans_updated before update on public.training_plans
  for each row execute function public.handle_updated_at();
