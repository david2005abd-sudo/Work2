-- Seed AI models
insert into public.ai_models (slug, name, provider, description, context_window, is_enabled, is_free, supports_streaming, supports_vision, sort_order)
values
  ('deepseek-chat', 'DeepSeek Chat', 'deepseek', 'نموذج DeepSeek السريع للمحادثات اليومية.', 64000, true, true, true, false, 1),
  ('deepseek-reasoner', 'DeepSeek Reasoner', 'deepseek', 'نموذج التفكير العميق للمسائل المعقدة.', 64000, true, true, true, false, 2),
  ('gpt-4o-mini', 'GPT-4o Mini', 'openai', 'نموذج OpenAI الاقتصادي والسريع.', 128000, true, true, true, true, 3),
  ('gemini-1.5-flash', 'Gemini 1.5 Flash', 'gemini', 'نموذج Google السريع.', 1000000, true, true, true, true, 4)
on conflict (slug) do nothing;
