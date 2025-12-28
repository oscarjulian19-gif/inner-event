'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/strategy/page.module.css';
import NavBar from '@/components/NavBar';
import { createRitual } from '@/app/actions';

export default function RitualsPage({ rituals }) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className={styles.container}>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 className={styles.header} style={{
                        fontSize: '2rem',
                        color: 'hsl(var(--accent))',
                        marginBottom: 0
                    }}>Rituales de Seguimiento 📅</h1>
                </div>
                <NavBar />
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreating(!isCreating)}
                    style={{ background: 'hsl(var(--accent))' }}
                >
                    {isCreating ? 'Cancel' : '+ Nuevo Ritual'}
                </button>
            </div>

            {isCreating && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid hsl(var(--accent))' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'hsl(var(--text-main))' }}>Programar Nuevo Ritual</h2>
                    <form action={createRitual} className={styles.formRow} style={{ alignItems: 'flex-end', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                            <label style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Fecha de Sesión</label>
                            <input name="date" type="date" required style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 2 }}>
                            <label style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Contexto / Descripción</label>
                            <input name="description" placeholder="Ej: Revisión Q3..." style={{ width: '100%' }} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ background: 'hsl(var(--accent))', height: '42px' }}>
                            Crear Ritual
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {rituals.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'hsl(var(--text-muted))' }}>
                        No hay rituales registrados aún. Comienza programando uno.
                    </div>
                )}
                {rituals.map((ritual) => (
                    <Link key={ritual.id} href={`/rituals/${ritual.id}`} style={{ textDecoration: 'none' }}>
                        <div className="glass-panel" style={{
                            padding: '1.5rem',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                            borderLeft: '4px solid hsl(var(--accent))'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'hsl(var(--text-main))' }}>{ritual.name}</h3>
                                <span style={{
                                    fontSize: '0.8rem',
                                    padding: '0.25rem 0.75rem',
                                    background: 'hsl(var(--bg-app))',
                                    color: 'white',
                                    borderRadius: '12px'
                                }}>
                                    {new Date(ritual.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', flex: 1 }}>
                                {ritual.description || 'Sin descripción'}
                            </p>
                            <div style={{
                                marginTop: 'auto',
                                paddingTop: '1rem',
                                borderTop: '1px solid hsl(var(--border-glass))',
                                fontSize: '0.85rem',
                                color: 'hsl(var(--primary))',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>Ingresar a Sesión →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
