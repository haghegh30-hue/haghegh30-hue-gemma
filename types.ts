
export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export type AppStatus = 'idle' | 'listening' | 'processing' | 'speaking';
