"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Course, Module, Instructor, Plan } from '@/lib/types';
import CourseCard from '@/components/CourseCard';
import HeroAiChat from '@/components/HeroAiChat';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState({ courses: [], modules: [], instructors: [], plans: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.getCourses(), api.getModules(), api.getInstructors(), api.getPlans(),
    ]).then(([coursesRes, modulesRes, instructorsRes, plansRes]) => {
      setData({
        courses: coursesRes.status === 'fulfilled' ? coursesRes.value : [],
        modules: modulesRes.status === 'fulfilled' ? modulesRes.value : [],
        instructors: instructorsRes.status === 'fulfilled' ? instructorsRes.value : [],
        plans: plansRes.status === 'fulfilled' ? plansRes.value : [],
      });
      setLoading(false);
    });
  }, []);

  const { courses, instructors, plans } = data;

  // 1 ta kurs har bir kategoriyadan
  const CATEGORIES = ['boshlangich', 'professional', 'dizayn', 'restoratsiya'];
  const featuredCourses: Course[] = CATEGORIES.map(cat =>
    (courses as Course[]).find((c: Course) => c.category === cat)
  ).filter(Boolean) as Course[];

  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#2C1810 0%,#6B3A2A 100%)', display: 'flex', alignItems: 'center', padding: '100px 5% 60px', color: '#FEFCF9', gap: 48 }}>
        {/* Left: text */}
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,137,58,.2)', border: '1px solid #C9893A', color: '#C9893A', padding: '6px 16px', borderRadius: 20, fontSize: '.8rem', fontWeight: 600, marginBottom: 20 }}>
            🏆 O'zbekistondagi #1 Mebel Akademiyasi
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem,5vw,3.5rem)', lineHeight: 1.15, marginBottom: 20 }}>
            Mebel Ustasi <span style={{ color: '#C9893A' }}>Bo'lib Chiqing</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 32, fontWeight: 300 }}>
            Klassik mebeldan zamonaviy dizayngacha — professional ustalarda o'rganing, sertifikat oling va karyerangizni boshlang.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href="/kurslar" className="btn btn-gold">Kurslarni ko'rish →</Link>
            <Link href="/dastur" className="btn btn-outline">Dastur haqida</Link>
          </div>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {[['1,240+', 'Bitiruvchilar'], ['38', 'Kurslar'], ['97%', 'Ish topganlar']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#C9893A' }}>{num}</div>
                <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: AI Chat */}
        <div style={{ flex: '1 1 400px', minWidth: 0, maxWidth: 500 }}>
          <HeroAiChat />
        </div>
      </section>

      {/* FEATURED COURSES - 4 kategoriya */}
      <section style={{ padding: '80px 5%', background: 'var(--cream)' }}>
        <p className="section-label">Ta'lim</p>
        <h2 className="section-title">Yo'nalishlar</h2>
        <p className="section-sub">4 ta asosiy yo'nalishimiz — har biridan 1 ta kurs bilan tanishing.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 28, marginBottom: 40, maxWidth: 1200, margin: '0 auto 40px' }}>
          {loading
            ? <div style={{ color: '#888' }}>Yuklanmoqda...</div>
            : featuredCourses.length > 0
              ? featuredCourses.map((c: Course) => <CourseCard key={c.id} course={c} />)
              : <div style={{ color: '#888' }}>Hozircha kurslar yo'q</div>}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="/kurslar" className="btn btn-dark">Barcha kurslarni ko'rish →</Link>
        </div>
      </section>

      {/* INSTRUCTORS PREVIEW */}
      <section style={{ padding: '80px 5%', background: 'var(--white)', textAlign: 'center' }}>
        <p className="section-label">Jamoamiz</p>
        <h2 className="section-title">Ustalarimiz</h2>
        <p className="section-sub">Sohasining eng yaxshi mutaxassislari sizni o'qitadi.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 40, maxWidth: 1100, margin: '0 auto 40px' }}>
          {loading ? <div style={{ color: '#888' }}>Yuklanmoqda...</div> : instructors.length > 0 ? (instructors as Instructor[]).map((inst: Instructor) => (
            <div key={inst.id} className="card" style={{ padding: '32px 24px', textAlign: 'center', width: 220, flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 16px', background: inst.avatar_color }}>
                {inst.emoji}
              </div>
              <h3 style={{ color: 'var(--wood-dark)', fontSize: '1.05rem', marginBottom: 6 }}>{inst.name}</h3>
              <p style={{ color: 'var(--wood-warm)', fontSize: '.85rem', marginBottom: 8 }}>{inst.role}</p>
              <p style={{ color: '#888', fontSize: '.82rem', marginBottom: 8 }}>{inst.experience}</p>
              <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '.9rem' }}>⭐ {inst.rating}</div>
            </div>
          )) : <div style={{ color: '#888' }}>Hozircha ustalar yo'q</div>}
        </div>
        <Link href="/ustalar" className="btn btn-dark">Barcha ustalarni ko'rish →</Link>
      </section>

      {/* PRICING PREVIEW */}
      <section style={{ padding: '80px 5%', background: 'var(--wood-dark)' }}>
        <p className="section-label" style={{ color: 'var(--gold)' }}>Reja</p>
        <h2 className="section-title section-title-light">Narxlar</h2>
        <p className="section-sub section-sub-light">O'zingizga mos rejani tanlang.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24, maxWidth: 900, margin: '0 auto', minHeight: 200 }}>
          {loading ? <div style={{ color: '#888' }}>Yuklanmoqda...</div> : plans.length > 0 ? (plans as Plan[]).map((p: Plan) => (
            <div key={p.id} style={{ background: p.is_featured ? 'rgba(201,137,58,.1)' : 'rgba(255,255,255,.06)', border: `2px solid ${p.is_featured ? 'var(--gold)' : 'rgba(255,255,255,.1)'}`, borderRadius: 20, padding: '36px 28px', position: 'relative' }}>
              {p.is_featured && <div className="badge-featured">💎 Mashhur</div>}
              <div style={{ color: 'rgba(255,255,255,.7)', fontSize: '.85rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>{p.name}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--white)', marginBottom: 4 }}>
                {p.price.toLocaleString()} so'm<span style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.5)', fontWeight: 400 }}> /oy</span>
              </div>
              <ul style={{ listStyle: 'none', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.features.map((f: string, i: number) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,.75)', fontSize: '.88rem', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-gold" style={{ width: '100%', borderRadius: 10 }}>Boshlash</Link>
            </div>
          )) : <div style={{ color: '#888' }}>Hozircha rejalar yo'q</div>}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 5%', background: 'linear-gradient(135deg,var(--wood-warm),var(--wood-dark))', textAlign: 'center', color: 'var(--white)' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: 16 }}>Bugun Boshlashga Tayyor Misiz?</h2>
        <p style={{ color: 'rgba(255,255,255,.75)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Minglab talabalar allaqachon karyeralarini o'zgartirdi. Keyingi navbat sizniki!
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-gold">Bepul sinov boshlash</Link>
          <a href="tel:+998901234567" className="btn btn-outline">📞 Qo'ng'iroq qilish</a>
        </div>
      </section>
    </>
  );
}
