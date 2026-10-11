create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  locale text not null default 'ar',
  timezone text not null default 'Asia/Baghdad',
  theme text not null default 'system' check (theme in ('light','dark','system')),
  role text not null default 'user' check (role in ('user','admin','owner')),
  is_active boolean not null default true,
  plan text not null default 'free',
  daily_message_limit integer,
  daily_token_limit integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-z0-9_]{3,32}$'),
  constraint bio_length check (bio is null or char_length(bio) <= 280)
);

comment on table public.profiles is 'User profile data linked to auth.users';
