'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await api.login(form);
            login(res.access_token, res.user);
            router.push(res.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', paddingTop: 70 }}>
            <div style={{ background: 'var(--white)', borderRadius: 20, padding: 40, width: '90%', maxWidth: 420, boxShadow: '0 8px 40px rgba(44,24,16,.1)' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 8 }}>Kirish</h1>
                <p style={{ color: '#888', marginBottom: 28, fontSize: '.9rem' }}>Hisobingizga kiring.</p>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>Telefon raqam</label>
                        <input type="tel" placeholder="+998 90 000 00 00" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Parol</label>
                        <input type="password" placeholder="Parolingiz" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
                    <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 14, fontSize: '1rem', borderRadius: 10 }} disabled={loading}>
                        {loading ? 'Kutilmoqda...' : 'Kirish →'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '.88rem', color: '#888' }}>
                    Hisob yo'qmi? <Link href="/register" style={{ color: 'var(--wood-warm)', fontWeight: 600 }}>Ro'yxatdan o'ting</Link>
                </p>
            </div>
        </div>
    );
}
