import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceProcessorOptions {
  onListenStart?: () => void;
  onListenStop?: (finalTranscript: string) => void;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

// FIX: Cast window to `any` to access non-standard SpeechRecognition APIs, which are not part of the default Window type.
// Renamed from SpeechRecognition to SpeechRecognitionApi to avoid shadowing the global type name.
const SpeechRecognitionApi =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSupported = !!SpeechRecognitionApi;

export const useVoiceProcessor = (options: VoiceProcessorOptions = {}) => {
  const { onListenStart, onListenStop, onSpeakStart, onSpeakEnd } = options;
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // FIX: Using `any` type for the ref because the `SpeechRecognition` type is not available
  // in the global scope and was causing a name collision.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!isSupported) {
      console.error("Speech Recognition is not supported by this browser.");
      return;
    }
    
    // FIX: Use the renamed API constant to create a new instance.
    const recognition = new SpeechRecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ar-SA';

    recognition.onstart = () => {
      setIsListening(true);
      onListenStart?.();
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(interimTranscript);
      if (finalTranscript.trim()) {
        onListenStop?.(finalTranscript.trim());
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (!text || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find an Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(voice => voice.lang.startsWith('ar-'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    } else {
        console.warn("No Arabic voice found, using default.");
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      onSpeakEnd?.(); // Ensure state is reset on error
    };

    window.speechSynthesis.speak(utterance);
  }, [onSpeakStart, onSpeakEnd]);

  return { isSupported, transcript, isListening, isSpeaking, startListening, stopListening, speak };
};
