'use client';

import React, { useState } from 'react';
import { createPurpose, createAreaPurpose, createMega, createObjective, createKeyResult, updateKeyResult, updatePurpose, updateMega, updateObjectiveTitle, createOrganizationalValue, deleteOrganizationalValue } from '@/app/actions';
import styles from '@/app/strategy/page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import NavBar from '../NavBar';
import { useModuleTheme } from '@/lib/hooks/useModuleTheme';
import EditableText from '@/components/EditableText';
import StrategyCascade from './StrategyCascade';

// Define flexible interfaces for the nested strategy data
interface Initiative {
    id: string;
    title: string;
    progress: number;
    status: string;
}

interface KeyResult {
    id: string;
    statement: string;
    initiatives: Initiative[];
    targetValue: number;
    metricUnit: string;
}

interface Objective {
    id: string;
    statement: string;
    keyResults: KeyResult[];
    childObjectives?: any[];
    owner?: any;
}

interface Mega {
    id: string;
    statement: string;
    deadline: string | Date;
    objectives: Objective[];
}

interface Purpose {
    id: string;
    statement: string;
    megas: Mega[];
}

interface AreaPurpose {
    id: string;
    statement: string;
}

interface OrganizationalValue {
    id: string;
    statement: string;
}

type StrategyDashboardProps = {
    purpose: Purpose | null;
    areaPurpose?: AreaPurpose | null;
    analysisData?: Record<string, any>; // Keeping loose for analysis blob
    organizationalValues?: OrganizationalValue[];
};

