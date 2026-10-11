/**
 * Hand-maintained baseline schema.
 * Regenerate with: pnpm supabase:gen-types
 * (Replaced once Supabase migrations are run.)
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'user' | 'admin' | 'owner';
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';
export type MessageStatus = 'pending' | 'complete' | 'failed';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          locale: string;
          timezone: string;
          theme: ThemeMode;
          role: UserRole;
          is_active: boolean;
          plan: string;
          daily_message_limit: number | null;
          daily_token_limit: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          model: string;
          system_prompt: string | null;
          is_archived: boolean;
          is_favorite: boolean;
          message_count: number;
          last_message_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['conversations']['Row']> & {
          user_id: string;
          title: string;
          model: string;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Row']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: MessageRole;
          content: string;
          model: string | null;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          total_tokens: number | null;
          metadata: Json;
          client_message_id: string | null;
          status: MessageStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['messages']['Row']> & {
          conversation_id: string;
          user_id: string;
          role: MessageRole;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Row']>;
      };
      ai_models: {
        Row: {
          id: string;
          slug: string;
          name: string;
          provider: string;
          description: string | null;
          context_window: number;
          is_enabled: boolean;
          is_free: boolean;
          supports_streaming: boolean;
          supports_vision: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['ai_models']['Row']> & {
          slug: string;
          name: string;
          provider: string;
        };
        Update: Partial<Database['public']['Tables']['ai_models']['Row']>;
      };
      usage_records: {
        Row: {
          id: string;
          user_id: string;
          conversation_id: string | null;
          model: string;
          provider: string;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          request_status: string;
          request_duration_ms: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['usage_records']['Row']> & {
          user_id: string;
          model: string;
        };
        Update: Partial<Database['public']['Tables']['usage_records']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string;
          action_url: string | null;
          is_read: boolean;
          metadata: Json;
          created_at: string;
          read_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & {
          user_id: string;
          title: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          scopes: string[];
          last_used_at: string | null;
          expires_at: string | null;
          revoked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['api_keys']['Row']> & {
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
        };
        Update: Partial<Database['public']['Tables']['api_keys']['Row']>;
      };
      contact_messages: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: string;
          priority: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['contact_messages']['Row']> & {
          name: string;
          email: string;
          subject: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['contact_messages']['Row']>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          ip_hash: string | null;
          user_agent: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['audit_logs']['Row']> & { action: string };
        Update: Partial<Database['public']['Tables']['audit_logs']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
