import React from 'react';

export default function PrismaAvatar({ size = 60, emotion = 'happy' }: { size?: number, emotion?: 'happy' | 'thinking' | 'excited' }) {
    const color = 'var(--primary)';

    return (
        <div style={{ width: size, height: size, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                width: '100%', height: '100%',
                borderRadius: '50%',
                background: `conic-gradient(from 0deg, ${color}, var(--accent))`,
                opacity: 0.2, position: 'absolute',
                animation: 'spin 10s linear infinite'
            }}></div>

            <div style={{
                width: '80%', height: '80%',
                borderRadius: '50%',
                background: 'white',
                border: `2px solid ${color}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                {/* Eyes */}
                <div style={{ display: 'flex', gap: size * 0.15, marginBottom: size * 0.05 }}>
                    <div style={{ width: size * 0.12, height: size * 0.15, background: '#333', borderRadius: '50%', animation: 'blink 4s infinite' }}></div>
                    <div style={{ width: size * 0.12, height: size * 0.15, background: '#333', borderRadius: '50%', animation: 'blink 4s infinite' }}></div>
                </div>

                {/* Mouth */}
                {emotion === 'happy' && (
                    <div style={{ width: size * 0.3, height: size * 0.15, borderBottom: '3px solid #333', borderRadius: '50%' }}></div>
                )}
                {emotion === 'excited' && (
                    <div style={{ width: size * 0.3, height: size * 0.2, background: '#333', borderRadius: '0 0 50% 50%' }}></div>
                )}
                {emotion === 'thinking' && (
                    <div style={{ width: size * 0.2, height: size * 0.05, background: '#333', borderRadius: '4px' }}></div>
                )}
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
            `}</style>
        </div>
    );
}
