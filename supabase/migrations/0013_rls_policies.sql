-- Enable RLS on all user tables
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.ai_models enable row level security;
alter table public.usage_records enable row level security;
alter table public.notifications enable row level security;
alter table public.api_keys enable row level security;
alter table public.contact_messages enable row level security;
alter table public.audit_logs enable row level security;

-- Helper: is_admin
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','owner')
  );
$$;

-- Helper: owns_conversation
create or replace function public.owns_conversation(conv_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.conversations
    where id = conv_id and user_id = auth.uid()
  );
$$;

-- ─── profiles ─────────────────────────────────────────────
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (
    public.is_admin()
    or (
      auth.uid() = id
      -- Users cannot escalate their own role/plan
      and role = (select role from public.profiles where id = auth.uid())
      and plan = (select plan from public.profiles where id = auth.uid())
    )
  );

create policy "profiles_delete_admin_only"
  on public.profiles for delete
  using (public.is_admin());

-- ─── conversations ────────────────────────────────────────
create policy "conv_select_own_or_admin"
  on public.conversations for select
  using (auth.uid() = user_id or public.is_admin());

create policy "conv_insert_own"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "conv_update_own_or_admin"
  on public.conversations for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "conv_delete_own_or_admin"
  on public.conversations for delete
  using (auth.uid() = user_id or public.is_admin());

-- ─── messages ─────────────────────────────────────────────
create policy "msg_select_own_or_admin"
  on public.messages for select
  using (auth.uid() = user_id or public.is_admin());

create policy "msg_insert_own_conversation"
  on public.messages for insert
  with check (auth.uid() = user_id and public.owns_conversation(conversation_id));

create policy "msg_update_own"
  on public.messages for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "msg_delete_own_or_admin"
  on public.messages for delete
  using (auth.uid() = user_id or public.is_admin());

-- ─── ai_models ────────────────────────────────────────────
create policy "ai_models_select_enabled_or_admin"
  on public.ai_models for select
  using (is_enabled = true or public.is_admin());

create policy "ai_models_admin_insert"
  on public.ai_models for insert
  with check (public.is_admin());

create policy "ai_models_admin_update"
  on public.ai_models for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "ai_models_admin_delete"
  on public.ai_models for delete
  using (public.is_admin());

-- ─── usage_records ────────────────────────────────────────
create policy "usage_select_own_or_admin"
  on public.usage_records for select
  using (auth.uid() = user_id or public.is_admin());

create policy "usage_insert_own"
  on public.usage_records for insert
  with check (auth.uid() = user_id);

create policy "usage_admin_update"
  on public.usage_records for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "usage_admin_delete"
  on public.usage_records for delete
  using (public.is_admin());

-- ─── notifications ────────────────────────────────────────
create policy "notif_select_own_or_admin"
  on public.notifications for select
  using (auth.uid() = user_id or public.is_admin());

create policy "notif_insert_own"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "notif_update_own"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notif_delete_own_or_admin"
  on public.notifications for delete
  using (auth.uid() = user_id or public.is_admin());

-- ─── api_keys ─────────────────────────────────────────────
create policy "api_keys_select_own_or_admin"
  on public.api_keys for select
  using (auth.uid() = user_id or public.is_admin());

create policy "api_keys_insert_own"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "api_keys_update_own"
  on public.api_keys for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "api_keys_delete_own"
  on public.api_keys for delete
  using (auth.uid() = user_id);

-- ─── contact_messages ─────────────────────────────────────
create policy "contact_insert_anyone"
  on public.contact_messages for insert
  with check (true);

create policy "contact_select_admin"
  on public.contact_messages for select
  using (public.is_admin());

create policy "contact_update_admin"
  on public.contact_messages for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_delete_admin"
  on public.contact_messages for delete
  using (public.is_admin());

-- ─── audit_logs ───────────────────────────────────────────
create policy "audit_select_admin"
  on public.audit_logs for select
  using (public.is_admin());

-- Service role handles writes; no client insert/update/delete policies.
