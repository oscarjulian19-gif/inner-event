'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '@/app/strategy/page.module.css';
import { suggestTeam } from '@/lib/team/suggestionLogic';
import Link from 'next/link';

type User = {
    id: string;
    name: string;
    email: string;
    discProfile?: {
        color: string;
    } | null;
};

type Team = {
    id: string;
    name: string;
    aiReasoning?: string | null;
    members: {
        user: User;
        role: string | null;
    }[];
};

export default function TeamsClient({ users, teams = [] }: { users: User[], teams?: Team[] }) {
    const { dict } = useLanguage();

    const getDiscColor = (u: User) => {
        switch (u.discProfile?.color) {
            case 'RED': return 'var(--danger)';
            case 'YELLOW': return 'var(--warning)';
            case 'GREEN': return 'var(--success)';
            case 'BLUE': return 'var(--accent)';
            default: return 'hsl(var(--text-muted))';
        }
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.header}>{dict.capacities.teams.title}</h1>
                <Link href="/" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
                    ← Back
                </Link>
            </div>

            <div className={styles.gridContainer} style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* POOL */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 className={styles.sectionTitle}>{dict.capacities.teams.pool} ({users.length})</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map(u => (
                            <div key={u.id} style={{
                                padding: '0.75rem',
                                background: 'hsl(var(--bg-app))',
                                borderRadius: '8px',
                                borderLeft: `4px solid ${getDiscColor(u)}`,
                                display: 'flex', justifyContent: 'space-between'
                            }}>
                                <span>{u.name}</span>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{u.discProfile?.color || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI PROPOSED TEAMS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Equipos Propuestos por IA</h2>
                        <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'var(--primary)', color: 'white' }}>Auto-Generated</span>
                    </div>

                    {teams.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                            No teams generated yet. Please seed data.
                        </div>
                    ) : (
                        teams.map(team => (
                            <div key={team.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{team.name}</h3>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{team.members.length} Members</span>
                                </div>

                                {/* AI Reasoning */}
                                {team.aiReasoning && (
                                    <div style={{
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        fontStyle: 'italic',
                                        border: '1px solid hsl(var(--border-glass))',
                                        display: 'flex',
                                        gap: '0.5rem'
                                    }}>
                                        <span>🤖</span>
                                        <span>"{team.aiReasoning}"</span>
                                    </div>
                                )}

                                {/* Members */}
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {team.members.map(tm => (
                                        <div key={tm.user.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'hsl(var(--bg-app))',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            border: `1px solid ${getDiscColor(tm.user)}`
                                        }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getDiscColor(tm.user) }} />
                                            <span style={{ fontWeight: 500 }}>{tm.user.name}</span>
                                            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({tm.role})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
