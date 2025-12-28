'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (lang: 'en' | 'es' | 'zh') => {
        setLocale(lang);
        setIsOpen(false);
    };

    const getFlag = (l: string) => {
        switch (l) {
            case 'en': return '🇺🇸';
            case 'es': return '🇪🇸';
            case 'zh': return '🇨🇳';
            default: return '🌐';
        }
    };

    const getLabel = (l: string) => {
        switch (l) {
            case 'en': return 'English';
            case 'es': return 'Español';
            case 'zh': return '中文';
            default: return 'Select';
        }
    };

    return (
        <div className={styles.switcher}>
            <button className={styles.trigger} onClick={toggleDropdown}>
                <span>{getFlag(locale)}</span>
                <span>{getLabel(locale)}</span>
                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>▼</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <button className={`${styles.option} ${locale === 'en' ? styles.active : ''}`} onClick={() => handleSelect('en')}>
                        🇺🇸 English
                    </button>
                    <button className={`${styles.option} ${locale === 'es' ? styles.active : ''}`} onClick={() => handleSelect('es')}>
                        🇪🇸 Español
                    </button>
                    <button className={`${styles.option} ${locale === 'zh' ? styles.active : ''}`} onClick={() => handleSelect('zh')}>
                        🇨🇳 中文
                    </button>
                </div>
            )}
        </div>
    );
}
