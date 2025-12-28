'use client';

import { usePathname } from 'next/navigation';

export function useModuleTheme() {
    const pathname = usePathname();

    if (pathname.startsWith('/strategy')) {
        return {
            colorVar: '--module-strategy',
            color: 'hsl(var(--module-strategy))',
            glow: '0 0 20px hsl(var(--module-strategy) / 0.3)',
            border: '1px solid hsl(var(--module-strategy) / 0.3)',
            background: 'linear-gradient(135deg, hsl(var(--module-strategy) / 0.1), transparent)'
        };
    }
    if (pathname.startsWith('/capacities')) {
        return {
            colorVar: '--module-capacities',
            color: 'hsl(var(--module-capacities))',
            glow: '0 0 20px hsl(var(--module-capacities) / 0.3)',
            border: '1px solid hsl(var(--module-capacities) / 0.3)',
            background: 'linear-gradient(135deg, hsl(var(--module-capacities) / 0.1), transparent)'
        };
    }
    if (pathname.startsWith('/analytics')) {
        return {
            colorVar: '--module-analytics',
            color: 'hsl(var(--module-analytics))',
            glow: '0 0 20px hsl(var(--module-analytics) / 0.3)',
            border: '1px solid hsl(var(--module-analytics) / 0.3)',
            background: 'linear-gradient(135deg, hsl(var(--module-analytics) / 0.1), transparent)'
        };
    }
    if (pathname.startsWith('/reports')) {
        return {
            colorVar: '--module-reports',
            color: 'hsl(var(--module-reports))',
            glow: '0 0 20px hsl(var(--module-reports) / 0.3)',
            border: '1px solid hsl(var(--module-reports) / 0.3)',
            background: 'linear-gradient(135deg, hsl(var(--module-reports) / 0.1), transparent)'
        };
    }
    if (pathname.startsWith('/emergent')) {
        return {
            colorVar: '--module-emergent',
            color: 'hsl(var(--module-emergent))',
            glow: '0 0 20px hsl(var(--module-emergent) / 0.3)',
            border: '1px solid hsl(var(--module-emergent) / 0.3)',
            background: 'linear-gradient(135deg, hsl(var(--module-emergent) / 0.1), transparent)'
        };
    }

    // Default Fallback
    return {
        colorVar: '--primary',
        color: 'hsl(var(--primary))',
        glow: 'none',
        border: '1px solid hsl(var(--border-glass))',
        background: 'none'
    };
}
