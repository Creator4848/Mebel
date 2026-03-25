'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Enrollment, Course } from '@/lib/types';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user) {
            api.myEnrollments().then(setEnrollments).catch(() => { });
            api.getCourses().then(setCourses).catch(() => { });
        }
    }, [user]);

    if (loading || !user) return <div className="spinner" style={{ marginTop: 100 }} />;

    const getCourse = (id?: number) => courses.find(c => c.id === id);

    return (
        <div style={{ paddingTop: 70, minHeight: '100vh', background: 'var(--cream)' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 5%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
                    <div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 6 }}>
                            Salom, {user.name.split(' ')[0]}! 👋
                        </h1>
                        <p style={{ color: '#888' }}>{user.phone} · {user.role === 'admin' ? '⚙️ Admin' : '🎓 Talaba'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {user.role === 'admin' && (
                            <Link href="/admin" className="btn btn-dark">⚙️ Admin Panel</Link>
                        )}
                        <button className="btn btn-outline" style={{ borderColor: 'var(--wood-warm)', color: 'var(--wood-warm)' }} onClick={logout}>
                            Chiqish
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 36 }}>
                    {[
                        { label: "Yozilgan kurslar", value: enrollments.length, icon: '📚' },
                        { label: 'To\'langan', value: enrollments.filter(e => e.is_paid).length, icon: '✅' },
                        { label: "Kutilmoqda", value: enrollments.filter(e => !e.is_paid).length, icon: '⏳' },
                    ].map(s => (
                        <div key={s.label} style={{ background: 'var(--white)', borderRadius: 16, padding: '24px', boxShadow: '0 4px 20px rgba(44,24,16,.08)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: 'var(--gold)' }}>{s.value}</div>
                            <div style={{ color: '#888', fontSize: '.82rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Enrollments */}
                <div style={{ background: 'var(--white)', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(44,24,16,.08)' }}>
                    <h2 style={{ color: 'var(--wood-dark)', marginBottom: 20, fontSize: '1.2rem' }}>Mening Kurslarim</h2>
                    {enrollments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
                            <p>Hech qanday kursga yozilmagansiz.</p>
                            <Link href="/kurslar" className="btn btn-gold" style={{ marginTop: 16 }}>Kurslarni ko'rish →</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {enrollments.map(e => {
                                const course = getCourse(e.course_id);
                                return (
                                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--cream)', borderRadius: 12 }}>
                                        <div style={{ fontSize: '1.8rem' }}>{course?.emoji || '📚'}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--wood-dark)' }}>{course?.title || `Kurs #${e.course_id}`}</div>
                                            <div style={{ fontSize: '.8rem', color: '#888' }}>{new Date(e.created_at).toLocaleDateString('uz-UZ')}</div>
                                        </div>
                                        <span style={{ padding: '4px 14px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600, background: e.is_paid ? '#2a7a4b22' : '#7a2a2a22', color: e.is_paid ? '#2a7a4b' : '#7a2a2a' }}>
                                            {e.is_paid ? "To'langan ✓" : "Kutilmoqda"}
                                        </span>
                                        {!e.is_paid && (
                                            <Link href={`/checkout?enrollment_id=${e.id}`} className="btn btn-gold" style={{ fontSize: '.8rem', padding: '6px 14px' }}>
                                                To'lash
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
