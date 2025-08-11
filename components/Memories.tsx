
import React, { useState } from 'react';
import { Memory } from '../types';

const mockMemories: Memory[] = [
  { id: '1', user_id: '12345', image_url: 'https://picsum.photos/id/1018/500/500', caption: '孫のゆうとと山登りに行った時の写真。良い天気だった。', created_at: '2023-05-10' },
  { id: '2', user_id: '12345', image_url: 'https://picsum.photos/id/1043/500/500', caption: 'みおちゃんの七五三。着物がよく似合っていた。', created_at: '2023-11-15' },
  { id: '3', user_id: '12345', image_url: 'https://picsum.photos/id/218/500/500', caption: '昔住んでいた港町の風景。懐かしい。', created_at: '2023-01-20' },
  { id: '4', user_id: '12345', image_url: 'https://picsum.photos/id/30/500/500', caption: '妻と一緒に植えた庭の桜が満開になった。', created_at: '2023-04-05' },
  { id: '5', user_id: '12345', image_url: 'https://picsum.photos/id/431/500/500', caption: '家族みんなで集まったお正月。賑やかで楽しかったな。', created_at: '2024-01-01' },
  { id: '6', user_id: '12345', image_url: 'https://picsum.photos/id/553/500/500', caption: '近所の公園。よくここで将棋を指した。', created_at: '2022-09-30' },
];

const PhotoModal: React.FC<{ memory: Memory; onClose: () => void }> = ({ memory, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white p-4 rounded-lg max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
      <img src={memory.image_url} alt={memory.caption} className="w-full h-auto object-contain rounded-md max-h-[70vh]" />
      <p className="text-xl text-gray-800 mt-4 p-2">{memory.caption}</p>
      <button 
        onClick={onClose} 
        className="mt-4 w-full bg-teal-500 text-white py-3 rounded-lg text-xl font-bold hover:bg-teal-600 transition-colors">
        閉じる
      </button>
    </div>
  </div>
);


const Memories: React.FC = () => {
  const [memories] = useState<Memory[]>(mockMemories);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleUploadClick = () => {
    // This is a placeholder for the hackathon. A real implementation
    // would open a file picker and upload to Supabase storage.
    alert("写真のアップロード機能は現在開発中です。");
  };

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
      {selectedMemory && <PhotoModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />}
      
      <div className="fixed bottom-24 right-4">
        <button 
          onClick={handleUploadClick}
          className="w-20 h-20 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center text-5xl hover:bg-teal-600 transition-colors"
          aria-label="新しい写真を追加"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Memories;
