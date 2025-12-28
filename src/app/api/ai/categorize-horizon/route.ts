import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { description } = await request.json();

        if (!description) {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }

        // Mock AI Logic
        // In a real app, this would call OpenAI or Gemini API
        let horizon = 'H1';
        let justification = 'This initiative seems to be related to core business improvements and immediate results.';

        const lowerDesc = description.toLowerCase();

        if (lowerDesc.includes('experiment') || lowerDesc.includes('pilot') || lowerDesc.includes('new market')) {
            horizon = 'H2';
            justification = 'Clasificado como H2 (Emergente) porque implica explorar nuevas oportunidades o escalar modelos de negocio emergentes.';
        } else if (lowerDesc.includes('research') || lowerDesc.includes('moonshot') || lowerDesc.includes('disrupt')) {
            horizon = 'H3';
            justification = 'Clasificado como H3 (Futuro) porque se enfoca en innovación a largo plazo y capacidades disruptivas.';
        } else {
            justification = 'Clasificado como H1 (Core) porque parece relacionarse con mejoras del negocio actual y resultados inmediatos.';
        }

        return NextResponse.json({
            horizon,
            justification,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
