import { Message } from '../types';

/**
 * Sends a prompt and conversation history to a local AI model API.
 * @param apiUrl - The URL of the local AI server's completions endpoint.
 * @param prompt - The user's latest prompt.
 * @param history - The preceding conversation history.
 * @returns The AI's response text.
 */
export const getGemmaResponse = async (apiUrl: string, prompt: string, history: Message[]): Promise<string> => {
  const systemMessage = {
    role: "system",
    content: "You are a helpful and concise AI assistant. Your primary language for conversation is Arabic. Answer questions, provide summaries, and perform translations as requested."
  };

  const messages = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "local-model", // This is a placeholder, the local server uses its loaded model
        messages: [systemMessage, ...messages, { role: 'user', content: prompt }],
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Body:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
        throw new Error("Invalid response structure from the local AI API");
    }

    return content.trim();

  } catch (error) {
    console.error(`Error communicating with the local AI model at ${apiUrl}:`, error);
    throw error;
  }
};