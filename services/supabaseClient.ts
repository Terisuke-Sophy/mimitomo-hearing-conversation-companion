import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  "https://veezfeyqvdliekuswhnm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZXpmZXlxdmRsaWVrdXN3aG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4ODQ2OTMsImV4cCI6MjA3MDQ2MDY5M30.7wN_WyKRTZ_19Z5WWwfHDGVGxxdXuwIudA8eLd6znWI";

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

// ユーザー関連のサービス関数
export const userService = {
  // ユーザーを取得
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  },

  // ユーザーを更新
  async updateUser(userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data;
  },
};

// プロフィールアイテム関連のサービス関数
export const profileItemService = {
  // プロフィールアイテムを取得
  async getProfileItems(userId: string) {
    const { data, error } = await supabase
      .from("profile_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true }); // IDでもソートして順序を安定化

    if (error) {
      console.error("Error fetching profile items:", error);
      return [];
    }

    return data || [];
  },

  // プロフィールアイテムを保存
  async saveProfileItem(item: Database['public']['Tables']['profile_items']['Insert']) {
    const { data, error } = await supabase
      .from("profile_items")
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error("Error saving profile item:", error);
      return null;
    }

    return data;
  },

  // プロフィールアイテムを更新
  async updateProfileItem(id: string, updates: Partial<Database['public']['Tables']['profile_items']['Update']>) {
    const { data, error } = await supabase
      .from("profile_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile item:", error);
      return null;
    }

    return data;
  },

  // プロフィールアイテムを削除
  async deleteProfileItem(id: string) {
    const { error } = await supabase
      .from("profile_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting profile item:", error);
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
