"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Module } from '@/lib/types';

export default function DasturPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getModules()
            .then(data => setModules(data || []))
            .catch(e => console.error('Failed to fetch modules:', e))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '120px 5% 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <p className="section-label">Akademiya</p>
                <h1 className="section-title">O'quv Dasturi</h1>
                <p className="section-sub">
                    Mebel yasashni noldan boshlab professional darajagacha o'rganish uchun maxsus ishlab chiqilgan bosqichma-bosqich o'quv rejamiz.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: '1.2rem' }}>
                    Yuklanmoqda...
                </div>
            ) : modules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: '1.2rem', background: 'var(--white)', borderRadius: 16 }}>
                    Hozircha o'quv dasturi kiritilmagan.
                </div>
            ) : (
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    {modules.map((mod: Module, index: number) => (
                        <div key={mod.id} className="card" style={{
                            marginBottom: 32, padding: '32px 40px',
                            display: 'flex', gap: 32, alignItems: 'center',
                            borderLeft: '4px solid var(--gold)'
                        }}>
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', minWidth: 100,
                                borderRight: '1px solid rgba(201,137,58,0.2)', paddingRight: 32
                            }}>
                                <span style={{ fontSize: '3rem', marginBottom: 8 }}>📚</span>
                                <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                                    {mod.number || `${index + 1}-Modul`}
                                </span>
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 12 }}>
                                    {mod.title}
                                </h3>

                                {mod.topics && mod.topics.length > 0 && (
                                    <ul style={{ listStyle: 'none', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {mod.topics.map((topic, i) => (
                                            <li key={i} style={{ color: '#555', fontSize: '.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: 'var(--gold)', fontSize: '.8rem' }}>❖</span> {topic}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div style={{
                                    display: 'inline-block', fontSize: '.9rem', fontWeight: 600, color: 'var(--wood-warm)',
                                    background: 'var(--cream)', padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(201,137,58,0.2)'
                                }}>
                                    Davomiyligi: {mod.hours || 0} soat
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
