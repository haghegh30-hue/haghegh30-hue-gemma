
import { Message } from '../types';

const LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions";

/**
 * Sends a prompt and conversation history to the LM Studio API.
 * @param prompt - The user's latest prompt.
 * @param history - The preceding conversation history.
 * @returns The AI's response text.
 */
export const getGemmaResponse = async (prompt: string, history: Message[]): Promise<string> => {
  const systemMessage = {
    role: "system",
    content: "You are a helpful and concise AI assistant. Your primary language for conversation is Arabic. Answer questions, provide summaries, and perform translations as requested."
  };

  const messages = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));

  try {
    const response = await fetch(LM_STUDIO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "local-model", // This is a placeholder, LM Studio uses the loaded model
        messages: [systemMessage, ...messages, { role: 'user', content: prompt }],
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
        throw new Error("Invalid response structure from LM Studio API");
    }

    return content.trim();

  } catch (error) {
    console.error("Error communicating with LM Studio:", error);
    throw error;
  }
};
