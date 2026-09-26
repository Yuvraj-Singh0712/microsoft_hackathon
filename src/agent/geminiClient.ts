import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;
let currentApiKey: string = '';

export function initializeGeminiClient(apiKey?: string): GoogleGenAI | null {
  const keyToUse = apiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined) || currentApiKey;
  if (!keyToUse) {
    return null;
  }
  currentApiKey = keyToUse;
  try {
    cachedClient = new GoogleGenAI({ apiKey: keyToUse });
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Google GenAI client:', err);
    return null;
  }
}

export function setApiKey(apiKey: string) {
  currentApiKey = apiKey;
  initializeGeminiClient(apiKey);
}

export function getActiveApiKey(): string {
  return currentApiKey;
}

export async function callGeminiIfAvailable(
  prompt: string,
  systemInstruction?: string
): Promise<string | null> {
  const client = cachedClient || initializeGeminiClient();
  if (!client) {
    return null;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: systemInstruction
        ? {
            systemInstruction,
            temperature: 0.2,
          }
        : undefined,
    });

    return response.text || null;
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local grounded reasoning engine:', err);
    return null;
  }
}
