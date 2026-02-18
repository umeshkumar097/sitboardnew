import Link from 'next/link';
import SignupForm from '@/components/SignupForm';
import PricingSection from '@/components/PricingSection';
import BrandLogo from '@/components/BrandLogo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SeoFeature {
    title: string;
    description: string;
    icon: string;
}

interface SeoFaq {
    question: string;
    answer: string;
}

interface LandingPageProps {
    headline?: React.ReactNode;
    subheadline?: string;
    source?: string;
    features?: SeoFeature[];
    benefits?: string[];
    ctaText?: string;
    faqs?: SeoFaq[];
    blogs?: any[]; // specific type should be defined but any is ok for now if interface not available
}

export default function LandingPageTemplate({
    headline,
    subheadline,
    source = 'home',
    features,
    benefits,
    ctaText = 'Get Early Access',
    faqs,
    blogs
}: LandingPageProps) {
    return (
        <main style={{ overflowX: 'hidden' }}>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="section-hero">
                <div className="container grid-2" style={{ alignItems: 'center' }}>

                    {/* Hero Content */}
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 16px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #dbeafe'
                        }}>
                            <span style={{ marginRight: '8px' }}>🚀</span> {source === 'home' ? 'Pre-Launch Access' : 'Top Rated Software'}
                        </div>

                        <h1 className="text-gradient" style={{ marginBottom: '1.5rem' }}>
                            {headline || (
                                <>
                                    India's Best <br />
                                    Real Estate CRM.<br />
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Zero Chaos.</span>
                                </>
                            )}
                        </h1>

                        <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px', color: 'var(--text-muted)' }}>
                            {subheadline || (
                                <>
                                    Stop managing multi-crore projects on WhatsApp and Excel.
                                    Give your sales team a <strong>live, visual dashboard</strong> of every plot's status.
                                </>
                            )}
                        </p>

                        {/* Dynamic Benefits Checkmarks (visible if key benefits provided) */}
                        {benefits && (
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem' }}>
                                {benefits.map((benefit, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 500, color: '#334155' }}>
                                        <div style={{ minWidth: '24px', height: '24px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: '14px' }}>✓</div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Only show buttons if NOT a landing page (source=='home'), otherwise form is on the right */}
                        {source === 'home' && (
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link href="#signup" className="btn btn-primary" style={{ minWidth: '180px' }}>
                                    Start Free Trial
                                </Link>
                                <Link href="#features" className="btn btn-secondary" style={{ minWidth: '180px' }}>
                                    See Features
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Signup Form (for landing pages) OR Visual (for home) */}
                    <div>
                        {source !== 'home' ? (
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>{ctaText}</h3>
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill the form below to get instant access.</p>
                                <SignupForm source={source} />
                            </div>
                        ) : (
                            <div className="dashboard-container">
                                <div className="mockup-header">
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <div className="traffic-light traffic-red"></div>
                                        <div className="traffic-light traffic-yellow"></div>
                                        <div className="traffic-light traffic-green"></div>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                                        app.siteboard.in
                                    </div>
                                </div>
                                <div className="mockup-body">
                                    <div className="mockup-sidebar">
                                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '1rem' }}>Green Valley</div>
                                        <div className="sidebar-item sidebar-item-primary"></div>
                                        <div className="sidebar-item"></div>
                                        <div className="sidebar-item"></div>
                                    </div>
                                    <div className="mockup-main">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                                            <div style={{ fontWeight: 700, fontSize: '18px' }}>Phase 1 Layout</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '10px', padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontWeight: 600 }}>12 Available</span>
                                                <span style={{ fontSize: '10px', padding: '4px 8px', background: '#fef9c3', color: '#854d0e', borderRadius: '4px', fontWeight: 600 }}>8 Booked</span>
                                            </div>
                                        </div>

                                        <div className="mockup-grid">
                                            {Array.from({ length: 24 }).map((_, i) => {
                                                let statusClass = 'pl-available';
                                                if ([1, 4, 5, 12, 15, 20].includes(i)) statusClass = 'pl-booked';
                                                if ([2, 6, 7, 8, 18].includes(i)) statusClass = 'pl-sold';

                                                return (
                                                    <div key={i} className={`plot-cell ${statusClass}`} style={{
                                                        backgroundColor: statusClass === 'pl-available' ? 'white' : undefined
                                                    }}>
                                                        {101 + i}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* Trust Section */}
            <section style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)' }}>
                <div className="container text-center">
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-light)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        Powering Sales for Modern Developers
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.5, filter: 'grayscale(1)' }}>
                        <h3 style={{ margin: 0 }}>SKYLINE</h3>
                        <h3 style={{ margin: 0 }}>APEX GROUP</h3>
                        <h3 style={{ margin: 0 }}>TERRA INFRA</h3>
                        <h3 style={{ margin: 0 }}>URBAN SPACE</h3>
                    </div>
                </div>
            </section>

            {/* Detailed Features Section */}
            <section id="features" style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Comprehensive {source === 'home' ? 'Real Estate ERP' : 'Software'} Features</h2>
                        <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
                            Everything you need to manage your {source === 'home' ? 'real estate business' : 'projects'} efficiently.
                        </p>
                    </div>

                    {/* Feature 1: Visual Map (Highlight) - Always show as it's core */}
                    <div className="grid-2" style={{ alignItems: 'center', marginBottom: '6rem' }}>
                        <div>
                            <div style={{ display: 'inline-block', padding: '4px 12px', background: '#eff6ff', color: '#2563eb', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>
                                MOST IMPORTANT FEATURE
                            </div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Visual Plot Map</h3>
                            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                                Stop guessing. See your entire project in a clear grid format. Anyone can instantly see plot status without asking or calling.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ width: '16px', height: '16px', background: '#dcfce7', border: '1px solid #166534', borderRadius: '4px', marginRight: '1rem' }}></div>
                                    <span><strong>Green:</strong> Available for sale</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ width: '16px', height: '16px', background: '#fef9c3', border: '1px solid #854d0e', borderRadius: '4px', marginRight: '1rem' }}></div>
                                    <span><strong>Yellow:</strong> Booked (Advance received)</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ width: '16px', height: '16px', background: '#fee2e2', border: '1px solid #991b1b', borderRadius: '4px', marginRight: '1rem' }}></div>
                                    <span><strong>Red:</strong> Sold (Registry complete)</span>
                                </li>
                            </ul>
                        </div>
                        {/* Visual Mini-Map */}
                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} style={{
                                        aspectRatio: '1',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: i === 5 ? '#fef9c3' : (i === 2 || i === 8 ? '#fee2e2' : 'white'),
                                        color: i === 5 ? '#854d0e' : (i === 2 || i === 8 ? '#991b1b' : '#64748b'),
                                        border: '1px solid',
                                        borderColor: i === 5 ? '#fde047' : (i === 2 || i === 8 ? '#fecaca' : '#e2e8f0')
                                    }}>
                                        {101 + i}
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                👆 Updates instantly for every team member
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Core Features Grid */}
                    {features && features.length > 0 ? (
                        <div className="grid-3" style={{ gap: '2rem' }}>
                            {features.map((feature, i) => (
                                <div key={i} className="feature-card">
                                    <div className="icon-box">{feature.icon}</div>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Fallback static features if no prop provided (e.g. Home page default)
                        <div className="grid-3" style={{ gap: '2rem' }}>
                            <div className="feature-card">
                                <div className="icon-box">🏢</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Company-Level Control</h4>
                                <p>Each real estate company gets its own private system. Your data is never shared. You have full control over your projects.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-box">📍</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Project-Wise Management</h4>
                                <p>Organize multiple sites easily. Create projects location-wise. You can activate or deactivate projects anytime.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-box">🔒</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Zero Double Booking</h4>
                                <p>A plot must move step-by-step: Available → Booked → Sold. Once sold, it is locked. Double booking is impossible.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-box">📝</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Booking Management</h4>
                                <p>Capture client name, agent, and date at booking. If cancelled, the plot automatically becomes available again.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-box">👀</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Agent View-Only Access</h4>
                                <p>Agents can view prices and availability via their own login, but they cannot change anything. Prevents confusion.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-box">👑</div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Owner Admin Control</h4>
                                <p>Only the admin can update statuses. As the owner, you always know the truth without depending on agent reports.</p>
                            </div>
                        </div>
                    )}

                    {/* Quick List */}
                    <div style={{ marginTop: '4rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-muted)' }}>
                        <span>👉 Sale Tracking History</span>
                        <span>👉 Instant Click Details</span>
                        <span>👉 Secure Role-Based Access</span>
                    </div>

                </div>
            </section>

            {/* Business Benefits Section */}
            <section style={{ padding: '6rem 0', background: '#f0f9ff' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Why Business Owners Switch to SiteBoard</h2>

                        <div className="grid-2" style={{ gap: '1.5rem' }}>
                            {[
                                "Saves daily phone calls answering 'Is this available?'",
                                "Removes dependency on messy Excel sheets and registers",
                                "Builds trust with customers by showing a professional system",
                                "Prevents disputes between agents over double bookings",
                                "Gives owners peace of mind with 100% visibility",
                                "Helps sales teams work faster and cleaner"
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd' }}>
                                    <div style={{ color: '#0284c7', fontWeight: 'bold', fontSize: '1.25rem' }}>✓</div>
                                    <p style={{ margin: 0, fontWeight: 500, color: '#334155' }}>{benefit}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
                                “This system is built to bring clarity, control, and confidence to real estate businesses.”
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases - Dark Section */}
            <section className="section-dark">
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                        <h2>Built for Indian Real Estate</h2>
                        <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>Whether you are a builder with 5 towering projects or a land developer with 200 plots, SiteBoard adapts to your scale.</p>
                    </div>

                    <div className="grid-2">
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ color: 'white' }}>For Land Developers</h3>
                            <p style={{ color: '#cbd5e1' }}>Manage plotted developments with ease. Visualise odd-shaped plots and corner plots clearly on the visual board.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ color: 'white' }}>For Channel Partners</h3>
                            <p style={{ color: '#cbd5e1' }}>Get a master view of inventory across multiple builders. Never call to ask availability again.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" style={{ padding: '6rem 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>

                    {faqs && faqs.length > 0 ? (
                        faqs.map((faq, i) => (
                            <details key={i} className="faq-item">
                                <summary className="faq-summary">{faq.question} <span>+</span></summary>
                                <div className="faq-content">
                                    {faq.answer}
                                </div>
                            </details>
                        ))
                    ) : (
                        // Fallback static FAQs
                        <>
                            <details className="faq-item">
                                <summary className="faq-summary">What makes SiteBoard the best real estate software? <span>+</span></summary>
                                <div className="faq-content">
                                    SiteBoard is a dedicated Real Estate CRM Software designed for Indian developers. Unlike generic tools, it offers specialized plot management, making it the best real estate management software for layout developers.
                                </div>
                            </details>

                            <details className="faq-item">
                                <summary className="faq-summary">Does it prevent double bookings? <span>+</span></summary>
                                <div className="faq-content">
                                    Yes. Once a plot is marked 'Booked', it is instantly locked for all other agents, preventing any collaborative errors.
                                </div>
                            </details>

                            <details className="faq-item">
                                <summary className="faq-summary">Is my data secure? <span>+</span></summary>
                                <div className="faq-content">
                                    Absolutely. We use enterprise-grade encryption and daily backups. Your customer data and pricing strategies are 100% private.
                                </div>
                            </details>

                            <details className="faq-item">
                                <summary className="faq-summary">How much does it cost? <span>+</span></summary>
                                <div className="faq-content">
                                    We are currently in a private pre-launch phase. Early access partners get exclusive lifetime pricing. Request access to learn more.
                                </div>
                            </details>
                        </>
                    )}
                </div>
            </section>

            {/* Signup CTA */}
            <section id="signup" style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
                <div className="container grid-2" style={{ alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Secure Pre-Launch Access</h2>
                        <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                            We are onboarding a limited number of developers this month.
                            Join now to lock in early-bird benefits and premium support.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                            {['Priority Onboarding', 'Founder Support', 'Lifetime Pricing Lock'].map(item => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontWeight: 500 }}>
                                    <div style={{ width: '24px', height: '24px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', fontSize: '12px' }}>✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <SignupForm source={source} />
                    </div>
                </div>
            </section>


            {/* Free Tools Section */}
            <section style={{ padding: '6rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-block', padding: '4px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                            FREE UTILITIES
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Tools for Real Estate Success</h2>
                        <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
                            Use our free calculators to plan your finances and commissions accurately.
                        </p>
                    </div>

                    <div className="grid-2" style={{ gap: '2rem' }}>
                        {/* EMI Calculator Card */}
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🧮</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Home Loan EMI Calculator</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem', flex: 1 }}>
                                Accurately calculate your monthly EMI, total interest, and pay-off amount. Plan your home purchase with confidence.
                            </p>
                            <Link href="/tools/emi-calculator" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                                Calculate EMI →
                            </Link>
                        </div>

                        {/* Commission Calculator Card */}
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Brokerage Commission Calculator</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem', flex: 1 }}>
                                Instantly calculate your net commission earnings after TDS deductions. Essential for agents and channel partners.
                            </p>
                            <Link href="/tools/commission-calculator" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                                Calculate Commission →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Blogs Section */}
            {blogs && blogs.length > 0 && (
                <section style={{ padding: '6rem 0', background: 'white' }}>
                    <div className="container">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Latest Updates</h2>
                        <div className="grid-3" style={{ gap: '2rem' }}>
                            {blogs.map((blog: any) => (
                                <Link href={`/blog/${blog.slug}`} key={blog.id} style={{ textDecoration: 'none', color: 'inherit' }} className="group">
                                    <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                        <div style={{ aspectRatio: '16/9', background: '#f1f5f9', overflow: 'hidden' }}>
                                            {blog.featured_image ? (
                                                <img src={blog.featured_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                    📰
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                                {new Date(blog.published_at).toLocaleDateString()}
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4 }}>{blog.title}</h3>
                                            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                                                {blog.excerpt || 'Read more...'}
                                            </p>
                                            <div style={{ marginTop: '1.5rem', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
                                                Read Article →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <Link href="/blog" className="btn btn-secondary">
                                View All Articles
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Section */}
            <PricingSection />

            {/* Footer */}
            <Footer />
        </main>
    );
}
