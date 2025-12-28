import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text, type } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Mock AI Logic (Heuristic for demo)
        let suggestion = text;
        let reasoning = "Looks good!";

        if (text.length < 10) {
            suggestion = `${text} (Detalla más el impacto)`;
            reasoning = "El texto es muy breve. Agrega más contexto o especifica el resultado esperado.";
        } else if (text.toLowerCase().includes("ventas") || text.toLowerCase().includes("sales")) {
            suggestion = `Aumentar el ARR en un 20% mediante optimización de ${text}`;
            reasoning = "Para ventas, intenta cuantificar el crecimiento (ej. % o $).";
        } else if (type === 'objective' && !text.includes('%')) {
            suggestion = `${text} medible con indicadores clave (KPIs)`;
            reasoning = "Los objetivos deben ser inspiradores pero orientados a resultados. ¿Cómo medirás el éxito?";
        } else if (type === 'keyResult' && !/\d/.test(text)) {
            suggestion = `Lograr 100% de ${text}`;
            reasoning = "Un Resultado Clave (KR) necesita un número o métrica para ser rastreable.";
        } else if (text.toLowerCase().startsWith("hacer") || text.toLowerCase().startsWith("crear")) {
            suggestion = `Implementar estrategia de ${text.replace(/^(hacer|crear)\s*/i, '')} para escalar impacto`;
            reasoning = "Usa verbos de acción más estratégicos como 'Implementar', 'Optimizar', 'Escalar'.";
        } else if (type === 'ritual_consultant') {
            // Context comes in 'text' field as a JSON-like string or just text
            suggestion = `📌 Temas sugeridos para el Ritual:
1. Revisión de KRs en rojo (<50%).
2. Obstáculos del equipo para el Objetivo X.
3. Celebración de logros en Objetivo Y.
4. Ajuste de cargas de trabajo.`;
            reasoning = "Basado en el progreso actual (KRs bajos y logros recientes). La IA sugiere priorizar desbloqueos.";
        } else {
            suggestion = `Optimizar: ${text}`;
            reasoning = "Sugerencia general: Asegura que el texto esté orientado a la acción y el impacto.";
        }

        // Simulate network delay for "Thinking" effect
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({ suggestion, reasoning });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
