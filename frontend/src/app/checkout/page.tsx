'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

function CheckoutContent() {
    const params = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    const enrollmentId = params.get('enrollment_id');
    const [provider, setProvider] = useState<'payme' | 'click'>('payme');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading]);

    const pay = async () => {
        if (!enrollmentId) { setError("Enrollment ID topilmadi"); return; }
        setProcessing(true); setError('');
        try {
            if (provider === 'payme') {
                const res = await api.createPaymeUrl(+enrollmentId);
                if (res.free) { router.push('/dashboard?enrolled=1'); return; }
                window.location.href = res.redirect_url;
            } else {
                // Click redirect
                setError("Click integratsiyasi tez orada qo'shiladi. Iltimos, Payme ni tanlang.");
            }
        } catch (e: any) { setError(e.message); }
        finally { setProcessing(false); }
    };

    if (loading || !user) return <div className="spinner" style={{ marginTop: 100 }} />;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', paddingTop: 70 }}>
            <div style={{ background: 'var(--white)', borderRadius: 20, padding: 40, width: '90%', maxWidth: 440, boxShadow: '0 8px 40px rgba(44,24,16,.1)' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 8 }}>To'lov</h1>
                <p style={{ color: '#888', marginBottom: 28, fontSize: '.9rem' }}>To'lov usulini tanlang va davom eting.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    {(['payme', 'click'] as const).map(p => (
                        <button key={p} onClick={() => setProvider(p)} style={{
                            padding: '16px 20px', borderRadius: 12, border: `2px solid ${provider === p ? 'var(--gold)' : 'rgba(44,24,16,.12)'}`,
                            background: provider === p ? 'rgba(201,137,58,.08)' : 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'DM Sans', sans-serif",
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{p === 'payme' ? '💳' : '🔵'}</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 600, color: 'var(--wood-dark)' }}>{p === 'payme' ? 'Payme' : 'Click'}</div>
                                <div style={{ fontSize: '.8rem', color: '#888' }}>{p === 'payme' ? 'Karta orqali to\'lov' : 'Click ilovasi orqali'}</div>
                            </div>
                            {provider === p && <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontWeight: 700 }}>✓</span>}
                        </button>
                    ))}
                </div>

                {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
                <button className="btn btn-gold" style={{ width: '100%', padding: 14, fontSize: '1rem', borderRadius: 10 }} onClick={pay} disabled={processing}>
                    {processing ? 'Qayta ishlanmoqda...' : `${provider === 'payme' ? 'Payme' : 'Click'} orqali to'lash →`}
                </button>
                <button onClick={() => router.back()} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '.88rem' }}>
                    ← Orqaga qaytish
                </button>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="spinner" style={{ marginTop: 100 }} />}>
            <CheckoutContent />
        </Suspense>
    );
}
