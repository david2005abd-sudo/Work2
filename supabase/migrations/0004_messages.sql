create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null,
  model text,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  metadata jsonb not null default '{}'::jsonb,
  client_message_id text,
  status text not null default 'complete' check (status in ('pending','complete','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_length check (char_length(content) between 1 and 32000)
);

create unique index if not exists messages_client_id_unique
  on public.messages (conversation_id, client_message_id)
  where client_message_id is not null;
