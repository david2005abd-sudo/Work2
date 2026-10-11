create table if not exists public.ai_models (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  provider text not null,
  description text,
  context_window integer not null default 8192,
  is_enabled boolean not null default true,
  is_free boolean not null default true,
  supports_streaming boolean not null default true,
  supports_vision boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
