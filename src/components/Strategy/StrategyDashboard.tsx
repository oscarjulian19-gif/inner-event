'use client';

import React, { useState } from 'react';
import { createPurpose, createAreaPurpose, createMega, createObjective, createKeyResult, updateKeyResult, updatePurpose, updateMega, updateObjectiveTitle } from '@/app/actions';
import styles from '@/app/strategy/page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import NavBar from '../NavBar';
import { useModuleTheme } from '@/lib/hooks/useModuleTheme';
import EditableText from '@/components/EditableText';

type StrategyDashboardProps = {
    purpose: any;
    areaPurpose?: any;
    analysisData?: any;
};

export default function StrategyDashboard({ purpose, areaPurpose, analysisData }: StrategyDashboardProps) {
    const { dict } = useLanguage();
    // Removed manual editing state
    const theme = useModuleTheme();

    return (
        <div className={styles.container}>
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 className={styles.header} style={{
                        fontSize: '1.5rem',
                        color: 'hsl(var(--primary))',
                        marginBottom: 0,
                        borderLeft: '1px solid hsl(var(--border-glass))',
                        paddingLeft: '1rem',
                        marginLeft: '0.5rem'
                    }}>{dict.strategy.title}</h1>
                </div>
                <NavBar />
            </div>

            {/* Purpose Section */}
            <section className={`glass-panel ${styles.section}`} style={{ border: theme.border, boxShadow: theme.glow }}>
                <h2 className={styles.sectionTitle} style={{ color: theme.color }}>1. Estrella Polar 🌟 (Propósito)</h2>
                {purpose ? (
                    <div className={styles.purposeDisplay} style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                        <EditableText
                            initialValue={purpose.statement}
                            onSave={async (val) => { await updatePurpose(purpose.id, val); }}
                        />
                    </div>
                ) : (
                    <form action={createPurpose} className={styles.formRow}>
                        <input
                            name="statement"
                            placeholder={dict.strategy.purpose.placeholder}
                            style={{ flex: 1 }}
                            required
                        />
                        <button type="submit" className="btn-primary">
                            {dict.strategy.purpose.button}
                        </button>
                    </form>
                )}
            </section>

            {/* Area Purpose Section */}
            <section className={`glass-panel ${styles.section}`} style={{ border: theme.border, boxShadow: theme.glow, marginTop: '2rem' }}>
                <h2 className={styles.sectionTitle} style={{ color: theme.color }}>Propósito de Área</h2>
                <div className={styles.purposeDisplay} style={{ fontStyle: 'italic', opacity: 1, color: 'hsl(var(--text-main))' }}>
                    <EditableText
                        initialValue={areaPurpose?.statement || ''}
                        onSave={async (val) => {
                            if (areaPurpose) {
                                await updatePurpose(areaPurpose.id, val);
                            } else {
                                // Create new Area Purpose
                                await createAreaPurpose(val);
                            }
                        }}
                        placeholder="Definir Propósito de Área..."
                    />
                </div>
            </section>

            {/* Megas Section */}
            {purpose && (
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0, color: theme.color }}>{dict.strategy.megas.title}</h2>
                        <form action={createMega} className={styles.formRow}>
                            <input type="hidden" name="purposeId" value={purpose.id} />
                            <input name="statement" placeholder={dict.strategy.megas.placeholder} required />
                            <input name="deadline" type="date" required />
                            <button type="submit" className="btn-primary">+</button>
                        </form>
                    </div>

                    <div className={styles.megaGrid}>
                        {purpose.megas.map((mega: any) => (
                            <div key={mega.id} className={styles.megaCard} style={{ borderLeft: `4px solid ${theme.color}` }}>
                                <div className={styles.megaHeader}>
                                    <h3 className={styles.megaTitle}>
                                        <EditableText
                                            initialValue={mega.statement}
                                            onSave={async (val) => { await updateMega(mega.id, val); }}
                                        />
                                    </h3>
                                    <span className={styles.megaDate}>{dict.strategy.megas.due} {new Date(mega.deadline).toLocaleDateString()}</span>
                                </div>

                                {/* Objectives */}
                                <div className={styles.objectivesList}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>{dict.strategy.objectives.title}</h4>
                                        <form action={createObjective} style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="hidden" name="megaId" value={mega.id} />
                                            <input name="statement" placeholder={dict.strategy.objectives.placeholder} required style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                                            <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>+</button>
                                        </form>
                                    </div>

                                    {mega.objectives.map((obj: any) => (
                                        <div key={obj.id} className={styles.objectiveItem}>
                                            <div className={styles.objectiveTitle}>
                                                <EditableText
                                                    initialValue={obj.statement}
                                                    onSave={async (val) => { await updateObjectiveTitle(obj.id, val); }}
                                                />
                                            </div>

                                            {/* Key Results */}
                                            <div className={styles.krList}>
                                                {obj.keyResults.map((kr: any) => (
                                                    <div key={kr.id} className={styles.krItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ flex: 1, color: 'hsl(var(--text-main))' }}> {/* Force dark text context */}
                                                                <EditableText
                                                                    initialValue={kr.statement}
                                                                    onSave={async (val) => {
                                                                        const fd = new FormData();
                                                                        fd.append('statement', val);
                                                                        fd.append('targetValue', kr.targetValue.toString());
                                                                        fd.append('metricUnit', kr.metricUnit);
                                                                        await updateKeyResult(kr.id, fd);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span className={styles.krTarget}>{kr.targetValue} {kr.metricUnit}</span>
                                                            </div>
                                                        </div>

                                                        {/* Initiatives Metrics */}
                                                        {kr.initiatives && kr.initiatives.length > 0 && (
                                                            <Link href={`/strategy/initiative/${kr.initiatives[0].id}`} style={{ width: '100%', textDecoration: 'none' }}>
                                                                <div style={{ width: '100%', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px', transition: 'background 0.2s' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                                        <span>{kr.initiatives.length} Initiatives</span>
                                                                        <span>
                                                                            {Math.round(kr.initiatives.reduce((acc: number, curr: any) => acc + (curr.progress || 0), 0) / kr.initiatives.length)}% Avg.
                                                                        </span>
                                                                    </div>
                                                                    <div style={{ height: '4px', background: 'hsl(var(--bg-surface))', borderRadius: '2px', overflow: 'hidden' }}>
                                                                        <div style={{
                                                                            height: '100%',
                                                                            width: `${Math.round(kr.initiatives.reduce((acc: number, curr: any) => acc + (curr.progress || 0), 0) / kr.initiatives.length)}%`,
                                                                            background: 'var(--primary)',
                                                                            transition: 'width 0.5s ease'
                                                                        }} />
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <form action={createKeyResult} style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="hidden" name="objectiveId" value={obj.id} />
                                                <input name="statement" placeholder={dict.strategy.krs.placeholder} required style={{ flex: 1, padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                                                <input name="targetValue" type="number" placeholder={dict.strategy.krs.target} required style={{ width: '60px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                                                <input name="metricUnit" placeholder={dict.strategy.krs.unit} required style={{ width: '50px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} />
                                                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add</button>
                                            </form>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
