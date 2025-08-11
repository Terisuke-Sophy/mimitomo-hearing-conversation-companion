
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gdrcbryqmzxlegbegpbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmNicnlxbXp4bGVnYmVncGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzQ1NDksImV4cCI6MjA3MDQ1MDU0OX0.nmU5ZmmP8z7pHW4hcxxa2GGHnAzOnueBBvTyI7u-F20';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is not set. The application will run in offline mode with mock data.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          gender: string;
          dob: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          display_name: string;
          gender: string;
          dob: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          gender?: string;
          dob?: string;
          created_at?: string;
        };
      };
      profile_items: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          name: string;
          details: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          name: string;
          details: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          name?: string;
          details?: string;
          created_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          time: string;
          is_completed: boolean;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          time: string;
          is_completed?: boolean;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          time?: string;
          is_completed?: boolean;
          color?: string;
          created_at?: string;
        };
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          image_url: string | null;
          caption: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url?: string | null;
          caption: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string | null;
          caption?: string;
          created_at?: string;
        };
      };
    };
  };
}
