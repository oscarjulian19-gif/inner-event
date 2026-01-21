'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extendemos el usuario de Supabase con los datos de nuestra DB si es necesario
interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
    tenantLogo?: string | null;
}

interface AuthContextType {
    user: UserProfile | null;
    supabaseUser: SupabaseUser | null;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setSupabaseUser(session.user);
                // Si tienes un perfil guardado en localStorage o DB, lo cargamos
                const storedProfile = localStorage.getItem('inner_event_user');
                if (storedProfile) {
                    try {
                        setUser(JSON.parse(storedProfile));
                    } catch (e) {
                        console.error('Error parsing stored profile', e);
                    }
                }
            } else {
                setSupabaseUser(null);
                setUser(null);
            }
            setIsLoading(false);
        };

        fetchSession();

        // Escuchar cambios de estado (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`Auth event: ${event}`);

            if (session?.user) {
                setSupabaseUser(session.user);
                // Si acabamos de loguearnos, intentar recuperar el perfil del localStorage
                const storedProfile = localStorage.getItem('inner_event_user');
                if (storedProfile) {
                    try {
                        setUser(JSON.parse(storedProfile));
                    } catch (e) {
                        console.error('Error parsing stored profile on auth change', e);
                    }
                }
            } else {
                setSupabaseUser(null);
                setUser(null);
                localStorage.removeItem('inner_event_user');
            }

            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                setIsLoading(false);
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, router]);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSupabaseUser(null);
        localStorage.removeItem('inner_event_user');
        router.refresh(); // Refrescar para que el middleware actúe
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, supabaseUser, logout, isLoading }}>
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
