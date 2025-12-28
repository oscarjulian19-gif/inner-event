'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '@/app/strategy/page.module.css';
import NavBar from '@/components/NavBar';
import { useModuleTheme } from '@/lib/hooks/useModuleTheme';
import PrismaAvatar from '@/components/PrismaAvatar';

type Props = {
    data: {
        completedInitiatives: any[];
        stalledInitiatives: any[];
        atRiskInitiatives: any[];
        recentWins: any[];
        totalInitiatives: number;
    }
};

export default function AnalyticsClient({ data }: Props) {
    const { dict } = useLanguage();
    const theme = useModuleTheme();

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <PrismaAvatar size={50} />
                    <h1 className={styles.header} style={{
                        background: `linear-gradient(to right, #333, ${theme.color})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 0
                    }}>Tu amigo PRAGMA</h1>
                </div>
                <NavBar />
            </div>

            {/* Greeting */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'start', marginBottom: '2rem', borderLeft: `5px solid ${theme.color}` }}>
                <PrismaAvatar size={80} emotion="happy" />
                <div style={{ flex: 1 }}>
                    <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>¡Hola! Soy PRAGMA. 🤖</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'hsl(var(--text-muted))' }}>
                        He estado analizando los datos de tu estrategia. Aquí tienes mi reporte narrativo sobre cómo le está yendo a tu equipo.
                        Convertí los números fríos en una historia para ti.
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                        <a href="/analytics/metrics" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            📊 Ver Analítica Avanzada
                        </a>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* 1. Qué hemos logrado */}
                <StoryCard
                    title="Qué hemos logrado"
                    icon="🏆"
                    color="var(--success)"
                    items={data.completedInitiatives}
                    emptyMsg="Aún estamos trabajando en las primeras victorias. ¡Ánimo!"
                    renderItem={(item: any) => (
                        <span key={item.id}>Completamos la iniciativa <strong>{item.title}</strong> al 100%.</span>
                    )}
                />

                {/* 2. Qué aprendimos */}
                <StoryCard
                    title="Qué aprendimos"
                    icon="💡"
                    color="var(--accent)"
                    items={data.stalledInitiatives}
                    emptyMsg="Todo fluye muy bien. No detecto bloqueos mayores por ahora."
                    renderItem={(item: any) => (
                        <span key={item.id}>La iniciativa <strong>{item.title}</strong> parece estancada. Quizás la estrategia necesita un ajuste.</span>
                    )}
                />

                {/* 3. Qué está en riesgo */}
                <StoryCard
                    title="Qué está en riesgo"
                    icon="⚠️"
                    color="var(--warning)"
                    items={data.atRiskInitiatives}
                    emptyMsg="¡Excelente! No veo riesgos inminentes en el horizonte."
                    renderItem={(item: any) => (
                        <span key={item.id}>Atención con <strong>{item.title}</strong>, su progreso es bajo para el tiempo transcurrido.</span>
                    )}
                />

                {/* 4. Qué celebramos */}
                <StoryCard
                    title="Qué celebramos"
                    icon="🎉"
                    color="#FFD700" // Gold
                    items={data.recentWins} // Could be same as completed or high impact
                    emptyMsg="Pronto tendremos grandes hitos para celebrar."
                    renderItem={(item: any) => (
                        <span key={item.id}>¡Celebramos el avance del <strong>{item.progress}%</strong> en <strong>{item.title}</strong>!</span>
                    )}
                />

            </div>

            {/* Recommendations */}
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(240,240,255,0.9))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <PrismaAvatar size={40} emotion="thinking" />
                    <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Mis Recomendaciones</h3>
                </div>

                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {data.atRiskInitiatives.length > 0 ? (
                        <li>🚨 Revisa el estado de <strong>{data.atRiskInitiatives[0].title}</strong>. Considera asignar más recursos o dividir la tarea.</li>
                    ) : (
                        <li>✅ Mantén el ritmo actual. La ejecución es sólida.</li>
                    )}

                    {data.stalledInitiatives.length > 0 && (
                        <li>🤔 Hablemos sobre <strong>{data.stalledInitiatives[0].title}</strong>. ¿Es un "Zombie Project"? Si no aporta valor, es mejor detenerlo (Kill).</li>
                    )}

                    <li>📊 Revisa los OKRs trimestrales la próxima semana para asegurar alineación.</li>
                </ul>
            </div>
        </div>
    );
}

function StoryCard({ title, icon, color, items, renderItem, emptyMsg }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: `4px solid ${color}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span> {title}
            </h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                {items.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{emptyMsg}</p>
                ) : (
                    items.slice(0, 3).map((item: any) => (
                        <div key={item.id} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px', borderLeft: `3px solid ${color}`, fontSize: '0.95rem' }}>
                            {renderItem(item)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
