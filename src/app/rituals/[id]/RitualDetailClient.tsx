'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/strategy/page.module.css';
import NavBar from '@/components/NavBar';
import { updateRitual } from '@/app/actions';
import EditableText from '@/components/EditableText';

export default function RitualDetailClient({ ritual, okrSummary }) {
    const [isThinking, setIsThinking] = useState(false);
    const [aiAdvice, setAiAdvice] = useState(ritual.aiSuggestions || null);

    const handleConsultAI = async () => {
        setIsThinking(true);
        try {
            // Mock AI Call for now (or real if endpoint exists)
            // In a real scenario, we'd pass the OKR summary to the LLM
            const res = await fetch('/api/ai/refine-text', {
                method: 'POST',
                body: JSON.stringify({ 
                    text: `Contexto: ${ritual.description}. Participantes: ${ritual.participants.length}. OKRs: ${JSON.stringify(okrSummary)}`, 
                    type: 'ritual_consultant' 
                })
            });
            const data = await res.json();
            setAiAdvice(data.suggestion);
        } catch (e) {
            console.error(e);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/rituals" style={{ fontSize: '1.5rem', textDecoration: 'none' }}>⬅️</Link>
                    <h1 className={styles.header} style={{
                        fontSize: '2rem',
                        color: 'hsl(var(--accent))',
                        marginBottom: 0
                    }}>{ritual.name}</h1>
                    <span style={{ 
                        fontSize: '1rem', 
                        padding: '0.25rem 0.75rem', 
                        background: 'hsl(var(--bg-app))', 
                        color: 'white', 
                        borderRadius: '12px',
                        border: '1px solid hsl(var(--border-glass))'
                    }}>
                        {new Date(ritual.date).toLocaleDateString()}
                    </span>
                </div>
                <NavBar />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                
                {/* Main Content: Discussion & Commitments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Discussion Points */}
                    <section className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ color: 'hsl(var(--text-main))', marginBottom: '1rem', borderBottom: '2px solid hsl(var(--accent))', paddingBottom: '0.5rem' }}>
                            🗣️ Puntos Tratados
                        </h2>
                        <EditableText 
                            initialValue={ritual.discussionPoints || ''}
                            onSave={async (val) => {
                                const formData = new FormData();
                                formData.append('discussionPoints', val);
                                // Preserve others
                                formData.append('commitments', ritual.commitments || '');
                                formData.append('aiSuggestions', aiAdvice || '');
                                await updateRitual(ritual.id, formData);
                            }}
                            multiline={true}
                            placeholder="Registra aquí los temas discutidos en la sesión..."
                            style={{ minHeight: '150px', fontSize: '1.1rem' }}
                        />
                    </section>

                    {/* Commitments */}
                    <section className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ color: 'hsl(var(--text-main))', marginBottom: '1rem', borderBottom: '2px solid hsl(var(--success))', paddingBottom: '0.5rem' }}>
                            🤝 Compromisos
                        </h2>
                        <EditableText 
                            initialValue={ritual.commitments || ''}
                            onSave={async (val) => {
                                const formData = new FormData();
                                formData.append('commitments', val);
                                formData.append('discussionPoints', ritual.discussionPoints || '');
                                formData.append('aiSuggestions', aiAdvice || '');
                                await updateRitual(ritual.id, formData);
                            }}
                            multiline={true}
                            placeholder="Acuerdos y responsables..."
                            style={{ minHeight: '150px', fontSize: '1.1rem' }}
                        />
                    </section>
                </div>

                {/* Sidebar: AI & Context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* AI Consultant */}
                    <section className="glass-panel" style={{ 
                        padding: '1.5rem', 
                        background: 'linear-gradient(145deg, hsl(var(--bg-surface)), #f0fdf4)', // Subtle upgrade
                        border: '1px solid hsl(var(--primary))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'hsl(var(--primary))', margin: 0 }}>🤖 Consultor IA</h3>
                            <button 
                                onClick={handleConsultAI}
                                disabled={isThinking}
                                style={{ 
                                    background: 'hsl(var(--primary))', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '20px', 
                                    padding: '0.25rem 0.75rem', 
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {isThinking ? 'Analizando...' : 'Analizar OKRs'}
                            </button>
                        </div>
                        
                        {aiAdvice ? (
                            <div style={{ 
                                fontSize: '0.95rem', 
                                color: 'hsl(var(--text-main))', 
                                lineHeight: '1.6', 
                                fontStyle: 'italic',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {aiAdvice}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
                                Solicita a la IA que analice el progreso actual y sugiera temas para este ritual.
                            </p>
                        )}
                    </section>

                    {/* Participants (Read Only for MVP or Edit logic later) */}
                    <section className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ color: 'hsl(var(--text-main))', marginBottom: '1rem' }}>👥 Participantes</h3>
                        {ritual.participants.length > 0 ? (
                            <ul style={{ paddingLeft: '1.2rem', color: 'hsl(var(--text-muted))' }}>
                                {ritual.participants.map((p) => (
                                    <li key={p.id}>{p.user.name} ({p.user.email})</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>Sin participantes registrados.</p>
                        )}
                         {/* Placeholder for Add Participant */}
                         <button className="btn-secondary" style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}>
                            + Gestionar Participantes
                        </button>
                    </section>

                </div>
            </div>
        </div>
    );
}
