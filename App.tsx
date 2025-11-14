
import React, { useState, useEffect, useRef } from 'react';
import { Message, AppStatus } from './types';
import { useVoiceProcessor } from './hooks/useVoiceProcessor';
import { getGemmaResponse } from './services/lmStudioService';
import ChatBubble from './components/ChatBubble';
import MicrophoneButton from './components/MicrophoneButton';
import IntroCard from './components/IntroCard';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    startListening,
    stopListening,
    speak,
    transcript,
    isListening,
    isSpeaking,
    isSupported,
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
          const aiResponseText = await getGemmaResponse(lastMessage.text, messages.slice(0, -1));
          setMessages((prev) => [...prev, { sender: 'ai', text: aiResponseText }]);
          speak(aiResponseText);
        } catch (err) {
          const errorMessage = 'Failed to connect to LM Studio. Please ensure it is running and accessible at http://localhost:1234. CORS might need to be enabled.';
          setError(errorMessage);
          setMessages((prev) => [...prev, { sender: 'ai', text: `عفواً، حدث خطأ. ${errorMessage}` }]);
          setStatus('idle');
        }
      };
      processRequest();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, speak]);
  
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

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col font-sans">
      <header className="p-4 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-teal-400">Gemma Arabic Voice Assistant</h1>
        <p className="text-sm text-gray-400">Powered by Local LM Studio</p>
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
    </div>
  );
};

export default App;
