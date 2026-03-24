'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>🪵 MebelAkademiya</Link>

                <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                    <li><Link href="/kurslar" onClick={() => setMenuOpen(false)}>Kurslar</Link></li>
                    <li><Link href="/dastur" onClick={() => setMenuOpen(false)}>O'quv Dasturi</Link></li>
                    <li><Link href="/ustaxona" onClick={() => setMenuOpen(false)}>Ustaxona</Link></li>
                    <li><Link href="/ustalar" onClick={() => setMenuOpen(false)}>Ustalar</Link></li>
                    <li><Link href="/narx" onClick={() => setMenuOpen(false)}>Narxlar</Link></li>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <li><Link href="/admin" className={styles.adminLink} onClick={() => setMenuOpen(false)}>⚙️ Admin</Link></li>
                            )}
                            <li><Link href="/dashboard" onClick={() => setMenuOpen(false)}>👤 {user.name.split(' ')[0]}</Link></li>
                            <li>
                                <button className="btn btn-outline" style={{ fontSize: '.85rem', padding: '8px 18px' }} onClick={() => { logout(); setMenuOpen(false); }}>
                                    Chiqish
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link href="/register" className="btn btn-gold" onClick={() => setMenuOpen(false)}>
                                Ro'yxatdan o'tish
                            </Link>
                        </li>
                    )}
                </ul>

                <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    <span /><span /><span />
                </button>
            </div>
        </nav>
    );
}
