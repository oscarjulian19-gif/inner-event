'use client';

import React, { useState } from 'react';
import styles from '@/app/strategy/page.module.css';

export default function AIReportGenerator() {
    const [selectedModules, setSelectedModules] = useState<string[]>(['strategy']);
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState<string | null>(null);

    const modules = ['strategy', 'capacities', 'rituals', 'analytics', 'emergent'];

    const toggleModule = (mod: string) => {
        if (mod === 'all') {
            setSelectedModules(modules);
        } else {
            if (selectedModules.includes(mod)) {
                setSelectedModules(selectedModules.filter(m => m !== mod));
            } else {
                setSelectedModules([...selectedModules, mod]);
            }
        }
    };

    const handleGenerate = async () => {
        if (selectedModules.length === 0) return;
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setReport(`
## Informe Ejecutivo Integrado
*Módulos analizados: ${selectedModules.join(', ').toUpperCase()}*

### Resumen Holístico
La correlación entre la ejecución estratégica y la capacidad de los equipos muestra una mejora del 12%. Los rituales de seguimiento han aumentado la visibilidad de los "hard choices" necesarios en la estrategia emergente.

### Hallazgos por Módulo
${selectedModules.map(m => `
#### ${m.toUpperCase()}
*   Se identificaron 3 nuevos patrones de éxito.
*   Riesgo moderado en la adopción de nuevas herramientas.
`).join('')}

### Recomendaciones IA
1.  **Sinergia:** Cruzar los datos de *rituals* con *capacities* para detectar sobrecarga cognitiva.
2.  **Acción Inmediata:** Aprobar las renuncias pendientes en el módulo emergente.
            `);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ color: 'hsl(var(--text-main))', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤖 Generador de Informes Inteligentes
            </h2>
            <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem' }}>
                Selecciona los módulos para un análisis cruzado integral.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => toggleModule('all')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid hsl(var(--primary))',
                        background: 'hsl(var(--bg-app))',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Todos
                </button>
                {modules.map((mod) => {
                    const isSelected = selectedModules.includes(mod);
                    return (
                        <button
                            key={mod}
                            onClick={() => toggleModule(mod)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                border: isSelected ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border-glass))',
                                background: isSelected ? 'hsl(var(--primary))' : 'transparent',
                                color: isSelected ? 'white' : 'hsl(var(--text-muted))',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s'
                            }}
                        >
                            {mod}
                        </button>
                    );
                })}
            </div>

            <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={isGenerating || selectedModules.length === 0}
                style={{
                    width: '100%',
                    maxWidth: '300px',
                    background: 'hsl(var(--bg-app))',
                    color: 'white',
                    border: '1px solid hsl(var(--border-glass))',
                    cursor: isGenerating ? 'wait' : 'pointer'
                }}
            >
                {isGenerating ? 'Analizando Datos Cruzados...' : 'Generar Informe Ejecutivo'}
            </button>

            {report && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'hsl(var(--bg-surface))', borderRadius: '8px', borderLeft: '4px solid hsl(var(--accent))' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
                        <button className="btn-secondary" onClick={() => alert('Descargando PDF...')} style={{ fontSize: '0.8rem' }}>📥 Descargar PDF</button>
                        <button className="btn-secondary" onClick={() => alert('Enviado a correo asociado.')} style={{ fontSize: '0.8rem' }}>📧 Enviar por Correo</button>
                    </div>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'hsl(var(--text-main))', lineHeight: '1.6' }}>
                        {report}
                    </pre>
                </div>
            )}
        </div>
    );
}
