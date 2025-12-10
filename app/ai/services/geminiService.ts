// Adapted for Next.js Client Side
// Original imports removed to prevent client-side secrets leakage
// import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

// We will use the Next.js API route to proxy requests to Gemini
// This keeps the API Key secure on the server.

export const sendMessageToGemini = async (text: string): Promise<string> => {
  try {
    const response = await fetch('/api/genai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }), // Note: Simple API for now. To support history, we need to update the API.
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("응답을 받아오는 데 실패했습니다.");
  }
};

export const resetChatSession = () => {
  // In a stateless API route, we effectively reset by just clearing client state.
  // Advanced: Call API to clear server-side session if it existed.
  console.log("Chat session reset (Client side)");
};
