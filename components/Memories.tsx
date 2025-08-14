
import React, { useState, useEffect } from 'react';
import { Memory } from '../types';
import { CloseIcon, TrashIcon, EditIcon, PlusIcon } from './icons';
import { memoryService } from '../services/supabaseClient';

// 現在のユーザーID（実際のアプリでは認証から取得）
const CURRENT_USER_ID = '5bd4b36e-6867-41d1-8f95-1a334dd9064e';

// フォールバック用のモックデータ
const mockMemories: Memory[] = [
  { id: '1', user_id: '12345', image_url: 'https://picsum.photos/id/1018/500/500', caption: '孫のゆうとと山登りに行った時の写真。良い天気だった。', created_at: '2023-05-10' },
  { id: '2', user_id: '12345', image_url: 'https://picsum.photos/id/1043/500/500', caption: 'みおちゃんの七五三。着物がよく似合っていた。', created_at: '2023-11-15' },
  { id: '3', user_id: '12345', image_url: 'https://picsum.photos/id/218/500/500', caption: '昔住んでいた港町の風景。懐かしい。', created_at: '2023-01-20' },
  { id: '4', user_id: '12345', image_url: 'https://picsum.photos/id/30/500/500', caption: '妻と一緒に植えた庭の桜が満開になった。', created_at: '2023-04-05' },
  { id: '5', user_id: '12345', image_url: 'https://picsum.photos/id/431/500/500', caption: '家族みんなで集まったお正月。賑やかで楽しかったな。', created_at: '2024-01-01' },
  { id: '6', user_id: '12345', image_url: 'https://picsum.photos/id/553/500/500', caption: '近所の公園。よくここで将棋を指した。', created_at: '2022-09-30' },
];

const PhotoModal: React.FC<{ 
  memory: Memory; 
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (memory: Memory) => void;
}> = ({ memory, onClose, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(memory.caption);

  const handleSaveEdit = () => {
    onEdit({ ...memory, caption: editCaption });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(memory.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 pb-24" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4">
          <img src={memory.image_url} alt={memory.caption} className="w-full h-auto object-contain rounded-md max-h-[50vh]" />
          
          {isEditing ? (
            <div className="mt-4">
              <textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-xl resize-none"
                rows={3}
                placeholder="思い出の説明を入力してください"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg text-xl font-bold hover:bg-teal-600 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditCaption(memory.caption);
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg text-xl font-bold hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xl text-gray-800 p-2">{memory.caption}</p>
              
              {/* 閉じるボタン（横幅一杯） */}
              <button
                onClick={onClose}
                className="w-full bg-teal-500 text-white py-3 rounded-lg text-xl font-bold hover:bg-teal-600 transition-colors mt-4"
              >
                閉じる
              </button>
              
              {/* 編集・削除ボタン（右寄せ） */}
              <div className="flex justify-end gap-4 mt-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="編集"
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="削除"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-8 text-gray-800">
                この思い出を<br />
                削除しますか？
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-8 py-4 bg-gray-200 text-gray-800 rounded-full text-xl font-bold hover:bg-gray-300 transition-colors duration-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  className="px-8 py-4 bg-red-500 text-white rounded-full text-xl font-bold hover:bg-red-600 transition-colors duration-200"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 写真追加モーダル
const AddPhotoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: Omit<Memory, 'id' | 'user_id' | 'created_at'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && caption.trim()) {
      setIsUploading(true);
      try {
        console.log('Uploading image:', selectedFile.name, 'Size:', selectedFile.size);
        
        // ファイルサイズチェック（20MB制限）
        if (selectedFile.size > 20 * 1024 * 1024) {
          alert('ファイルサイズが大きすぎます。20MB以下の画像を選択してください。');
          setIsUploading(false);
          return;
        }

        // Supabase Storageに画像をアップロード
        const imageUrl = await memoryService.uploadImage(selectedFile, CURRENT_USER_ID);
        
        if (imageUrl) {
          console.log('Image uploaded successfully:', imageUrl);
          onAdd({
            image_url: imageUrl,
            caption: caption.trim()
          });
          handleClose();
        } else {
          console.error('Upload failed: No URL returned');
          alert('画像のアップロードに失敗しました。もう一度お試しください。');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        if (error instanceof Error) {
          alert(`画像のアップロードに失敗しました: ${error.message}`);
        } else {
          alert('画像のアップロードに失敗しました。もう一度お試しください。');
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCaption('');
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">新しい思い出を追加</h2>
          <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* ファイル選択 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              写真を選択
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
            />
          </div>

          {/* プレビュー */}
          {previewUrl && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                プレビュー
              </label>
              <img
                src={previewUrl}
                alt="プレビュー"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* コメント入力 */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              思い出の説明
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg resize-none"
              rows={3}
              placeholder="この写真についての思い出を書いてください"
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4 pb-2">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg text-xl font-bold hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || !caption.trim() || isUploading}
              className="flex-1 bg-teal-500 text-white py-3 rounded-lg text-xl font-bold hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'アップロード中...' : '追加'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const Memories: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 思い出データを取得
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await memoryService.getMemories(CURRENT_USER_ID);
        if (data && data.length > 0) {
          setMemories(data);
        } else {
          // データがない場合はモックデータを使用
          setMemories(mockMemories);
        }
      } catch (error) {
        console.error('Error fetching memories:', error);
        // エラーの場合はモックデータを使用
        setMemories(mockMemories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const handleAddMemory = async (newMemory: Omit<Memory, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const memory = await memoryService.saveMemory({
        user_id: CURRENT_USER_ID,
        ...newMemory
      });

      if (memory) {
        setMemories(prev => [memory, ...prev]);
      } else {
        alert('思い出の保存に失敗しました。');
      }
    } catch (error) {
      console.error('Error adding memory:', error);
      alert('思い出の保存に失敗しました。');
    }
  };

  const handleEditMemory = async (updatedMemory: Memory) => {
    try {
      const memory = await memoryService.updateMemory(updatedMemory.id, {
        caption: updatedMemory.caption
      });

      if (memory) {
        setMemories(prev => prev.map(m => m.id === updatedMemory.id ? memory : m));
        setSelectedMemory(memory);
      } else {
        alert('思い出の更新に失敗しました。');
      }
    } catch (error) {
      console.error('Error updating memory:', error);
      alert('思い出の更新に失敗しました。');
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const success = await memoryService.deleteMemory(id);
      if (success) {
        setMemories(prev => prev.filter(m => m.id !== id));
      } else {
        alert('思い出の削除に失敗しました。');
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
      alert('思い出の削除に失敗しました。');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">おもいでアルバム</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {memories.map((memory) => (
          <div key={memory.id} className="relative aspect-square cursor-pointer" onClick={() => setSelectedMemory(memory)}>
            <img src={memory.image_url} alt={memory.caption} className="w-full h-full object-cover rounded-md" />
            <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-0 transition-opacity"></div>
          </div>
        ))}
      </div>
      
      {selectedMemory && (
        <PhotoModal 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
          onDelete={handleDeleteMemory}
          onEdit={handleEditMemory}
        />
      )}
      
      <AddPhotoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMemory}
      />
      
      <div className="fixed bottom-24 right-4">
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-20 h-20 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center text-5xl hover:bg-teal-600 transition-colors"
          aria-label="新しい写真を追加"
        >
          <PlusIcon className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default Memories;
