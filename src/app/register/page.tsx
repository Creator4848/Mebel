'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await api.register({ ...form, email: form.email || undefined });
            login(res.access_token, res.user);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', paddingTop: 70 }}>
            <div style={{ background: 'var(--white)', borderRadius: 20, padding: 40, width: '90%', maxWidth: 440, boxShadow: '0 8px 40px rgba(44,24,16,.1)' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 8 }}>Ro'yxatdan O'tish</h1>
                <p style={{ color: '#888', marginBottom: 28, fontSize: '.9rem' }}>Bepul sinov darsiga yozilish uchun ro'yxatdan o'ting.</p>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>To'liq ism</label>
                        <input placeholder="Ismingiz" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Telefon raqam</label>
                        <input type="tel" placeholder="+998 90 000 00 00" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email (ixtiyoriy)</label>
                        <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Parol</label>
                        <input type="password" placeholder="Parol yarating" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                    </div>
                    {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
                    <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 14, fontSize: '1rem', borderRadius: 10 }} disabled={loading}>
                        {loading ? 'Kutilmoqda...' : "Ro'yxatdan o'tish →"}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '.88rem', color: '#888' }}>
                    Hisobingiz bormi? <Link href="/login" style={{ color: 'var(--wood-warm)', fontWeight: 600 }}>Kirish</Link>
                </p>
            </div>
        </div>
    );
}
