'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import GlobalAIMentor from '@/components/GlobalAIMentor';

export default function GlobalMentorWrapper() {
    const { user } = useAuth();

    // Only show mentor if user is logged in
    if (!user) return null;

    return <GlobalAIMentor user={user} />;
}
