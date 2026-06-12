create extension if not exists pgcrypto;

create table if not exists public.admin_accounts (
  username text primary key,
  role text not null check (role in ('admin', 'user')),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  owner_username text not null references public.admin_accounts(username) on delete cascade,
  type text not null check (type in ('meal', 'poop', 'vomit', 'sleep')),
  record_date date not null,
  record_time text not null,
  meal_slot text check (meal_slot is null or meal_slot in ('breakfast', 'lunch', 'dinner', 'night')),
  amount text,
  food text,
  poop_type text,
  status text,
  note text,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists health_records_owner_date_idx
  on public.health_records(owner_username, record_date desc, record_time desc);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  role text,
  tags text[] not null default '{}',
  href text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  status text not null default 'active',
  href text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_news_items (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  title text not null,
  summary text not null,
  tag text,
  href text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  provider text not null,
  category text not null,
  status text not null default 'planned',
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integration_call_logs (
  id uuid primary key default gen_random_uuid(),
  integration_slug text not null,
  actor_username text,
  status text not null,
  request_meta jsonb not null default '{}',
  response_meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_username text,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.admin_accounts enable row level security;
alter table public.health_records enable row level security;
alter table public.projects enable row level security;
alter table public.tools enable row level security;
alter table public.commerce_news_items enable row level security;
alter table public.integrations enable row level security;
alter table public.integration_call_logs enable row level security;
alter table public.admin_audit_logs enable row level security;

grant usage on schema public to service_role;
grant all privileges on table public.admin_accounts to service_role;
grant all privileges on table public.health_records to service_role;
grant all privileges on table public.projects to service_role;
grant all privileges on table public.tools to service_role;
grant all privileges on table public.commerce_news_items to service_role;
grant all privileges on table public.integrations to service_role;
grant all privileges on table public.integration_call_logs to service_role;
grant all privileges on table public.admin_audit_logs to service_role;

grant usage on schema public to anon, authenticated;
grant select on table public.projects to anon, authenticated;
grant select on table public.tools to anon, authenticated;
grant select on table public.commerce_news_items to anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Public projects are readable') then
    create policy "Public projects are readable" on public.projects for select using (published = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'tools' and policyname = 'Active tools are readable') then
    create policy "Active tools are readable" on public.tools for select using (status = 'active');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'commerce_news_items' and policyname = 'News items are readable') then
    create policy "News items are readable" on public.commerce_news_items for select using (true);
  end if;
end $$;
