// Web Speech API type definitions for TypeScript
// These interfaces are based on the W3C spec and common browser implementations.
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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generateAiResponse } from '../services/geminiService';
import { chatService } from '../services/supabaseClient';
import { ChatMessage, ProfileInfoCategory, User } from '../types';
import { MicrophoneIcon, SendIcon, SpeakerOffIcon, SpeakerOnIcon, StopIcon } from './icons';

// Mock user data as Supabase is commented out, updated to new structure
const mockUser: User = {
  id: '5bd4b36e-6867-41d1-8f95-1a334dd9064e', // 実際のユーザーIDを使用
  display_name: '田中さん',
  gender: '男性',
  dob: '1945-03-10',
  profile_items: [
    { id: 'p1', category: ProfileInfoCategory.FAMILY, name: 'さくら', details: '一人娘。近くに住んでいる。' },
    { id: 'p2', category: ProfileInfoCategory.FAMILY, name: 'ゆうと', details: '小学3年生の孫。サッカーが好き。' },
    { id: 'p3', category: ProfileInfoCategory.FAMILY, name: 'みお', details: '5歳の孫。絵を描くのが得意。' },
    { id: 'p4', category: ProfileInfoCategory.FAMILY, name: 'よしえ', details: '2年前に死別した妻。' },
    { id: 'p5', category: ProfileInfoCategory.HOBBY, name: '釣り', details: '若い頃は漁師をしていたので、今でも時々、港へ釣りに行くのが楽しみ。' },
    { id: 'p6', category: ProfileInfoCategory.MEMORY, name: '桜の木', details: '亡き妻よしえと一緒に庭で育てていた桜の木が宝物。' },
    { id: 'p7', category: ProfileInfoCategory.OTHER, name: 'なめろう', details: '妻よしえがよく作ってくれたアジのなめろうが好物。' },
  ],
};

