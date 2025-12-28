import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Mock AI OKR Generation
        // In real app, call LLM with prompt
        const objectives = [
            {
                statement: `Lograr liderazgo en ${prompt}`,
                keyResults: [
                    { statement: "Aumentar cuota de mercado", targetValue: 20, metricUnit: "%" },
                    { statement: "Reducir churn", targetValue: 5, metricUnit: "%" }
                ]
            }
        ];

        return NextResponse.json({ objectives });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
