'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '@/app/strategy/page.module.css';
import KanbanBoard from '@/components/Kanban/KanbanBoard';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function InitiativeClient({ initiative, tasks, createKanbanTaskAction }: any) {
    const { dict } = useLanguage();
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <main className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                    <Link href="/strategy/execution" style={{ textDecoration: 'none', color: 'hsl(var(--text-muted))', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>← {dict.nav.kanban}</Link>
                    <h1 className={styles.header} style={{ marginTop: '0.5rem', fontSize: '2rem' }}>{initiative.title}</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem' }}>
                        {initiative.keyResult && (
                            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', background: 'hsl(var(--primary) / 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', width: 'fit-content' }}>
                                KR: {initiative.keyResult.statement}
                            </span>
                        )}
                        <p style={{ color: 'hsl(var(--text-muted))', margin: 0 }}>{initiative.aiExplanation || 'No AI explanation available.'}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                    <NavBar />
                    <button className="btn-primary" onClick={() => setIsAddOpen(!isAddOpen)}>
                        + Add Task
                    </button>
                </div>
            </div>

            {isAddOpen && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <form action={createKanbanTaskAction} style={{ display: 'flex', gap: '1rem' }}>
                        <input type="hidden" name="initiativeId" value={initiative.id} />
                        <input name="title" placeholder="Task title..." required style={{ flex: 1 }} />
                        <button type="submit" className="btn-primary">Add</button>
                    </form>
                </div>
            )}

            <div style={{ flex: 1 }}>
                <KanbanBoard tasks={tasks} initiativeId={initiative.id} />
            </div>
        </main>
    );
}
