'use client';
import { useState, useEffect } from 'react';
import { Course } from '@/lib/types';
import { api } from '@/lib/api';
import CourseCard from '@/components/CourseCard';

const FILTERS = [
    { id: 'all', label: 'Barchasi' },
    { id: 'boshlangich', label: "Boshlang'ich" },
    { id: 'professional', label: 'Professional' },
    { id: 'dizayn', label: 'Dizayn' },
    { id: 'restoratsiya', label: 'Restoratsiya' },
];

export default function KurslarPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getCourses(category)
            .then(setCourses)
            .finally(() => setLoading(false));
    }, [category]);

    return (
        <div style={{ paddingTop: 70 }}>
            <section style={{ padding: '60px 5%', background: 'var(--cream)' }}>
                <p className="section-label">Ta'lim</p>
                <h1 className="section-title">Barcha Kurslar</h1>
                <p className="section-sub">Boshlang'ichdan professionalga qadar — har qadamda sizni qo'llab-quvvatlaymiz.</p>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
                    {FILTERS.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setCategory(f.id)}
                            style={{
                                padding: '8px 20px', borderRadius: 20, border: '2px solid var(--wood-warm)',
                                color: category === f.id ? 'var(--white)' : 'var(--wood-warm)',
                                background: category === f.id ? 'var(--wood-warm)' : 'transparent',
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: 'pointer',
                                fontSize: '.85rem', transition: 'all .2s',
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="spinner" />
                ) : courses.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>Bu kategoriyada kurs topilmadi.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                        {courses.map(c => <CourseCard key={c.id} course={c} />)}
                    </div>
                )}
            </section>
        </div>
    );
}
