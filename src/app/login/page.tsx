'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { verifyLogin } from '@/app/actions';
import styles from '@/app/strategy/page.module.css';

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        try {
            const result = await verifyLogin(formData);

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            if (result.success && result.user) {
                login(result.user);
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, #1e293b, #0f172a)'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Inner Event
                    </h1>
                    <p style={{ color: 'hsl(var(--text-muted))' }}>Sign in to your organization</p>
                </div>

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="name@company.com"
                            className={styles.input}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            defaultValue="12345"
                            className={styles.input}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textAlign: 'center' }}>
                    <p>Test Credentials:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                        <code>william.galindo@compensar.com</code>
                        <code>oscar.gomez@ikusi.com</code>
                        <code>Password: 12345</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
