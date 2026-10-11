-- profiles
create index if not exists idx_profiles_username on public.profiles (username);
create index if not exists idx_profiles_role on public.profiles (role) where role <> 'user';
create index if not exists idx_profiles_active on public.profiles (is_active) where is_active = true;

-- conversations
create index if not exists idx_conv_user_updated
  on public.conversations (user_id, updated_at desc) where is_archived = false;
create index if not exists idx_conv_user_archived
  on public.conversations (user_id, is_archived);
create index if not exists idx_conv_user_favorite
  on public.conversations (user_id, is_favorite) where is_favorite = true;
create index if not exists idx_conv_title_trgm
  on public.conversations using gin (title gin_trgm_ops);

-- messages
create index if not exists idx_msg_conv_created
  on public.messages (conversation_id, created_at);
create index if not exists idx_msg_user_created
  on public.messages (user_id, created_at desc);
create index if not exists idx_msg_content_trgm
  on public.messages using gin (content gin_trgm_ops);
create index if not exists idx_msg_role on public.messages (role);

-- ai_models
create index if not exists idx_ai_models_enabled
  on public.ai_models (is_enabled, sort_order);

-- usage
create index if not exists idx_usage_user_date
  on public.usage_records (user_id, created_at desc);
create index if not exists idx_usage_model on public.usage_records (model);
create index if not exists idx_usage_conv on public.usage_records (conversation_id);

-- notifications
create index if not exists idx_notif_user_unread
  on public.notifications (user_id, created_at desc) where is_read = false;
create index if not exists idx_notif_user_date
  on public.notifications (user_id, created_at desc);

-- api_keys
create index if not exists idx_api_keys_user_active
  on public.api_keys (user_id) where revoked_at is null;
create index if not exists idx_api_keys_prefix on public.api_keys (key_prefix);

-- contact
create index if not exists idx_contact_status on public.contact_messages (status, created_at desc);

-- audit
create index if not exists idx_audit_user_date on public.audit_logs (user_id, created_at desc);
create index if not exists idx_audit_action on public.audit_logs (action);
create index if not exists idx_audit_entity on public.audit_logs (entity_type, entity_id);