export default function StrategyDashboard({ purpose, areaPurpose, analysisData, organizationalValues = [] }: StrategyDashboardProps) {
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

            {/* Cascade Tree inserted here to be top-level content after header */}
            <StrategyCascade purpose={purpose as any} />

            {/* Purpose Section */}
            <section className={`glass-panel ${styles.section}`} style={{ border: theme.border, boxShadow: theme.glow }}>
                <h2 className={styles.sectionTitle} style={{ color: theme.color }}>PROPÓSITO</h2>
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
                <h2 className={styles.sectionTitle} style={{ color: theme.color }}>PROPÓSITO DE ÁREA</h2>
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

            {/* Organizational Values Section */}
            <section className={`glass-panel ${styles.section}`} style={{ border: theme.border, boxShadow: theme.glow, marginTop: '2rem' }}>
                <h2 className={styles.sectionTitle} style={{ color: theme.color }}>VALORES ORGANIZACIONALES</h2>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    {organizationalValues.map((value) => (
                        <div key={value.id} style={{
                            background: 'rgba(255,255,255,0.8)',
                            border: `1px solid ${theme.color}`,
                            borderRadius: '20px',
                            padding: '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            <span>{value.statement}</span>
                            <form action={async () => { await deleteOrganizationalValue(value.id); }}>
                                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem', padding: 0 }}>×</button>
                            </form>
                        </div>
                    ))}
                </div>

                {organizationalValues.length < 10 && (
                    <form action={createOrganizationalValue} style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
                        <input
                            name="statement"
                            placeholder="Agregar nuevo valor..."
                            required
                            maxLength={50}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                        <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>+</button>
                    </form>
                )}
            </section>

            {/* Megas Section */}
            {purpose && (
                <section className={`glass-panel ${styles.section}`} style={{ border: theme.border, boxShadow: theme.glow, marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0, color: theme.color }}>MEGAS (Gran Destino)</h2>

                        {/* Mega Form with AI */}
                        <MegaCreator purposeId={purpose.id} areaPurpose={areaPurpose?.statement || ''} placeholder={dict.strategy.megas.placeholder} themeColor={theme.color} />
                    </div>

                    <div className={styles.megaGrid}>
                        {purpose.megas.map((mega, i) => (
                            <div key={mega.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
                                {/* Mega Card */}
                                <div className={styles.megaCard} style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Decorative Texture/Accent */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: theme.color }}></div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            color: theme.color,
                                            marginBottom: '0.5rem',
                                            opacity: 0.8
                                        }}>
                                            MEGA {i + 1}
                                        </div>
                                        <h3 className={styles.megaTitle} style={{ marginBottom: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>
                                            <EditableText
                                                initialValue={mega.statement}
                                                onSave={async (val) => { await updateMega(mega.id, val); }}
                                            />
                                        </h3>
                                    </div>
                                    <span style={{
                                        background: '#0f172a',
                                        color: 'white',
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 500
                                    }}>
                                        Vence: {new Date(mega.deadline).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Dark Separator Bar */}
                                <div style={{ height: '2.5rem', background: '#0f172a', width: '100%', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}></div>

                                {/* OKRs Container */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }}>
                                    {/* Header & Add Form */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#333', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>🎯</span> OBJETIVOS
                                        </h4>

                                        <form action={createObjective} style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
                                            <input type="hidden" name="megaId" value={mega.id} />
                                            <input
                                                name="statement"
                                                placeholder="Nuevo Objetivo..."
                                                required
                                                style={{
                                                    flex: 1,
                                                    padding: '0.8rem 1rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    background: '#f8fafc',
                                                    fontSize: '0.95rem'
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                style={{
                                                    background: '#1e293b',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.8rem 1.5rem',
                                                    borderRadius: '8px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: '0 4px 10px rgba(30, 41, 59, 0.2)'
                                                }}
                                            >
                                                <span>+</span> Agregar Objetivo
                                            </button>
                                        </form>
                                    </div>

                                    {/* Objectives Loop */}
                                    <div className={styles.objectivesList} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {mega.objectives.map((obj, j) => (
                                            <div key={obj.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem' }}>
                                                <div className={styles.objectiveTitle} style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b', display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                                                    <span style={{ color: theme.color, fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', minWidth: '85px' }}>OBJETIVO {j + 1}:</span>
                                                    <EditableText
                                                        initialValue={obj.statement}
                                                        onSave={async (val) => { await updateObjectiveTitle(obj.id, val); }}
                                                    />
                                                </div>

                                                {/* Key Results Grid */}
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                                                    {obj.keyResults.map((kr, k) => (
                                                        <div key={kr.id} className={styles.krItem} style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '0.8rem',
                                                            background: '#f8fafc',
                                                            padding: '1rem',
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <div style={{ flex: 1, color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                                    <span style={{ color: '#64748b', fontWeight: 700, marginRight: '0.5rem', fontSize: '0.8rem' }}>KR {k + 1}:</span>
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
                                                                <span style={{
                                                                    background: 'white',
                                                                    border: '1px solid #cbd5e1',
                                                                    borderRadius: '4px',
                                                                    padding: '0.2rem 0.5rem',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    whiteSpace: 'nowrap',
                                                                    marginLeft: '0.5rem'
                                                                }}>
                                                                    {kr.targetValue} {kr.metricUnit}
                                                                </span>
                                                            </div>

                                                            {/* Initiatives Link/Progress */}
                                                            {kr.initiatives && kr.initiatives.length > 0 && (
                                                                <Link href={`/strategy/initiative/${kr.initiatives[0].id}`} style={{ textDecoration: 'none' }}>
                                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                                                            <span>{kr.initiatives.length} Iniciativas</span>
                                                                            <span>{Math.round(kr.initiatives.reduce((acc, curr) => acc + (curr.progress || 0), 0) / kr.initiatives.length)}%</span>
                                                                        </div>
                                                                        <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                                                                            <div style={{
                                                                                height: '100%',
                                                                                width: `${Math.round(kr.initiatives.reduce((acc, curr) => acc + (curr.progress || 0), 0) / kr.initiatives.length)}%`,
                                                                                background: '#3b82f6',
                                                                                transition: 'width 0.5s ease'
                                                                            }} />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Add KR Button (Small Card) */}
                                                    <div style={{ background: 'white', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <form action={createKeyResult} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                            <input type="hidden" name="objectiveId" value={obj.id} />
                                                            <input name="statement" placeholder="Nuevo KR..." required style={{ border: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.3rem', fontSize: '0.9rem', outline: 'none' }} />
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <input name="targetValue" type="number" placeholder="Meta" required style={{ width: '50%', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.3rem', fontSize: '0.8rem' }} />
                                                                <input name="metricUnit" placeholder="Unit" required style={{ width: '50%', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.3rem', fontSize: '0.8rem' }} />
                                                            </div>
                                                            <button type="submit" style={{ background: '#334155', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>+ Agregar KR</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function MegaCreator({ purposeId, areaPurpose, placeholder, themeColor }: { purposeId: string, areaPurpose: string, placeholder: string, themeColor: string }) {
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSuggest = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/suggest-mega', {
                method: 'POST',
                body: JSON.stringify({ purpose: `(ID: ${purposeId})`, areaPurpose }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.suggestion) {
                setSuggestion(data.suggestion);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form action={createMega} className={styles.formRow}>
            <input type="hidden" name="purposeId" value={purposeId} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                    name="statement"
                    placeholder={placeholder}
                    required
                    defaultValue={suggestion}
                    key={suggestion} // re-render on suggestion
                    style={{ minWidth: '300px' }}
                />
                <button
                    type="button"
                    onClick={handleSuggest}
                    disabled={loading}
                    className="btn-secondary"
                    style={{
                        position: 'absolute',
                        right: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                    title="Pedir sugerencia a PRAGM-IA"
                >
                    {loading ? '⏳' : '✨'}
                </button>
            </div>
            <input name="deadline" type="date" required />
            <button
                type="submit"
                style={{
                    background: '#0f172a',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginLeft: '1rem'
                }}
                title="Agregar Mega"
            >
                +
            </button>
        </form>
    );
}
