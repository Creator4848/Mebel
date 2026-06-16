"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Course } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [videoUnlocked, setVideoUnlocked] = useState(false);

    useEffect(() => {
        if (!id) return;
        api.getCourse(+id)
            .then(setCourse)
            .catch(() => router.push('/kurslar'))
            .finally(() => setLoading(false));
    }, [id]);

    // Foydalanuvchi login qilganda videoni ochish
    useEffect(() => {
        if (user) setVideoUnlocked(true);
    }, [user]);

    const getYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return <div className="spinner" style={{ marginTop: 120 }} />;
    if (!course) return null;

    const youtubeId = getYoutubeId(course.youtube_link);
    const isLoggedIn = !!user && !authLoading;

    return (
        <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '120px 5% 80px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: 24, fontSize: '.9rem', color: '#888' }}>
                    <Link href="/" style={{ color: 'var(--wood-warm)' }}>Bosh sahifa</Link> /
                    <Link href="/kurslar" style={{ color: 'var(--wood-warm)', marginLeft: 8 }}>Kurslar</Link> /
                    <span style={{ marginLeft: 8 }}>{course.title}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

                    {/* Main Content */}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 20 }}>
                            {course.emoji} {course.title}
                        </h1>

                        <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
                            <div style={{ background: 'var(--white)', padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '1.2rem' }}>⏱</span>
                                <div>
                                    <div style={{ fontSize: '.75rem', color: '#888', textTransform: 'uppercase' }}>Davomiyligi</div>
                                    <div style={{ fontWeight: 600 }}>{course.hours} soat</div>
                                </div>
                            </div>
                            <div style={{ background: 'var(--white)', padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '1.2rem' }}>📚</span>
                                <div>
                                    <div style={{ fontSize: '.75rem', color: '#888', textTransform: 'uppercase' }}>Darslar soni</div>
                                    <div style={{ fontWeight: 600 }}>{course.lessons} ta dars</div>
                                </div>
                            </div>
                            <div style={{ background: 'var(--white)', padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '1.2rem' }}>⭐</span>
                                <div>
                                    <div style={{ fontSize: '.75rem', color: '#888', textTransform: 'uppercase' }}>Reyting</div>
                                    <div style={{ fontWeight: 600 }}>{course.rating} / 5.0</div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Video Section ─── */}
                        {youtubeId ? (
                            <div style={{ marginBottom: 40 }}>
                                <h2 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 16 }}>
                                    Kursga kirish darsi
                                </h2>

                                {/* Foydalanuvchi kirgan va video ochilgan */}
                                {(isLoggedIn || videoUnlocked) ? (
                                    <div style={{
                                        position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
                                        borderRadius: 20, background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
                                    }}>
                                        <iframe
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                            src={`https://www.youtube.com/embed/${youtubeId}`}
                                            title="Course Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    /* Video blokirovka ko'rinishi */
                                    <div
                                        onClick={() => setShowAuthModal(true)}
                                        style={{
                                            position: 'relative',
                                            paddingBottom: '56.25%',
                                            height: 0,
                                            overflow: 'hidden',
                                            borderRadius: 20,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        <img
                                            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                                            alt="Video thumbnail"
                                            style={{
                                                position: 'absolute', top: 0, left: 0,
                                                width: '100%', height: '100%',
                                                objectFit: 'cover',
                                                filter: 'brightness(0.4) blur(2px)',
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                            }}
                                        />
                                        {/* Lock overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', justifyContent: 'center',
                                            gap: 16,
                                            background: 'linear-gradient(135deg, rgba(44,24,16,0.6), rgba(44,24,16,0.4))',
                                        }}>
                                            <div style={{
                                                width: 80, height: 80,
                                                background: 'rgba(255,255,255,0.15)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '2.2rem',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                                transition: 'transform .2s',
                                            }}>
                                                🔒
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{
                                                    color: 'var(--white)', fontWeight: 700,
                                                    fontSize: '1.2rem', marginBottom: 6,
                                                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                                }}>
                                                    Videoni ko'rish uchun kirish kerak
                                                </p>
                                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '.9rem' }}>
                                                    Bosing va ro'yxatdan o'ting — bepul!
                                                </p>
                                            </div>
                                            <button
                                                style={{
                                                    background: 'linear-gradient(135deg, var(--gold), #e8a830)',
                                                    color: 'var(--wood-dark)',
                                                    border: 'none',
                                                    padding: '12px 32px',
                                                    borderRadius: 50,
                                                    fontWeight: 700,
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 20px rgba(201,137,58,0.5)',
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                🎬 Videoni ko'rish
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                background: 'rgba(201,137,58,0.05)', border: '2px dashed rgba(201,137,58,0.2)',
                                borderRadius: 20, padding: 40, textAlign: 'center', marginBottom: 40
                            }}>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}>🎥</span>
                                <p style={{ color: 'var(--wood-warm)', fontWeight: 500 }}>
                                    Tanishuv videosi tez orada yuklanadi
                                </p>
                            </div>
                        )}

                        <div style={{ background: 'var(--white)', padding: 32, borderRadius: 20, boxShadow: '0 4px 20px rgba(44,24,16,.05)' }}>
                            <h2 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 16 }}>
                                Kurs haqida
                            </h2>
                            <p style={{ color: '#555', lineHeight: 1.8 }}>
                                {course.description || "Ushbu kurs uchun hali tavsif qo'shilmagan."}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside style={{ position: 'sticky', top: 100 }}>
                        <div style={{ background: 'var(--white)', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(44,24,16,.08)', border: '1px solid rgba(44,24,16,.05)' }}>
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: '.85rem', color: '#888', marginBottom: 4 }}>Kurs narxi</div>
                                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--wood-dark)' }}>
                                    {course.price === 0 ? (
                                        <span style={{ color: '#2a7a4b' }}>Bepul</span>
                                    ) : (
                                        <>
                                            {course.price.toLocaleString()}
                                            <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#888', marginLeft: 6 }}>so'm</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {isLoggedIn ? (
                                <Link
                                    href={`/checkout?course_id=${course.id}`}
                                    className="btn btn-gold"
                                    style={{ width: '100%', padding: '16px 0', fontSize: '1.1rem', borderRadius: 14, marginBottom: 20, display: 'block', textAlign: 'center' }}
                                >
                                    Kursga yozilish →
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="btn btn-gold"
                                    style={{ width: '100%', padding: '16px 0', fontSize: '1.1rem', borderRadius: 14, marginBottom: 20, cursor: 'pointer' }}
                                >
                                    Kursga yozilish →
                                </button>
                            )}

                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    'Umrbod kirish huquqi',
                                    'Professional ustozlar',
                                    'Yopiq telegram guruh',
                                    'Sertifikat beriladi'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.9rem', color: '#666' }}>
                                        <span style={{ color: 'var(--gold)', fontWeight: 900 }}>✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginTop: 24, padding: 20, textAlign: 'center' }}>
                            <p style={{ fontSize: '.85rem', color: '#888' }}>
                                Savollaringiz bormi? <br />
                                <a href="tel:+998889884848" style={{ color: 'var(--gold)', fontWeight: 600 }}>Biz bilan bog'laning</a>
                            </p>
                        </div>
                    </aside>

                </div>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => setVideoUnlocked(true)}
                />
            )}
        </main>
    );
}
