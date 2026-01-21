import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const res = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: "Di OK"
});

console.log(res.text);
