import { Course } from '@/lib/types';
import Link from 'next/link';

export default function CourseCard({ course }: { course: Course }) {
    const priceLabel = course.price === 0 ? 'Bepul' : `${course.price.toLocaleString()} so'm`;
    const isFree = course.price === 0;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
                height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.5rem', background: course.bg_gradient,
            }}>
                {course.emoji}
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="badge-level" style={{ background: `${course.level_color}22`, color: course.level_color, marginBottom: 12 }}>
                    {course.level}
                </span>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--wood-dark)', marginBottom: 8 }}>{course.title}</h3>
                {course.description && (
                    <p style={{ color: '#888', fontSize: '.82rem', lineHeight: 1.5, marginBottom: 10, flexGrow: 1 }}>
                        {course.description}
                    </p>
                )}
                <div style={{ display: 'flex', gap: 16, color: '#888', fontSize: '.8rem', marginBottom: 16 }}>
                    <span>⏱ {course.hours} soat</span>
                    <span>📚 {course.lessons} dars</span>
                    <span>⭐ {course.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: isFree ? '#2a7a4b' : 'var(--wood-warm)' }}>
                        {priceLabel}
                    </span>
                    <Link href={`/kurslar/${course.id}`} className="btn btn-gold" style={{ fontSize: '.82rem', padding: '8px 18px' }}>
                        Batafsil
                    </Link>
                </div>
            </div>
        </div>
    );
}
