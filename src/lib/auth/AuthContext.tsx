'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
    tenantLogo?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('inner_event_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('inner_event_user', JSON.stringify(userData));
        router.push('/');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('inner_event_user');
        // Also clear cookies via server action ideally, but for now client side is main driver for Redirect
        document.cookie = "inner_event_tenant=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "inner_event_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
