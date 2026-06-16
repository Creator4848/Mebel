'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface AuthModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
    const { login } = useAuth();
    const [tab, setTab] = useState<'login' | 'register'>('register');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login fields
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register fields
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.login({ username: loginUsername, password: loginPassword });
            login(res.access_token, res.user);
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Kirish xatosi');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.register({ name: regName, phone: regPhone, username: regUsername, password: regPassword });
            login(res.access_token, res.user);
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Ro'yxatdan o'tish xatosi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(20,10,5,0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
                animation: 'fadeIn .2s ease',
            }}
        >
            <div style={{
                background: 'var(--white)',
                borderRadius: 28,
                padding: '40px 36px',
                width: '100%',
                maxWidth: 440,
                boxShadow: '0 32px 80px rgba(44,24,16,.25)',
                position: 'relative',
                animation: 'slideUp .25s ease',
            }}>
                {/* Close */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 16, right: 16,
                        background: 'rgba(0,0,0,0.06)', border: 'none',
                        width: 36, height: 36, borderRadius: '50%',
                        cursor: 'pointer', fontSize: '1.1rem', color: '#666',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >✕</button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔐</div>
                    <h2 style={{
                        fontSize: '1.6rem',
                        fontFamily: "'Playfair Display', serif",
                        color: 'var(--wood-dark)',
                        marginBottom: 6,
                    }}>
                        {tab === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
                    </h2>
                    <p style={{ color: '#888', fontSize: '.9rem' }}>
                        Videolarni ko'rish uchun hisobingiz kerak
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', borderRadius: 14,
                    background: 'var(--cream)',
                    padding: 4, marginBottom: 28,
                }}>
                    {(['register', 'login'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setError(''); }}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: 11,
                                border: 'none', cursor: 'pointer', fontWeight: 600,
                                fontSize: '.9rem', transition: 'all .2s',
                                background: tab === t ? 'var(--white)' : 'transparent',
                                color: tab === t ? 'var(--wood-dark)' : '#888',
                                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            {t === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#fff0f0', border: '1px solid #ffcccc',
                        borderRadius: 10, padding: '10px 14px',
                        color: '#c0392b', fontSize: '.85rem', marginBottom: 16,
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Login Form */}
                {tab === 'login' && (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ fontSize: '.8rem', color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                                Foydalanuvchi nomi
                            </label>
                            <input
                                required
                                value={loginUsername}
                                onChange={e => setLoginUsername(e.target.value)}
                                placeholder="username"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '.8rem', color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                                Parol
                            </label>
                            <input
                                required
                                type="password"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputStyle}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-gold"
                            style={{ padding: '14px 0', fontSize: '1rem', borderRadius: 12, marginTop: 4 }}>
                            {loading ? 'Kirilmoqda...' : 'Kirish →'}
                        </button>
                    </form>
                )}

                {/* Register Form */}
                {tab === 'register' && (
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: '.8rem', color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                                    Ism Familiya
                                </label>
                                <input
                                    required
                                    value={regName}
                                    onChange={e => setRegName(e.target.value)}
                                    placeholder="Ali Valiyev"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '.8rem', color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                                    Telefon
                                </label>
                                <input
                                    required
                                    value={regPhone}
                                    onChange={e => setRegPhone(e.target.value)}
                                    placeholder="+998901234567"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '.8rem', color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                                Foydalanuvchi nomi
                            </label>
                            <input
                                required
                                value={regUsername}
                                onChange={e => setRegUsername(e.target.value)}
                                placeholder="ali_valiyev"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '.8rem', color: '#888', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                                Parol
                            </label>
                            <input
                                required
                                type="password"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputStyle}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-gold"
                            style={{ padding: '14px 0', fontSize: '1rem', borderRadius: 12, marginTop: 4 }}>
                            {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish →"}
                        </button>
                    </form>
                )}

                <p style={{ textAlign: 'center', color: '#bbb', fontSize: '.78rem', marginTop: 20 }}>
                    Ro'yxatdan o'tish bepul va tez ✨
                </p>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #e8e8e8',
    fontSize: '.9rem',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: 'var(--cream)',
    boxSizing: 'border-box',
    transition: 'border-color .2s',
};
