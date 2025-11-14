export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export type AppStatus = 'idle' | 'listening' | 'processing' | 'speaking';

export type AiProvider = 'lm-studio' | 'ollama' | 'jan' | 'custom';

export interface Settings {
    provider: AiProvider;
    url: string;
}
