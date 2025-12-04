import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

// Initialize the AI client
// Note: In a real production app, you might proxy this through a backend to hide the key,
// but for this demo per instructions, we use process.env.API_KEY directly.
const getAiClient = () => {
  const apiKey = "AIzaSyBlZmibAHUxnMcwxXJqYS2GqmjhDlRCI8c";
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat session", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    return "I'm having trouble connecting to my AI brain right now. Please check your API Key configuration.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Sorry, I encountered a scratch in the record. Can you say that again?";
  }
};
