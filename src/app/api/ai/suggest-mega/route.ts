import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
    try {
        const { purpose, areaPurpose } = await req.json();

        const prompt = `
            Act as an expert Strategy Consultant.
            Based on the following Company Purpose: "${purpose}"
            ${areaPurpose ? `And Area Purpose: "${areaPurpose}"` : ''}
            
            Suggest ONE strategic "Mega" (Big Hairy Audacious Goal or a major yearly strategic pillar).
            It should be ambitious, concrete, and inspiring.
            Output ONLY the statement text, nothing else. No quotes.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return NextResponse.json({ suggestion: text });
    } catch (error) {
        console.error("Mega Suggestion Error:", error);
        return NextResponse.json({ error: 'Failed to suggest Mega' }, { status: 500 });
    }
}
