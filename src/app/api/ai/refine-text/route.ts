import { NextResponse } from 'next/server';
import { jsonModel } from '@/lib/ai/gemini';

export async function POST(request: Request) {
    try {
        const { text, type, language } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const targetLanguage = language === 'en' ? 'English' : 'Spanish';

        const prompt = `
            Act as a Strategy Consultant using the "StrategicChoiceCascade" framework.
            Refine the following text to account for best practices in OKRs, Strategy, and Business Impact.
            
            Text Type: ${type || 'General Strategy'}
            Original Text: "${text}"
            Target Language: ${targetLanguage}
            
            1. Suggest a polished, more impactful version (must be concise, max 1 sentence).
            2. Provide a 1-sentence reasoning for the change in ${targetLanguage}.
            
            Output JSON format:
            {
                "suggestion": "string",
                "reasoning": "string"
            }
        `;

        try {
            const result = await jsonModel.generateContent(prompt);
            // Handling the wrapped response from the new helper
            // @ts-ignore
            const responseText = result.response.text();

            // Clean up potentially markdown-wrapped JSON (```json ... ```)
            const cleanedText = responseText.replace(/```json|```/g, '').trim();
            const { suggestion, reasoning } = JSON.parse(cleanedText);

            return NextResponse.json({ suggestion, reasoning });
        } catch (aiError: any) {
            console.error("AI Generation Error:", aiError);
            // Fallback
            return NextResponse.json({
                suggestion: `${text} (IA no disponible)`,
                reasoning: "No se pudo conectar con el consultor IA."
            });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
