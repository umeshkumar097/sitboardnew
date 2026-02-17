import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: '#0f172a', color: 'white', padding: '6rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between', marginBottom: '4rem' }}>

                    {/* Brand Column */}
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px' }}></div>
                            SiteBoard
                        </div>
                        <p style={{ color: '#94a3b8', lineHeight: 1.6, maxWidth: '300px' }}>
                            The #1 Plot Inventory Management System for Indian Real Estate. Built for clarity, control, and growth.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div style={{ flex: '1 1 150px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Product</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link href="/#features" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Features</Link></li>
                            <li><Link href="/#pricing" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Pricing</Link></li>
                            <li><Link href="/blog" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Blog</Link></li>
                            <li><Link href="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Login</Link></li>
                            <li><Link href="/signup" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Get Started</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div style={{ flex: '1 1 150px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link href="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About Us</Link></li>
                            <li><Link href="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact</Link></li>
                            <li><Link href="/privacy-policy" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Privacy Policy</Link></li>
                            <li><Link href="/terms" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div style={{ flex: '1 1 250px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>Contact Us</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', color: '#cbd5e1' }}>
                                <span>📍</span>
                                <span>
                                    <strong>Aiclex Technologies</strong><br />
                                    Gaur City Mall, 8125 8th floor<br />
                                    Sec 4, Greater Noida 201318
                                </span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', color: '#cbd5e1' }}>
                                <span>📞</span>
                                <span>+91 8449488090</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', color: '#cbd5e1' }}>
                                <span>✉️</span>
                                <span>info@siteboard.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #334155', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <div>
                        © {new Date().getFullYear()} SiteBoard. content@siteboard.in
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/privacy-policy" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy</Link>
                        <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>Terms</Link>
                        <Link href="/disclaimer" style={{ color: '#64748b', textDecoration: 'none' }}>Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
