import React, { useState, useEffect, useRef } from 'react';
import { Message, AppStatus } from './types';
import { useVoiceProcessor } from './hooks/useVoiceProcessor';
import { getGemmaResponse } from './services/localAiService';
import { useSettings } from './hooks/useSettings';
import ChatBubble from './components/ChatBubble';
import MicrophoneButton from './components/MicrophoneButton';
import IntroCard from './components/IntroCard';
import SettingsModal from './components/SettingsModal';

const SettingsIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, saveSettings } = useSettings();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    startListening,
    stopListening,
    speak,
    transcript,
    isListening,
  } = useVoiceProcessor({
    onListenStart: () => setStatus('listening'),
    onListenStop: (finalTranscript: string) => {
      if (finalTranscript) {
        setMessages((prev) => [...prev, { sender: 'user', text: finalTranscript }]);
      }
      setStatus('processing');
    },
    onSpeakStart: () => setStatus('speaking'),
    onSpeakEnd: () => setStatus('idle'),
  });
  
  // Handle new user message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      const processRequest = async () => {
        setError(null);
        try {
          const aiResponseText = await getGemmaResponse(settings.url, lastMessage.text, messages.slice(0, -1));
          setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
          speak(aiResponseText);
        } catch (err) {
          const errorMessage = `Failed to connect to your local AI model at ${settings.url}. Please ensure the server is running and check your configuration in the settings panel.`;
          setError(errorMessage);
          setMessages((prev) => [...prev, { sender: 'ai', text: `عفواً، حدث خطأ. ${errorMessage}` }]);
          setStatus('idle');
        }
      };
      processRequest();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, speak, settings.url]);
  
  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMicClick = () => {
    if (status === 'listening') {
      stopListening();
    } else if (status === 'idle') {
      startListening();
    }
  };

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col font-sans">
      <header className="p-4 flex items-center justify-between border-b border-gray-700">
        <div className="w-6"></div> {/* Spacer */}
        <div className="text-center">
            <h1 className="text-2xl font-bold text-teal-400">Gemma Arabic Voice Assistant</h1>
            <p className="text-sm text-gray-400">Powered by Local AI</p>
        </div>
        <SettingsIcon onClick={() => setIsSettingsOpen(true)} />
      </header>
      
      {!isSupported && (
          <div className="m-4 p-4 bg-red-800 text-white rounded-lg text-center">
              Your browser does not support the Web Speech API. Please use Google Chrome or another supported browser.
          </div>
      )}

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        {messages.length === 0 && <IntroCard />}
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isListening && transcript && (
          <div className="text-center text-gray-400 italic animate-pulse">
            {transcript}...
          </div>
        )}
      </main>
      
      {error && (
        <div className="px-4 pb-2 text-center text-red-400 text-xs">
          {error}
        </div>
      )}

      <footer className="p-4 flex flex-col items-center justify-center sticky bottom-0 bg-gray-900">
        <MicrophoneButton status={status} onClick={handleMicClick} disabled={!isSupported} />
        <p className="text-xs text-gray-500 mt-3">
          Click the microphone to start speaking.
        </p>
      </footer>
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={(newSettings) => {
            saveSettings(newSettings);
            setIsSettingsOpen(false);
        }}
      />
    </div>
  );
};

export default App;