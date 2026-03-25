import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: '#1a0d08', padding: '60px 5% 24px', color: 'rgba(255,255,255,.7)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px', marginBottom: '48px' }}>
                <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", color: 'var(--white)', fontSize: '1.4rem' }}>🪵 MebelAkademiya</div>
                    <p style={{ fontSize: '.85rem', lineHeight: 1.7, marginTop: '12px', fontWeight: 300 }}>
                        O'zbekistondagi #1 mebel ishlab chiqarish maktabi. Professional ta'lim, amaliy mashg'ulotlar va sertifikat.
                    </p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--white)', marginBottom: '16px', fontSize: '.95rem' }}>Kurslar</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {["Boshlang'ich", "Professional", "Dizayn", "Restoratsiya"].map(c => (
                            <li key={c}><Link href="/kurslar" style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem', transition: 'color .2s' }}>{c}</Link></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 style={{ color: 'var(--white)', marginBottom: '16px', fontSize: '.95rem' }}>Akademiya</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[['O\'quv Dasturi', '/dastur'], ['Ustalar', '/ustalar'], ['Narxlar', '/narx'], ['Dashboard', '/dashboard']].map(([l, h]) => (
                            <li key={l}><Link href={h} style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem' }}>{l}</Link></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 style={{ color: 'var(--white)', marginBottom: '16px', fontSize: '.95rem' }}>Aloqa</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li><a href="tel:+998901234567" style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem' }}>+998 90 123 45 67</a></li>
                        <li><a href="mailto:info@mebelakademiya.uz" style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem' }}>info@mebelakademiya.uz</a></li>
                        <li style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem' }}>Toshkent, Chilonzor</li>
                        <li style={{ color: 'rgba(255,255,255,.6)', fontSize: '.85rem' }}>Du-Sha: 9:00 – 18:00</li>
                    </ul>
                </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ fontSize: '.82rem' }}>© 2024 MebelAkademiya. Barcha huquqlar himoyalangan.</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {['Maxfiylik', 'Shartlar', 'Sitemap'].map(l => (
                        <a key={l} href="#" style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>{l}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
