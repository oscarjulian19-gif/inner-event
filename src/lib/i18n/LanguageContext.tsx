'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries } from './dictionaries';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    dict: typeof dictionaries['en'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('es');

    useEffect(() => {
        const saved = localStorage.getItem('app-locale') as Locale;
        if (saved && (saved === 'en' || saved === 'es' || saved === 'zh')) {
            setLocale(saved);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('app-locale', newLocale);
    };

    const value = {
        locale,
        setLocale: handleSetLocale,
        dict: dictionaries[locale],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
