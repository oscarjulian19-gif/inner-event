'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function TenantTheme() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            // Reset to default
            document.documentElement.style.setProperty('--primary', '210, 100%, 50%'); // Default Blue
            return;
        }

        // Determine Theme based on Email Domain or Tenant Name
        const isCompensar = user.email.includes('compensar.com');
        const isIkusi = user.email.includes('ikusi.com');

        if (isCompensar) {
            // Orange Theme
            document.documentElement.style.setProperty('--primary', '#FF6600');
            document.documentElement.style.setProperty('--module-strategy', '#FF6600');
            // Add more overrides if needed
        } else if (isIkusi) {
            // Green Theme
            document.documentElement.style.setProperty('--primary', '#00A650');
            document.documentElement.style.setProperty('--module-strategy', '#00A650');
        } else {
            // Default
            document.documentElement.style.setProperty('--primary', 'hsl(210, 100%, 50%)');
        }

    }, [user]);

    return null; // Logic only
}
