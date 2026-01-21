import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("WARN: GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Wrapper to maintain compatibility with existing generateContent calls if possible,
// or we might need to update the callers.
// The new SDK uses `ai.models.generateContent({ model: '...', contents: '...' })`.
// The old SDK returned a `GenerativeModel` object with a `generateContent` method.
// We will export an object that mimics the old behavior for minimal refactoring,
// or just export the client and update calls.
// Let's try to export a helper that mimics the 'model' object currently used.

export const model = {
    generateContent: async (prompt: string) => {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp", // Trying the experimental flash model as requested
            contents: { role: 'user', parts: [{ text: prompt }] } // Check new SDK input format
        });

        // Map response to match old structure: result.response.text()
        return {
            response: {
                text: () => response.text || ""
            }
        };
    }
};

export const jsonModel = {
    generateContent: async (prompt: string) => {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json"
            }
        });

        return {
            response: {
                text: () => response.text || "{}"
            }
        };
    }
};

// Also export the raw client if needed
export const genAI = ai;
