"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Instructor } from '@/lib/types';

export default function UstalarPage() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getInstructors()
            .then(data => {
                setInstructors(data || []);
            })
            .catch(e => {
                console.error('Failed to fetch instructors:', e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '120px 5% 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <p className="section-label">Jamoamiz</p>
                <h1 className="section-title">Bizning Ustalar</h1>
                <p className="section-sub">
                    O'zbekistonning eng tajribali mebel ustalari bilan tanishing.
                    Ular o'zlarining ko'p yillik sir-asrorlarini siz bilan bo'lishishga tayyor.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: '1.2rem' }}>
                    Yuklanmoqda...
                </div>
            ) : instructors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: '1.2rem', background: 'var(--white)', borderRadius: 16 }}>
                    Hozircha ustalar qo'shilmagan.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
                    {instructors.map((usta: Instructor) => (
                        <div key={usta.id} className="card" style={{ padding: '40px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                width: 90, height: 90, borderRadius: '50%', margin: '0 auto 24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', background: usta.avatar_color || 'var(--gold)',
                                boxShadow: '0 8px 24px rgba(201,137,58,0.2)'
                            }}>
                                {usta.emoji || '👨‍🔧'}
                            </div>
                            <h3 style={{ color: 'var(--wood-dark)', fontSize: '1.3rem', marginBottom: 8 }}>{usta.name}</h3>
                            <p style={{ color: 'var(--wood-warm)', fontSize: '.95rem', fontWeight: 600, marginBottom: 16 }}>{usta.role}</p>

                            <p style={{ color: '#666', fontSize: '.9rem', lineHeight: 1.6, marginBottom: 24, flexGrow: 1 }}>
                                {usta.bio || "Ushbu ustaning maxsus biografiyasi tez orada to'ldiriladi."}
                            </p>

                            <div style={{
                                borderTop: '1px solid rgba(201,137,58,0.2)', paddingTop: 16,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                fontSize: '.85rem'
                            }}>
                                <span style={{ color: '#888' }}>
                                    <strong style={{ color: 'var(--wood-dark)' }}>{usta.experience || 'N/A'}</strong> tajriba
                                </span>
                                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                                    ⭐ {usta.rating || '5.0'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
