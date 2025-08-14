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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicrophoneIcon, StopIcon, HearingIcon } from './icons';

const HearingAid: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('ボタンを押すとお話しを聞き取ります');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const userStoppedRef = useRef<boolean>(true);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      finalTranscriptRef.current = '';
      userStoppedRef.current = false;
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setStatusMessage('聞き取っています...');
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setStatusMessage('マイクの開始に失敗しました。');
        userStoppedRef.current = true;
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      userStoppedRef.current = true;
      recognitionRef.current.stop();
      // The onend handler will update the UI state.
    }
  }, []);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setStatusMessage('お使いのブラウザは音声認識に対応していません。');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      finalTranscriptRef.current += finalTranscript;
      const currentText = finalTranscriptRef.current + interimTranscript;
      setTranscript(currentText);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setTranscript('');
        finalTranscriptRef.current = '';
        if (!userStoppedRef.current) {
            setStatusMessage('聞き取っています...');
        }
      }, 20000);
    };

    recognition.onend = () => {
      // If recognition ends but we didn't ask it to stop, restart it.
      if (!userStoppedRef.current) {
        try {
          recognitionRef.current?.start();
        } catch (error) {
          console.error("Error restarting recognition:", error);
          setIsListening(false);
          setStatusMessage('エラーで再開できませんでした。');
        }
      } else {
        setIsListening(false);
        setStatusMessage('ボタンを押すとお話しを聞き取ります');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setStatusMessage('音声が検出されませんでした。');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setStatusMessage('マイクの使用が許可されていません。');
          userStoppedRef.current = true; // Permanent stop
          setIsListening(false);
        } else {
          setStatusMessage('エラーが発生しました。もう一度お試しください。');
           // Let onend handle the restart logic
        }
    };

    return () => {
      if(recognitionRef.current) {
        userStoppedRef.current = true;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // <-- Empty dependency array is critical for this to work correctly.

  // みみとも画面に入ったときに自動でマイクをONにする
  useEffect(() => {
    if (recognitionRef.current && !isListening) {
      // 少し遅延させてからマイクを開始
      const timer = setTimeout(() => {
        if (!isListening) {
          startListening();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []); // 初回のみ実行

  return (
    <div className="flex flex-col h-full p-4 bg-slate-800 text-white">
      <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-center text-white/90 mb-4">
        <HearingIcon className="w-7 h-7" />
        <span>みみとも作動中</span>
      </h1>
      <div className="flex-grow flex flex-col items-center justify-center bg-slate-900 rounded-2xl p-6 border-2 border-teal-500/50 shadow-lg shadow-teal-500/10">
        {transcript ? (
          <p className="text-5xl md:text-7xl font-bold leading-tight text-white">
            {transcript}
          </p>
        ) : (
          <p className="text-4xl font-medium leading-tight text-gray-400 text-center">
            {statusMessage}
          </p>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center justify-center w-24 h-24 rounded-full transition-colors duration-200 ${
            isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-500 hover:bg-teal-600'
          }`}
          aria-label={isListening ? '録音停止' : '録音開始'}
        >
          {isListening ? (
            <StopIcon className="w-12 h-12 text-white" />
          ) : (
            <MicrophoneIcon className="w-12 h-12 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default HearingAid;
