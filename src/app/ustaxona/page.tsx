import Image from 'next/image';
import Link from 'next/link';

export default function UstaxonaPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'var(--white)', padding: '120px 5% 80px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <p className="section-label">Ustaxona</p>
                <h1 className="section-title">Bizning Ustaxonamiz</h1>
                <p className="section-sub">
                    Amaliyot – eng zo'r ustoz! Zamonaviy asbob-uskunalar va haqiqiy yog'och ishlari muhiti bilan jihozlangan ustaxonamizda professionaldek ishlashni o'rganasiz.
                </p>
                <div style={{ marginTop: 24 }}>
                    <Link href="/kurslar" className="btn btn-gold">
                        Joyni band qilish →
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div style={{ maxWidth: 1100, margin: '0 auto', background: 'var(--cream)', borderRadius: 24, padding: '48px', border: '1px solid rgba(201,137,58,0.2)', boxShadow: '0 12px 32px rgba(44,24,16,0.06)' }}>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>

                    {/* Features List */}
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", color: 'var(--wood-dark)', marginBottom: 24 }}>
                            Nimalar kutmoqda?
                        </h2>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ fontSize: '2rem', background: 'var(--white)', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                    🪚
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--wood-dark)', fontSize: '1.1rem', marginBottom: 4 }}>Zamonaviy Arralar</strong>
                                    <span style={{ color: '#666', fontSize: '.9rem', lineHeight: 1.5 }}>Nemis va yapon texnologiyalaridagi shovqinsiz va xavfsiz elektromexanik arralar.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ fontSize: '2rem', background: 'var(--white)', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                    🪵
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--wood-dark)', fontSize: '1.1rem', marginBottom: 4 }}>Yuqori Sifatli Yog'ochlar</strong>
                                    <span style={{ color: '#666', fontSize: '.9rem', lineHeight: 1.5 }}>Eman, yong'oq, archa kabi yuqori sifatli materiallar o'quvchilar ixtiyoriga beriladi.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ fontSize: '2rem', background: 'var(--white)', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                    🧰
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--wood-dark)', fontSize: '1.1rem', marginBottom: 4 }}>Shaxsiy Asboblar To'plami</strong>
                                    <span style={{ color: '#666', fontSize: '.9rem', lineHeight: 1.5 }}>Har bir o'quvchi boshlang'ich amaliyot uchun o'z shaxsiy asbob-uskuna stoliga ega bo'ladi.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Gallery Placeholder */}
                    <div style={{ flex: '1 1 400px', alignSelf: 'stretch' }}>
                        <div style={{
                            height: '100%', minHeight: 320, width: '100%', borderRadius: 16,
                            background: 'linear-gradient(135deg, rgba(44,24,16,0.8), rgba(44,24,16,0.95))',
                            border: '4px solid var(--white)', boxShadow: '0 12px 32px rgba(44,24,16,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", color: 'var(--gold)', marginBottom: 8 }}>
                                    Workshop Gallery
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.9rem', fontWeight: 300 }}>
                                    Fotogalereya tez orada yuklanadi
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Visit Banner */}
            <div style={{ maxWidth: 900, margin: '64px auto 0', textAlign: 'center', background: 'linear-gradient(135deg, var(--wood-warm), var(--wood-dark))', color: 'var(--white)', padding: '48px 32px', borderRadius: 24, boxShadow: '0 16px 40px rgba(160,82,45,0.2)' }}>
                <h2 style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", color: 'var(--gold)', marginBottom: 16 }}>
                    Ustaxonamizga Sayohat
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 24px' }}>
                    Mebel kurslarimizga yozilishdan oldin ustaxonamizni ko'zdan kechirish va o'quv jarayonlari bilan yaqindan tanishish uchun ochiq eshiklar kuniga tashrif buyuring.
                </p>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: 12 }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--white)' }}>
                        Har Shanba <span style={{ color: 'var(--gold)', margin: '0 6px' }}>|</span> 14:00 da
                    </p>
                </div>
            </div>
        </main>
    );
}
