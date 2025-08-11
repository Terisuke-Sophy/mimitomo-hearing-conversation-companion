import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  "https://gdrcbryqmzxlegbegpbl.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmNicnlxbXp4bGVnYmVncGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzQ1NDksImV4cCI6MjA3MDQ1MDU0OX0.nmU5ZmmP8z7pHW4hcxxa2GGHnAzOnueBBvTyI7u-F20";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is not set. The application will run in offline mode with mock data.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// チャットメッセージ関連のサービス関数
export const chatService = {
  // チャットメッセージを取得
  async getMessages(userId: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }

    return data || [];
  },

  // チャットメッセージを保存
  async saveMessage(userId: string, role: "user" | "model", text: string) {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        role,
        text,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving chat message:", error);
      return null;
    }

    return data;
  },

  // チャットメッセージを削除
  async deleteMessages(userId: string) {
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting chat messages:", error);
      return false;
    }

    return true;
  },
};

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
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          text?: string;
          created_at?: string;
        };
      };
    };
  };
}