const formatUserProfileForAI = (user: User): string => {
  let context = `ユーザーの基本情報:\n- 名前: ${user.display_name}\n- 性別: ${user.gender}\n- 生年月日: ${user.dob}\n\n`;
  
  const categories = Object.values(ProfileInfoCategory);
  for (const category of categories) {
    const items = user.profile_items.filter(item => item.category === category);
    if (items.length > 0) {
      context += `${category}について:\n`;
      items.forEach(item => {
        context += `- ${item.name}: ${item.details}\n`;
      });
      context += '\n';
    }
  }
  return context.trim();
};

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string>('');
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [currentUser] = useState<User>(mockUser);
  const [isInitialized, setIsInitialized] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef<string>('');

  // 初期化時にチャットメッセージを読み込む
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await chatService.getMessages(currentUser.id);
        const formattedMessages: ChatMessage[] = savedMessages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'model',
          text: msg.text
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadMessages();
  }, [currentUser.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!isSpeakerOn) return;
    window.speechSynthesis.cancel();
    // Add a prepended space to give the synthesis engine a moment to warm up
    const utterance = new SpeechSynthesisUtterance("　" + text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [isSpeakerOn]);

  const handleSend = useCallback(async (text: string) => {
    const messageText = text.trim();
    if (!messageText) return;

    // ユーザーメッセージを保存
    const savedUserMessage = await chatService.saveMessage(currentUser.id, 'user', messageText);
    if (!savedUserMessage) {
      console.error('Failed to save user message');
      return;
    }

    const newUserMessage: ChatMessage = {
      id: savedUserMessage.id,
      role: 'user',
      text: messageText
    };

    setMessages(prev => [...prev, newUserMessage]);

    const history = messages.map(msg => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.text }]
    }));
    
    const userContextString = formatUserProfileForAI(currentUser);

    setInputValue('');
    setIsLoading(true);

    try {
      const aiText = await generateAiResponse(messageText, history, userContextString);
      
      // AIメッセージを保存
      const savedAiMessage = await chatService.saveMessage(currentUser.id, 'model', aiText);
      if (savedAiMessage) {
        const newAiMessage: ChatMessage = {
          id: savedAiMessage.id,
          role: 'model',
          text: aiText
        };
        setMessages(prev => [...prev, newAiMessage]);
        speak(aiText);
      }
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { 
        id: Date.now().toString(), 
        role: 'model', 
        text: 'エラーが発生しました。' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [speak, currentUser, messages]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setMicError("お使いのブラウザは音声認識に対応していません。");
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;

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
        setInputValue(finalTranscriptRef.current + interimTranscript);

        speechTimeoutRef.current = window.setTimeout(() => {
            recognition.stop();
        }, 1500);
    };
    
    recognition.onend = () => {
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        
        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
            handleSend(finalText);
        }
        
        finalTranscriptRef.current = '';
        setIsListening(false);
        if(!finalText) setInputValue(''); // Clear partial input if nothing was sent
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
            setMicError('音声が聞き取れませんでした。もう一度お試しください。');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicError('マイクへのアクセスが許可されていません。');
        } else {
            setMicError('マイクでエラーが発生しました。');
        }
        setIsListening(false);
        finalTranscriptRef.current = '';
    };
    
    recognitionRef.current = recognition;
    
    return () => {
        if(recognitionRef.current) recognitionRef.current.stop();
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        window.speechSynthesis.cancel();
    };
  }, [handleSend]);
  
  const handleToggleListening = () => {
    setMicError('');
    if (isListening) {
        recognitionRef.current?.stop();
    } else {
        setInputValue('');
        finalTranscriptRef.current = '';
        try {
          recognitionRef.current?.start();
          setIsListening(true);
        } catch(error) {
          console.error("Error starting speech recognition:", error);
          setMicError('マイクの開始に失敗しました。');
          setIsListening(false);
        }
    }
  };
  
  const handleToggleSpeaker = () => {
    const newSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(newSpeakerState);
    if (!newSpeakerState) {
      window.speechSynthesis.cancel();
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSend(inputValue);
  };

  // 初期化中はローディング表示
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-center mb-4 relative px-12">
          <h1 className="text-2xl font-bold text-center text-gray-700">おはなし、質問モード</h1>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            </div>
            <p className="text-xl">メッセージを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-center mb-4 relative px-12">
        <h1 className="text-2xl font-bold text-center text-gray-700">おはなし、質問モード</h1>
        <button
          onClick={handleToggleSpeaker}
          className={`absolute right-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 ${
            isSpeakerOn ? 'bg-green-500 hover:bg-green-600' : 'bg-pink-400 hover:bg-pink-500'
          }`}
          aria-label={isSpeakerOn ? "スピーカーをオフにする" : "スピーカーをオンにする"}
        >
          {isSpeakerOn 
            ? <SpeakerOnIcon className="w-7 h-7 text-white" /> 
            : <SpeakerOffIcon className="w-7 h-7 text-white" />
          }
        </button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-6 p-4 bg-white rounded-lg shadow-inner">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-2xl font-medium">
                こんにちは！<br />マイクのボタンを押して、<br/>話してください
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">ひ</div>}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-gray-200 text-gray-800 text-lg rounded-br-none'
                : 'bg-green-500 text-white text-2xl rounded-bl-none'
            }`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
             <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">ひ</div>
            <div className="bg-green-500/50 text-gray-800 rounded-2xl rounded-bl-none p-3">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      {micError && (
        <p className="text-center text-red-500 text-lg my-2" role="alert">
          {micError}
        </p>
      )}

      <form onSubmit={onFormSubmit} className={`flex items-center gap-2 p-2 bg-white rounded-full shadow-md ${micError ? 'mt-0' : 'mt-4'}`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isListening ? 'お話しください…' : 'メッセージを入力…'}
          className="w-full bg-transparent border-none focus:ring-0 text-xl p-2"
          disabled={isLoading || isListening}
        />
        <button
            type="button"
            onClick={handleToggleListening}
            disabled={isLoading}
            className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'
            }`}
            aria-label={isListening ? '停止' : 'マイク'}
        >
            {isListening ? <StopIcon className="w-8 h-8"/> : <MicrophoneIcon className="w-8 h-8"/>}
        </button>
        <button
          type="submit"
          disabled={isLoading || !inputValue}
          className="w-14 h-14 flex items-center justify-center bg-teal-500 text-white rounded-full disabled:bg-gray-300 transition-colors"
          aria-label="送信"
        >
          <SendIcon className="w-8 h-8"/>
        </button>
      </form>
    </div>
  );
};

export default Conversation;
