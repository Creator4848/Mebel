"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Plan } from '@/lib/types';

export default function NarxlarPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getPlans()
            .then(data => setPlans(data || []))
            .catch(e => console.error('Failed to fetch plans:', e))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main style={{ minHeight: '100vh', background: 'var(--wood-dark)', padding: '120px 5% 80px', color: 'var(--white)' }}>
            <div style={{ textAlign: 'center', margin: '0 auto 64px', maxWidth: 700 }}>
                <p className="section-label" style={{ color: 'var(--gold)' }}>Rejalar</p>
                <h1 className="section-title section-title-light">O'quv Narxlari</h1>
                <p className="section-sub section-sub-light">
                    O'zingizga qulay va hamyonbop o'quv rejasini tanlang. Bizda har bir byudjet uchun mos takliflar bor.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
                    Yuklanmoqda...
                </div>
            ) : plans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,0.05)', borderRadius: 16 }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Hozircha tariflar shakllantirilmagan.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', maxWidth: 1100, margin: '0 auto' }}>
                    {plans.map((plan: Plan) => (
                        <div key={plan.id} style={{
                            flex: '1 1 300px', maxWidth: 380,
                            background: plan.is_featured ? 'rgba(201,137,58,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `2px solid ${plan.is_featured ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 24, padding: '48px 32px', position: 'relative',
                            display: 'flex', flexDirection: 'column',
                            boxShadow: plan.is_featured ? '0 16px 48px rgba(201,137,58,0.15)' : 'none',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer'
                        }}>
                            {plan.is_featured && (
                                <div style={{
                                    position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                                    background: 'linear-gradient(135deg, var(--gold), #b87a2e)', color: 'var(--white)',
                                    padding: '6px 20px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700,
                                    letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(201,137,58,0.3)'
                                }}>
                                    💎 Eng Mashhur
                                </div>
                            )}

                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <h3 style={{ fontSize: '1.6rem', fontFamily: "'Playfair Display', serif", color: plan.is_featured ? 'var(--gold)' : 'var(--white)', marginBottom: 16 }}>
                                    {plan.name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
                                    <span style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-1px' }}>
                                        {plan.price.toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                                        so'm
                                    </span>
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', margin: '0 0 40px', padding: 0, display: 'flex', flexDirection: 'column', gap: 16, flexGrow: 1 }}>
                                {plan.features && plan.features.length > 0 ? plan.features.map((feature: string, idx: number) => (
                                    <li key={idx} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '.95rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <span style={{ color: 'var(--gold)', fontWeight: 800 }}>✓</span>
                                        {feature}
                                    </li>
                                )) : (
                                    <li style={{ color: 'rgba(255,255,255,0.4)', fontSize: '.9rem', fontStyle: 'italic', textAlign: 'center' }}>
                                        Xususiyatlar kiritilmagan
                                    </li>
                                )}
                            </ul>

                            <Link
                                href={`/checkout?plan=${plan.id}`}
                                className={`btn ${plan.is_featured ? 'btn-gold' : 'btn-outline'}`}
                                style={{ width: '100%', padding: '14px 0', fontSize: '1.05rem', borderRadius: 12 }}
                            >
                                Sotib olish
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
