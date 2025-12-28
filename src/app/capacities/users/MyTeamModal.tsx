'use plain';
'use client';

import React, { useState } from 'react';
import { addTeamMember, removeTeamMember } from '@/app/actions';

type Props = {
    user: any; // The current user viewing (Leader or Member)
    team: any; // The team data (including members and leader)
    onClose: () => void;
};

export default function MyTeamModal({ user, team, onClose }: Props) {
    const isLeader = user.jobRole === 'TEAM_LEAD';

    if (!team) return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ padding: '2rem', background: 'white' }}>
                <p>No tienes un equipo asignado aún.</p>
                <button onClick={onClose} style={{ marginTop: '1rem' }}>Cerrar</button>
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '500px', background: 'white', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{team.name}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Líder</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {team.leader?.name.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{team.leader?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{team.leader?.email}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Miembros del Equipo ({team.members.length})</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {team.members.map((m: any) => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                        {m.user.name.charAt(0)}
                                    </div>
                                    <span>{m.user.name}</span>
                                </div>
                                {isLeader && (
                                    <form action={removeTeamMember}>
                                        <input type="hidden" name="memberId" value={m.userId} />
                                        <input type="hidden" name="teamId" value={team.id} />
                                        <button type="submit" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Eliminar</button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>

                    {isLeader && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-glass)' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Agregar Miembro</h4>
                            <form action={addTeamMember} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="hidden" name="teamId" value={team.id} />
                                <input name="email" placeholder="Email del usuario..." required style={{ flex: 1 }} />
                                <button type="submit" className="btn-primary" style={{ padding: '0.5rem' }}>+</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
