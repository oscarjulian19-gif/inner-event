'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './StrategyTabs.module.css';

export default function StrategyTabs() {
    const pathname = usePathname();
    const { dict } = useLanguage();

    const isPlanning = pathname.includes('/strategy/planning');
    const isExecution = pathname.includes('/strategy/execution');

    return (
        <div className={styles.container}>
            <Link
                href="/strategy/planning"
                className={`${styles.tab} ${isPlanning ? styles.active : ''}`}
            >
                {/* Planificación */}
                {dict.strategy?.tabs?.planning || 'Planning'}
            </Link>
            <Link
                href="/strategy/execution"
                className={`${styles.tab} ${isExecution ? styles.active : ''}`}
            >
                {/* Ejecución / Iniciativas */}
                {dict.strategy?.tabs?.execution || 'Execution'}
            </Link>
        </div>
    );
}
