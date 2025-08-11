// Web Speech API type definitions for TypeScript
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Reminder } from '../types';
import { extractReminderFromText } from '../services/geminiService';
import { PlusIcon, TrashIcon, CloseIcon, MicrophoneIcon, StopIcon, CheckIcon } from './icons';

// Mock data as Supabase is commented out
const initialReminders: Reminder[] = [
  { id: '1', user_id: '12345', title: '朝のお薬', time: '08:00', color: 'bg-red-300', is_completed: true },
  { id: '2', user_id: '12345', title: '軽い散歩', time: '10:00', color: 'bg-green-300', is_completed: false },
  { id: '3', user_id: '12345', title: '昼のお薬', time: '12:30', color: 'bg-red-300', is_completed: false },
  { id: '4', user_id: '12345', title: 'お孫さんと電話', time: '15:00', color: 'bg-blue-300', is_completed: false },
  { id: '5', user_id: '12345', title: '夜のお薬', time: '19:00', color: 'bg-red-300', is_completed: false },
];

const ReminderItem: React.FC<{ reminder: Reminder; onToggle: (id: string) => void; onDelete: (id: string) => void; }> = ({ reminder, onToggle, onDelete }) => (
  <div
    onClick={() => onToggle(reminder.id)}
    className={`flex items-center p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
      reminder.is_completed ? 'bg-gray-200 text-gray-500 opacity-80' : 'bg-white'
    }`}
  >
    <div className={`w-4 h-16 rounded-l-lg ${reminder.color} mr-4`}></div>
    <div className="flex-grow">
      <p className="text-2xl font-bold">{reminder.title}</p>
      <p className="text-xl text-gray-600">{reminder.time}</p>
    </div>
     <div
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors mr-2 flex-shrink-0 ${
        reminder.is_completed ? 'bg-green-500' : 'border-2 border-gray-400 bg-white'
      }`}
    >
      {reminder.is_completed && <CheckIcon className="w-6 h-6 text-white" />}
    </div>
    <button onClick={(e) => { e.stopPropagation(); onDelete(reminder.id); }} className="p-2 rounded-full hover:bg-gray-300 transition-colors flex-shrink-0" aria-label={`${reminder.title}を削除`}>
      <TrashIcon className="w-8 h-8 text-gray-500" />
    </button>
  </div>
);

const AddReminderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onReminderAdd: (newReminder: Reminder) => void;
}> = ({ isOpen, onClose, onReminderAdd }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('マイクボタンを押して予定を話してください。');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef<string>('');

  const handleAdd = useCallback(async (transcript: string) => {
    if (!transcript) return;
    setIsLoading(true);
    setStatus('AIが予定を整理しています...');
    try {
      const { title, time } = await extractReminderFromText(transcript);
      const newReminder: Reminder = {
        id: Date.now().toString(),
        user_id: '12345',
        title,
        time,
        color: 'bg-yellow-300',
        is_completed: false,
      };
      onReminderAdd(newReminder);
      onClose();
    } catch (error) {
      console.error(error);
      setStatus('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [onClose, onReminderAdd]);

  useEffect(() => {
    if (!isOpen) {
        setIsLoading(false);
        setIsListening(false);
        setStatus('マイクボタンを押して予定を話してください。');
        return;
    };
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setStatus('お使いのブラウザは音声認識に対応していません。');
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setStatus(`「${finalTranscriptRef.current}${interimTranscript}」`);

      speechTimeoutRef.current = window.setTimeout(() => {
        recognition.stop();
      }, 1500);
    };
    
    recognition.onend = () => {
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      const finalText = finalTranscriptRef.current.trim();
      if(finalText) {
          handleAdd(finalText);
      }
      finalTranscriptRef.current = '';
      setIsListening(false);
      if(!isLoading) setStatus('マイクボタンを押して予定を話してください。');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
       if (event.error === 'no-speech') {
        setStatus('音声が聞き取れませんでした。もう一度お試しください。');
      } else {
        setStatus('マイクでエラーが発生しました。');
      }
      setIsListening(false);
      finalTranscriptRef.current = '';
    };

    return () => {
        if(recognitionRef.current) recognitionRef.current.stop();
        if(speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, [isOpen, handleAdd, isLoading]);

  const toggleListening = () => {
    if (isLoading) return;
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        finalTranscriptRef.current = '';
        recognitionRef.current?.start();
        setIsListening(true);
        setStatus('聞き取っています...');
      } catch (e) {
        console.error(e);
        setStatus('マイクの開始に失敗しました。');
      }
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-2xl">
        <div className="flex justify-end mb-2">
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="戻る">
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">音声で予定を追加</h2>
        <p className="text-gray-600 text-xl mb-6 min-h-[56px] flex items-center justify-center break-words">{status}</p>
        <button
            onClick={toggleListening}
            disabled={isLoading}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-500 text-white'
            } ${isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            aria-label={isListening ? "停止" : "聞き取り開始"}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                </div>
            ) : isListening ? (
                <StopIcon className="w-12 h-12" />
            ) : (
                <MicrophoneIcon className="w-12 h-12" />
            )}
        </button>
      </div>
    </div>
  );
};


const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleToggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, is_completed: !r.is_completed } : r
      )
    );
  };

  const handleAddReminder = (newReminder: Reminder) => {
    setReminders(prev => {
        const newState = [...prev, newReminder];
        // Sort by time, putting '時刻未設定' at the end
        newState.sort((a, b) => {
            if (a.time === '時刻未設定' && b.time !== '時刻未設定') return 1;
            if (a.time !== '時刻未設定' && b.time === '時刻未設定') return -1;
            if (a.time === '時刻未設定' && b.time === '時刻未設定') return 0;
            return a.time.localeCompare(b.time);
        });
        return newState;
    });
  };
  
  const handleDeleteReminder = (id: string) => {
      if (window.confirm("この予定を削除してもよろしいですか？")) {
          setReminders(prev => prev.filter(r => r.id !== id));
      }
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">今日の予定</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-bold rounded-full hover:bg-teal-600 transition-colors shadow-md">
            <PlusIcon className="w-6 h-6" />
            <span>新しい予定</span>
        </button>
      </div>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <ReminderItem key={reminder.id} reminder={reminder} onToggle={handleToggleReminder} onDelete={handleDeleteReminder}/>
        ))}
      </div>
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReminderAdd={handleAddReminder}
      />
    </div>
  );
};

export default Reminders;