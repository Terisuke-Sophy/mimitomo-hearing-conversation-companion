
export enum AppView {
  HEARING_AID = 'HEARING_AID',
  CONVERSATION = 'CONVERSATION',
  REMINDERS = 'REMINDERS',
  MEMORIES = 'MEMORIES',
  PROFILE = 'PROFILE', // New view for user profile
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  time: string; // Using string for simplicity in demo
  color: string;
  is_completed: boolean;
}

export interface Memory {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  uploaded_by?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// New enum for profile item categories
export enum ProfileInfoCategory {
  FAMILY = '家族',
  HOBBY = '趣味や好きなこと',
  MEMORY = '思い出',
  OTHER = 'その他',
}

// New interface for a single piece of user profile information
export interface ProfileInfoItem {
  id: string;
  category: ProfileInfoCategory;
  name: string; // "項目名" - e.g., 'さくら', '釣り', '桜の木'
  details: string; // "詳細内容" - e.g., '一人娘', '若い頃は漁師を...'
}

// Updated User interface
export interface User {
  id: string;
  display_name: string;
  gender: '男性' | '女性' | 'その他' | '無回答';
  dob: string; // Date of birth, e.g., '1945-01-15'
  profile_items: ProfileInfoItem[];
}
