import { GoogleGenAI } from '@google/genai';

// Validate API key exists (server-side only)
function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not set. ' +
      'Get a free API key from https://aistudio.google.com/ and add it to .env.local'
    );
  }
  return apiKey;
}

// Get the configured model name
export function getModelName(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

// Get the File Search Store name (if configured)
export function getFileSearchStore(): string | undefined {
  return process.env.GEMINI_FILE_SEARCH_STORE || undefined;
}

// Create and export Gemini client (lazy initialization)
let _client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return _client;
}
