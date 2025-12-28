'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '@/app/strategy/page.module.css';
import Link from 'next/link';

import NavBar from '@/components/NavBar';
import { useModuleTheme } from '@/lib/hooks/useModuleTheme';

export default function CapacitiesDashboard() {
    const { dict } = useLanguage();
    const theme = useModuleTheme();

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className={styles.header} style={{
                    background: `linear-gradient(to right, #fff, ${theme.color})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>{dict.capacities.title}</h1>
                <NavBar />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* User Management Card */}
                <Link href="/capacities/users" className="glass-panel" style={{
                    padding: '2rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    borderLeft: `4px solid ${theme.color}`,
                    boxShadow: theme.glow
                }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: theme.color }}>👥 {dict.capacities.users.title}</h2>
                    <p style={{ opacity: 0.7 }}>Manage your talent pool, add new users, and view individual profiles.</p>
                </Link>

                {/* Team Formation Card */}
                <Link href="/capacities/teams" className="glass-panel" style={{
                    padding: '2rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    borderLeft: `4px solid ${theme.color}`,
                    boxShadow: theme.glow
                }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: theme.color }}>🧩 {dict.capacities.teams.title}</h2>
                    <p style={{ opacity: 0.7 }}>Use AI to suggest balanced teams based on behavioral DISC profiles.</p>
                </Link>
            </div>
        </div>
    );
}
