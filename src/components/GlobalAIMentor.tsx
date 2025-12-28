'use client';

import React, { useState } from 'react';
import PrismaAvatar from './PrismaAvatar';
import { useModuleTheme } from '@/lib/hooks/useModuleTheme';

export default function GlobalAIMentor({ user }: { user?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useModuleTheme();

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '1rem'
        }}>
            {/* Chat Bubble / Menu */}
            {isOpen && (
                <div className="glass-panel" style={{
                    width: '300px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <strong style={{ color: 'hsl(var(--primary))' }}>Mentor PRAGMA</strong>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                            &times;
                        </button>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-main))', marginBottom: '1rem' }}>
                        ¡Hola {user?.name?.split(' ')[0] || 'Estratega'}! Estoy aquí para asegurarme de que todos tus objetivos estén alineados.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="btn-secondary" style={btnStyle}>👀 Auditar esta página</button>
                        <button className="btn-secondary" style={btnStyle}>✍️ Ayúdame a redactar</button>
                        <button className="btn-secondary" style={btnStyle}>💡 Sugerir mejoras</button>
                    </div>
                </div>
            )}

            {/* Avatar Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'scale(1.1)' : 'scale(1)'
                }}
            >
                <div style={{

                    borderRadius: '50%',
                    padding: '5px',
                    background: 'hsl(var(--bg-app))',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    <PrismaAvatar size={60} emotion={isOpen ? 'happy' : 'neutral'} />
                </div>

                {!isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '-5px',
                        left: '-5px',
                        background: 'red',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }} />
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

const btnStyle = {
    background: 'hsl(var(--bg-app))',
    border: '1px solid hsl(var(--border-glass))',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontSize: '0.9rem',
    color: 'hsl(var(--text-main))',
    transition: 'all 0.2s'
};
