
import React, { useState, useCallback, useEffect } from 'react';
import { User, ProfileInfoItem, ProfileInfoCategory } from '../types';
import { EditIcon, TrashIcon, PlusIcon, CloseIcon, UserIcon } from './icons';
import { userService, profileItemService } from '../services/supabaseClient';

// デフォルトユーザーID（実際のアプリでは認証から取得）
const DEFAULT_USER_ID = '5bd4b36e-6867-41d1-8f95-1a334dd9064e';

// デフォルトユーザーデータ
const defaultUser: User = {
  id: DEFAULT_USER_ID,
  display_name: '田中 克己',
  gender: '男性',
  dob: '1945-03-10',
  profile_items: [],
};

// --- Sub-components for Modals ---

const BasicInfoEditModal: React.FC<{
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onClose: () => void;
}> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    display_name: user.display_name,
    gender: user.gender,
    dob: user.dob,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">基本情報の編集</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="閉じる">
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg font-semibold text-gray-600 block mb-1">お名前</label>
            <input type="text" name="display_name" value={formData.display_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-xl" />
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-600 block mb-1">性別</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-xl bg-white">
              <option>男性</option>
              <option>女性</option>
              <option>その他</option>
              <option>無回答</option>
            </select>
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-600 block mb-1">生年月日</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-xl" />
          </div>
          <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-lg text-xl font-bold hover:bg-teal-600 transition-colors mt-6">
            保存する
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfileEditModal: React.FC<{
  item?: ProfileInfoItem;
  onSave: (item: ProfileInfoItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<ProfileInfoItem, 'id'>>(
    item || {
      category: ProfileInfoCategory.FAMILY,
      name: '',
      details: '',
    }
  );

  const getLabelForName = (category: ProfileInfoCategory) => {
    switch (category) {
      case ProfileInfoCategory.FAMILY:
      case ProfileInfoCategory.HOBBY:
        return '名前';
      case ProfileInfoCategory.MEMORY:
        return 'タイトル';
      default:
        return '項目名';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(`${getLabelForName(formData.category)}を入力してください。`);
      return;
    }
    const finalItem: ProfileInfoItem = {
      id: item?.id || Date.now().toString(),
      ...formData,
    };
    onSave(finalItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{item ? '情報の編集' : '新しい情報を追加'}</h2>
                 <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="閉じる">
                    <CloseIcon className="w-8 h-8" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-lg font-semibold text-gray-600 block mb-1">情報の種類</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-xl bg-white">
                        {Object.values(ProfileInfoCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-lg font-semibold text-gray-600 block mb-1">{getLabelForName(formData.category)}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg text-xl" />
                </div>
                 <div>
                    <label className="text-lg font-semibold text-gray-600 block mb-1">詳細内容</label>
                    <textarea name="details" value={formData.details} onChange={handleChange} rows={4} className="w-full p-3 border border-gray-300 rounded-lg text-xl"></textarea>
                </div>
                <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-lg text-xl font-bold hover:bg-teal-600 transition-colors mt-6">
                    {item ? '更新する' : '追加する'}
                </button>
            </form>
        </div>
    </div>
  )
}


// --- Main Profile Component ---

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [editingItem, setEditingItem] = useState<ProfileInfoItem | undefined | null>(undefined); // null for new, undefined for closed

  const fetchUser = async () => {
    const fetchedUser = await userService.getUser(DEFAULT_USER_ID);
    if (fetchedUser) {
      setUser(prev => ({ 
        ...prev, 
        id: fetchedUser.id,
        display_name: fetchedUser.display_name,
        gender: fetchedUser.gender,
        dob: fetchedUser.dob
      }));
    }
  };

  const fetchProfileItems = async () => {
    const items = await profileItemService.getProfileItems(DEFAULT_USER_ID);
    const convertedItems: ProfileInfoItem[] = items.map(item => ({
      id: item.id,
      category: item.category as ProfileInfoCategory,
      name: item.name,
      details: item.details
    }));
    setUser(prev => ({ ...prev, profile_items: convertedItems }));
  };

  useEffect(() => {
    fetchUser();
    fetchProfileItems();
  }, []);

  const handleSaveBasicInfo = async (updatedData: Partial<User>) => {
    await userService.updateUser(user.id, updatedData);
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const handleSaveProfileItem = async (item: ProfileInfoItem) => {
    if (item.id) {
      // 既存アイテムの更新
      await profileItemService.updateProfileItem(item.id, item);
      // ローカル状態を直接更新（順序を保持）
      setUser(prev => ({
        ...prev,
        profile_items: prev.profile_items.map(existingItem => 
          existingItem.id === item.id ? item : existingItem
        )
      }));
    } else {
      // 新規アイテムの追加
      const savedItem = await profileItemService.saveProfileItem({
        user_id: user.id,
        category: item.category,
        name: item.name,
        details: item.details
      });
      if (savedItem) {
        const newItem: ProfileInfoItem = {
          id: savedItem.id,
          category: savedItem.category as ProfileInfoCategory,
          name: savedItem.name,
          details: savedItem.details
        };
        // 新規アイテムを最後に追加
        setUser(prev => ({
          ...prev,
          profile_items: [...prev.profile_items, newItem]
        }));
      }
    }
  };

  const handleDeleteProfileItem = async (id: string) => {
    if(window.confirm("この情報を削除してもよろしいですか？")) {
        const success = await profileItemService.deleteProfileItem(id);
        if (success) {
          // ローカル状態から削除（順序を保持）
          setUser(prev => ({
            ...prev,
            profile_items: prev.profile_items.filter(item => item.id !== id)
          }));
        }
    }
  };

  const renderProfileItems = useCallback((category: ProfileInfoCategory) => {
    return user.profile_items
      .filter(item => item.category === category)
      .map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-start gap-4">
          <div className="flex-grow">
            <h4 className="text-xl font-bold">{item.name}</h4>
            <p className="text-lg text-gray-600 whitespace-pre-wrap">{item.details}</p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button onClick={() => setEditingItem(item)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label={`${item.name}を編集`}>
              <EditIcon className="w-7 h-7 text-gray-500" />
            </button>
            <button onClick={() => handleDeleteProfileItem(item.id)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label={`${item.name}を削除`}>
              <TrashIcon className="w-7 h-7 text-red-500" />
            </button>
          </div>
        </div>
      ));
  }, [user]);

  return (
    <div className="p-4 pb-24 space-y-6">
        <h1 className="flex items-center justify-center gap-3 text-2xl font-bold text-center text-gray-700">
            <UserIcon className="w-8 h-8" />
            <span>あなたの情報</span>
        </h1>

        {/* Basic Info Section */}
        <div className="bg-sky-100 p-4 rounded-xl shadow-lg">
            <div className="flex justify-end items-center mb-3">
                <button onClick={() => setIsEditingBasic(true)} className="flex items-center gap-2 px-3 py-1 bg-white border border-teal-500 text-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-colors text-lg">
                    <EditIcon className="w-5 h-5" />
                    <span>編集</span>
                </button>
            </div>
            <div className="space-y-2 text-xl">
                <p><span className="font-semibold w-24 inline-block">お名前:</span> {user.display_name}</p>
                <p><span className="font-semibold w-24 inline-block">性別:</span> {user.gender}</p>
                <p><span className="font-semibold w-24 inline-block">生年月日:</span> {user.dob}</p>
            </div>
        </div>
      
        {/* Detailed Info Sections */}
        {Object.values(ProfileInfoCategory).map(category => {
          const items = user.profile_items.filter(item => item.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="p-4 rounded-xl">
              <h3 className="text-xl font-bold text-teal-700 mb-3">{category}</h3>
              <div className="space-y-4">
                {renderProfileItems(category)}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center pt-4">
            <button onClick={() => setEditingItem(null)} className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-600 transition-colors shadow-lg text-xl">
                <PlusIcon className="w-7 h-7" />
                <span>新しい情報を追加</span>
            </button>
        </div>

        {isEditingBasic && <BasicInfoEditModal user={user} onSave={handleSaveBasicInfo} onClose={() => setIsEditingBasic(false)} />}
        {editingItem !== undefined && <ProfileEditModal item={editingItem || undefined} onSave={handleSaveProfileItem} onClose={() => setEditingItem(undefined)} />}
    </div>
  );
};

export default Profile;