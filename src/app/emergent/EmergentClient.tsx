'use client';

import React, { useState } from 'react';
import styles from '@/app/strategy/page.module.css';
import NavBar from '@/components/NavBar';
import { createHardChoice, createStrategicConversation } from '@/app/actions';

/*
  Emergent Strategy Elements:
  1. Hard Choices (Renuncias)
  2. Coalición Crítica (Conversaciones)
  3. Capacidades Distintivas
  4. Valor Creado (Market Success)
  5. Detector de Mutaciones
*/

export default function EmergentClient({ hardChoices, strategicConversations }) {
    const [activeTab, setActiveTab] = useState('hardChoices');
    const accentColor = 'hsl(340 100% 60%)'; // Crimson for Emergent

    const renderHardChoices = () => (
        <div className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${accentColor}` }}>
            <h2 style={{ color: 'hsl(var(--text-main))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛑 Bitácora de "Hard Choices"
            </h2>
            <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "Estrategia es renunciar". Registro de oportunidades rechazadas para mantener el foco.
            </p>

            <form action={createHardChoice} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Oportunidad Rechazada</label>
                    <input name="description" placeholder="Ej: Expansión a mercado asiático..." style={{ width: '100%' }} required />
                </div>
                <div style={{ flex: 2 }}>
                    <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Razonamiento Estratégico</label>
                    <input name="reasoning" placeholder="Por qué decimos NO ahora..." style={{ width: '100%' }} required />
                </div>
                <button type="submit" className="btn-primary" style={{ background: accentColor, height: '42px' }}>Registrar</button>
            </form>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {hardChoices.map((hc: any) => (
                    <div key={hc.id} style={{ padding: '1rem', background: 'hsl(var(--bg-app))', borderRadius: '8px', borderLeft: '2px solid var(--text-muted)' }}>
                        <div style={{ fontWeight: 'bold', color: 'hsl(var(--text-main))' }}>{hc.description}</div>
                        <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>{hc.reasoning}</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>{new Date(hc.date).toLocaleDateString()}</div>
                    </div>
                ))}
                {hardChoices.length === 0 && <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center' }}>No hay renuncias registradas aún.</div>}
            </div>
        </div>
    );

    const renderCoalition = () => (
        <div className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${accentColor}` }}>
            <h2 style={{ color: 'hsl(var(--text-main))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🧠 Panel de "Coalición Crítica"
            </h2>
            <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem' }}>
                La mente de la organización. Documentación de conversaciones estratégicas clave.
            </p>

            <form action={createStrategicConversation} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Tema de Conversación</label>
                    <input name="topic" placeholder="Ej: Cambio en modelo de precios..." style={{ width: '100%' }} required />
                </div>
                <div style={{ flex: 2 }}>
                    <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Conclusión / Insight</label>
                    <input name="conclusion" placeholder="A qué llegamos..." style={{ width: '100%' }} required />
                </div>
                <button type="submit" className="btn-primary" style={{ background: accentColor, height: '42px' }}>Guardar</button>
            </form>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {strategicConversations.map((sc: any) => (
                    <div key={sc.id} style={{ padding: '1rem', background: 'hsl(var(--bg-app))', borderRadius: '8px', borderLeft: `2px solid ${accentColor}` }}>
                        <div style={{ fontWeight: 'bold', color: 'hsl(var(--text-main))' }}>{sc.topic}</div>
                        <div style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>{sc.conclusion}</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>{new Date(sc.date).toLocaleDateString()}</div>
                    </div>
                ))}
                {strategicConversations.length === 0 && <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center' }}>Sin conversaciones registradas.</div>}
            </div>
        </div>
    );

    const renderPlaceholders = (title: string, desc: string) => (
        <div className="glass-panel" style={{ padding: '2rem', borderTop: `4px solid ${accentColor}`, opacity: 0.8 }}>
            <h2 style={{ color: 'hsl(var(--text-main))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {title}
            </h2>
            <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '1.5rem' }}>
                {desc}
            </p>
            <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed hsl(var(--border-glass))', borderRadius: '8px' }}>
                Coming Soon in Phase 2
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.header} style={{
                    color: accentColor,
                    marginBottom: 0
                }}>Estrategia Emergente</h1>
                <NavBar />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {[
                    { id: 'hardChoices', label: 'Hard Choices' },
                    { id: 'coalition', label: 'Coalición Crítica' },
                    { id: 'capabilities', label: 'Capacidades' },
                    { id: 'value', label: 'Valor Creado' },
                    { id: 'mutations', label: 'Mutaciones' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: activeTab === tab.id ? accentColor : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'hsl(var(--text-muted))',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'hardChoices' && renderHardChoices()}
            {activeTab === 'coalition' && renderCoalition()}
            {activeTab === 'capabilities' && renderPlaceholders('🧩 Visualizador de Capacidades', 'Inventario dinámico de activos y habilidades reales.')}
            {activeTab === 'value' && renderPlaceholders('💎 Métrica de Valor Creado', 'Éxito del choque con el mercado.')}
            {activeTab === 'mutations' && renderPlaceholders('🧬 Detector de Mutaciones', 'Feed de resultados inesperados.')}

            {/* AI Guide Section */}
            <div className="glass-panel" style={{
                marginTop: '3rem',
                padding: '1.5rem',
                background: 'linear-gradient(145deg, hsl(var(--bg-surface)), #fdf2f8)',
                border: `1px solid ${accentColor}`
            }}>
                <h3 style={{ color: accentColor, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🤖 GUÍA IA: Consultor de Estrategia Emergente
                </h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, fontSize: '0.95rem', color: 'hsl(var(--text-main))', lineHeight: '1.6' }}>
                        <p><strong>Sugerencia Activa:</strong></p>
                        {activeTab === 'hardChoices' && "He notado que las renuncias están muy enfocadas en producto. ¿Has considerado renuncias en segmentos de clientes?"}
                        {activeTab === 'coalition' && "La última conversación sobre precios no tuvo conclusión clara. Sugiero retomarla en el próximo ritual."}
                        {activeTab === 'capabilities' && "Revisa si la 'Velocidad de Entrega' es realmente una capacidad distintiva o solo un deseo."}
                        {activeTab === 'value' && "¿Cómo estás midiendo el valor más allá del revenue? Considera métricas de retención o NPS."}
                        {activeTab === 'mutations' && "Mantén los ojos abiertos a usos no esperados de tu producto por parte de los 'early adopters'."}
                    </div>
                </div>
            </div>

        </div>
    );
}
