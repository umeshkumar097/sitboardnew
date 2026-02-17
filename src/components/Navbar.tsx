import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <BrandLogo className="w-8 h-8" textClassName="text-xl" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link href="/#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }} className="hidden md:block">Features</Link>
                    <Link href="/#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }} className="hidden md:block">FAQ</Link>
                    <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }} className="hidden md:block">Blog</Link>
                    <Link href="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', marginRight: '0.5rem' }}>Login</Link>
                    <Link href="/#signup" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                        Get Early Access
                    </Link>
                </div>
            </div>
        </nav>
    );
}
