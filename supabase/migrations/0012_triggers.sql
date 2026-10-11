-- Generic updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

drop trigger if exists trg_messages_updated_at on public.messages;
create trigger trg_messages_updated_at
  before update on public.messages
  for each row execute function public.set_updated_at();

drop trigger if exists trg_ai_models_updated_at on public.ai_models;
create trigger trg_ai_models_updated_at
  before update on public.ai_models
  for each row execute function public.set_updated_at();

drop trigger if exists trg_api_keys_updated_at on public.api_keys;
create trigger trg_api_keys_updated_at
  before update on public.api_keys
  for each row execute function public.set_updated_at();

drop trigger if exists trg_contact_updated_at on public.contact_messages;
create trigger trg_contact_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();

-- Create profile on new auth user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_username text;
  candidate text;
  n int := 0;
begin
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(coalesce(new.email, 'user'), '@', 1)
  );
  base_username := regexp_replace(lower(base_username), '[^a-z0-9_]', '', 'g');
  if char_length(base_username) < 3 then
    base_username := 'user';
  end if;
  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    n := n + 1;
    candidate := base_username || n::text;
    if n > 1000 then
      candidate := base_username || '_' || substr(new.id::text, 1, 6);
      exit;
    end if;
  end loop;

  insert into public.profiles (id, email, full_name, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    candidate,
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.notifications (user_id, title, body, type, action_url)
  values (
    new.id,
    'مرحبًا بك في Nados AI!',
    'ابدأ محادثتك الأولى الآن واستكشف ميزات المنصة.',
    'welcome',
    '/chat/new'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Increment conversation message count + update last_message_at
create or replace function public.handle_new_message()
returns trigger language plpgsql as $$
begin
  if new.role <> 'system' then
    update public.conversations
    set message_count = message_count + 1,
        last_message_at = new.created_at
    where id = new.conversation_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_after_message_insert on public.messages;
create trigger trg_after_message_insert
  after insert on public.messages
  for each row execute function public.handle_new_message();

-- Decrement on delete
create or replace function public.handle_message_delete()
returns trigger language plpgsql as $$
begin
  if old.role <> 'system' then
    update public.conversations
    set message_count = greatest(message_count - 1, 0)
    where id = old.conversation_id;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_after_message_delete on public.messages;
create trigger trg_after_message_delete
  after delete on public.messages
  for each row execute function public.handle_message_delete();
