'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavBar() {
    const { dict } = useLanguage();
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/strategy') {
            return pathname.startsWith('/strategy');
        }
        return pathname.startsWith(path);
    };

    const linkStyle = (path: string, colorVar: string) => {
        const active = isActive(path);
        return {
            textDecoration: 'none',
            fontSize: '0.9rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            color: active ? `hsl(var(${colorVar}))` : 'hsl(var(--text-muted))',
            background: active ? `hsl(var(${colorVar}) / 0.1)` : 'transparent',
            border: active ? `1px solid hsl(var(${colorVar}) / 0.2)` : '1px solid transparent',
            transition: 'all 0.2s ease',
            fontWeight: active ? 600 : 400
        };
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Home / Command Center Link */}
            {/* Home / Command Center Link */}
            <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1.5rem',
                transition: 'transform 0.2s ease'
            }} title="Inicio / Command Center">
                <img
                    src="/pragma-logo.png"
                    alt="Pragma Logo"
                    style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
            </Link>

            {/* 1. Gestionar Estrategia (Strategy) - Purple */}
            <Link href="/strategy" style={linkStyle('/strategy', '--module-strategy')}>
                {dict.nav.strategy}
            </Link>

            {/* 2. Capacidad de Equipos (Capacities) - Cyan */}
            <Link href="/capacities" style={linkStyle('/capacities', '--module-capacities')}>
                {dict.nav.capacities}
            </Link>

            {/* 3. Analitica (Analytics) - Orange */}
            <Link href="/analytics" style={linkStyle('/analytics', '--module-analytics')}>
                {dict.nav.analytics || 'Analytics'}
            </Link>

            {/* 4. Reportes (Reports) - Green */}
            <Link href="/reports" style={linkStyle('/reports', '--module-reports')}>
                {dict.nav.reports || 'Reports'}
            </Link>

            {/* 5. Emergent Strategy - Crimson */}
            <Link href="/emergent" style={linkStyle('/emergent', '--module-emergent')}>
                {dict.nav.emergent || 'Emergent'}
            </Link>

            {/* 6. Rituales (Rituals) - Gold */}
            <Link href="/rituals" style={linkStyle('/rituals', '--accent')}>
                Rituales
            </Link>

            <div style={{ marginLeft: '1rem' }}>
                <LanguageSwitcher />
            </div>
        </div>
    );
}
