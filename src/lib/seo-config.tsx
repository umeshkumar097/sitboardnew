import React from 'react';

export interface SeoFeature {
    title: string;
    description: string;
    icon: string;
}

export interface SeoFaq {
    question: string;
    answer: string;
}

export interface SeoConfig {
    title: string;
    description: string;
    headline: React.ReactNode;
    subheadline: string;
    features: SeoFeature[]; // JSON based rich features
    benefits: string[];
    ctaText?: string;
    faqs: SeoFaq[];
}

export const KEYWORD_CONFIG: Record<string, SeoConfig> = {
    'real-estate-crm-software': {
        title: 'Best Real Estate CRM Software in India | SiteBoard',
        description: 'Boost your sales with the top-rated Real Estate CRM Software. Track leads, manage bookings, and close deals faster with SiteBoard.',
        headline: <>
            The Ultimate <br />
            Real Estate CRM.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Built for Growth.</span>
        </>,
        subheadline: 'Stop losing leads to messy spreadsheets. Use the Real Estate CRM Software that gives you 100% control over your sales pipeline.',
        features: [
            { title: 'Automated Lead Capture', description: 'Automatically capture leads from Facebook, Google, and 99Acres directly into your CRM.', icon: '⚡' },
            { title: 'Sales Performance', description: 'Track every call, meeting, and site visit. Know exactly which salesperson is performing.', icon: '📊' },
            { title: 'Instant Follow-ups', description: 'Send automated WhatsApp and Email greetings immediately when a lead inquires.', icon: '💬' },
            { title: 'Booking Management', description: 'Convert leads to bookings with a single click. Generate booking forms instantly.', icon: '📝' },
            { title: 'Inventory Status', description: 'Real-time view of available, booked, and sold plots to prevent double-selling.', icon: '🗺️' },
            { title: 'Mobile App', description: 'Access your entire CRM from anywhere with our dedicated mobile application.', icon: '📱' }
        ],
        benefits: [
            'Respond to leads instantly',
            'Never double-book a plot',
            'Track every salesperson\'s activity',
            'Close deals 3x faster'
        ],
        ctaText: 'Get Free CRM Demo',
        faqs: [
            { question: 'Does this CRM integrate with Facebook Ads?', answer: 'Yes, SiteBoard integrates directly with Facebook Lead Ads, so new leads appear instantly in your dashboard.' },
            { question: 'Can I track my sales team\'s calls?', answer: 'Absolutely. You can log calls, schedule follow-ups, and see daily activity reports for every team member.' },
            { question: 'Is it suitable for small builders?', answer: 'Yes! We have plans tailored for small developers with just one project, as well as large enterprise features.' }
        ]
    },
    'real-estate-management-software': {
        title: 'Top Real Estate Management Software | SiteBoard',
        description: 'Simplify your operations with our all-in-one Real Estate Management Software. Property tracking, booking management, and more.',
        headline: <>
            Smart Real Estate <br />
            Management Software.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total Control.</span>
        </>,
        subheadline: 'Manage your projects, inventory, and team from one place. The Real Estate Management Software that adapts to your workflow.',
        features: [
            { title: 'Project Timeline', description: 'Track development progress, milestones, and completion dates for all your layouts.', icon: '📅' },
            { title: 'Inventory Control', description: 'Centralized management of all plots, flats, and villas across multiple locations.', icon: '🏗️' },
            { title: 'Document Vault', description: 'Store all legal documents, agreements, and customer KYC in one secure cloud vault.', icon: '🔒' },
            { title: 'Role-Based Access', description: 'Give specific access rights to accountants, sales managers, and agents.', icon: '👥' },
            { title: 'Payment Tracking', description: 'Monitor pending payments, upcoming installments, and total revenue collected.', icon: '💰' },
            { title: 'Multi-Project View', description: 'Switch between different projects seamlessly from a single admin account.', icon: '🏢' }
        ],
        benefits: [
            'Centralize all project data',
            'Eliminate paperwork & confusion',
            'Secure your business data',
            'Scale to multiple locations'
        ],
        ctaText: 'Start Managing Better',
        faqs: [
            { question: 'Can I manage multiple projects?', answer: 'Yes, SiteBoard is designed for multi-project management. You can switch between projects with one click.' },
            { question: 'Is my data secure?', answer: 'We use bank-grade encryption to ensure your customer data and pricing strategies remain 100% private.' },
            { question: 'Do you offer support?', answer: 'We provide dedicated account managers and priority support to ensure your operations run smoothly.' }
        ]
    },
    'real-estate-erp-software-india': {
        title: 'Leading Real Estate ERP Software in India | SiteBoard',
        description: 'SiteBoard is the preferred Real Estate ERP Software in India for developers and builders. End-to-end management for plotted developments.',
        headline: <>
            #1 Real Estate ERP <br />
            Software in India.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Indian Realty Ready.</span>
        </>,
        subheadline: 'Designed specifically for the Indian market. Our Real Estate ERP Software handles GST, RERA compliance, and local workflow needs.',
        features: [
            { title: 'GST Invoicing', description: 'Generate GST-compliant tax invoices for booking amounts and installments automatically.', icon: '🧾' },
            { title: 'RERA Compliance', description: 'Tools to help you maintain data transparency and reporting as per RERA guidelines.', icon: '⚖️' },
            { title: 'Builder-Buyer Agreements', description: 'Auto-generate legal agreements populated with customer and plot details.', icon: '📜' },
            { title: 'Collection Reports', description: 'Detailed reports on daily, weekly, and monthly collections for layout developers.', icon: '📈' },
            { title: 'Agent Commission', description: 'Calculate and track agent commissions based on sales performance and slabs.', icon: '🤝' },
            { title: 'Tally Integration', description: 'Export financial data easily compatible with Tally and other accounting software.', icon: '💻' }
        ],
        benefits: [
            'Stay compliant with Indian laws',
            'Automate payment reminders',
            'Generate professional docs',
            'Simplify audit & accounts'
        ],
        ctaText: 'See ERP Features',
        faqs: [
            { question: 'Is this software GST compliant?', answer: 'Yes, all invoices and financial reports generated are fully GST compliant.' },
            { question: 'Does it help with RERA audits?', answer: 'SiteBoard maintains organized digital records of inventory and bookings, which significantly simplifies RERA reporting.' },
            { question: 'Can I generate demand letters?', answer: 'Yes, the system can automatically generate and email demand letters for due payments.' }
        ]
    },
    'best-real-estate-management-software': {
        title: 'Best Real Estate Management Software for Developers',
        description: 'Discover why SiteBoard is voted the Best Real Estate Management Software. Visual inventory, instant booking, and seamless team collaboration.',
        headline: <>
            Experience the <br />
            Best Real Estate<br />
            Management Software.
        </>,
        subheadline: 'Don\'t settle for generic tools. Choose the Best Real Estate Management Software built explicitly for layout and plot developers.',
        features: [
            { title: 'Interactive Map', description: 'Best-in-class visual map that updates in real-time for all users.', icon: '🗺️' },
            { title: 'Speed & Performance', description: 'Built on modern tech for blazing fast load times even with large layouts.', icon: '🚀' },
            { title: 'User Experience', description: 'Award-winning interface that requires zero training for your staff.', icon: '✨' },
            { title: 'Conflict Resolution', description: 'Smart locking prevents two agents from booking the same plot simultaneously.', icon: '🛡️' },
            { title: 'Custom Reports', description: 'Build your own reports to analyze the metrics that matter to you.', icon: '📊' },
            { title: 'Cloud Backup', description: 'Automatic daily backups ensure you never lose critical business data.', icon: '☁️' }
        ],
        benefits: [
            'Impress clients with tech',
            'Empower agents on the field',
            'Zero manual errors',
            'Best-in-class support'
        ],
        ctaText: 'Try The Best Software',
        faqs: [
            { question: 'Why is SiteBoard considered the best?', answer: 'Our focus on "Plot Management" specifically for layout developers sets us apart from generic CRMs.' },
            { question: 'How long does implementation take?', answer: 'You can go live in less than 24 hours. Just upload your layout map and start booking.' },
            { question: 'Is training provided?', answer: 'Yes, although the software is intuitive, we provide full onboarding training for your team.' }
        ]
    },
    'best-real-estate-crm-software-in-india': {
        title: 'Best Real Estate CRM Software in India | SiteBoard',
        description: 'Maximize efficiency with the Best Real Estate CRM Software in India. tailored for Indian builders to streamline sales and inventory.',
        headline: <>
            India's Choice for <br />
            Best Real Estate CRM.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Sales Automated.</span>
        </>,
        subheadline: 'Join top developers using the Best Real Estate CRM Software in India to transform their sales operations.',
        features: [
            { title: 'Lead Centralization', description: 'One dashboard for MagicBricks, 99Acres, Facebook, and Walk-in leads.', icon: '🎯' },
            { title: 'WhatsApp API', description: 'Official WhatsApp Business API integration for bulk messaging and automated replies.', icon: '💬' },
            { title: 'Field Staff Tracking', description: 'Monitor location and site visits of your field sales officers.', icon: '📍' },
            { title: 'Call Recording', description: 'Option to integrate cloud telephony for recording and monitoring sales calls.', icon: '📞' },
            { title: 'Performance Leaderboard', description: 'Gamify sales with live leaderboards showing top performers.', icon: '🏆' },
            { title: 'Drip Marketing', description: 'Automated email and SMS sequences to nurture cold leads over time.', icon: '💧' }
        ],
        benefits: [
            'Capture leads from all sources',
            'Engage on WhatsApp instantly',
            'Never miss a follow-up',
            'Optimize marketing spend'
        ],
        ctaText: 'Boost Sales Now',
        faqs: [
            { question: 'Does it support Indian real estate portals?', answer: 'Yes, we have ready integrations for major Indian property portals like 99Acres, MagicBricks, and CommonFloor.' },
            { question: 'Can I send bulk WhatsApp?', answer: 'Yes, through our API integration, you can send template messages to your leads.' },
            { question: 'Is there a mobile app for sales staff?', answer: 'Yes, the SiteBoard mobile app allows your team to update leads on the go.' }
        ]
    },
    'real-estate-software-development': {
        title: 'Custom Real Estate Software Development | SiteBoard',
        description: 'Looking for Real Estate Software Development? SiteBoard offers a turnkey solution that is better than custom development. Start today.',
        headline: <>
            The Future of <br />
            Real Estate Software.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Ready to Deploy.</span>
        </>,
        subheadline: 'Skip the months of Real Estate Software Development time. SiteBoard is ready to use, feature-rich, and proven.',
        features: [
            { title: 'White Labeling', description: 'Use your own brand name, logo, and domain. Your clients see only your brand.', icon: '🏷️' },
            { title: 'API Access', description: 'Robust APIs to connect SiteBoard with your existing website or ERP.', icon: '🔌' },
            { title: 'Custom Modules', description: 'We can develop custom additional modules specific to your business logic.', icon: '🧩' },
            { title: 'Scalable Architecture', description: 'Built on AWS and Next.js to handle millions of requests without slowing down.', icon: '🏗️' },
            { title: 'Regular Updates', description: 'We push new features weekly, so your software never becomes obsolete.', icon: '🔄' },
            { title: 'Dedicated DevOps', description: 'We handle all server management, security patches, and uptime monitoring.', icon: '🛠️' }
        ],
        benefits: [
            'Launch in days, not months',
            'Save 90% vs custom dev',
            'Regular feature updates',
            'No server maintenance'
        ],
        ctaText: 'Get Ready Solution',
        faqs: [
            { question: 'Can I get a custom domain?', answer: 'Yes, you can run SiteBoard on crm.yourcompany.com.' },
            { question: 'Do you offer source code?', answer: 'We offer a SaaS model, but for large enterprise deals, we can discuss source code licensing.' },
            { question: 'Is it better than building from scratch?', answer: 'Building a CRM like SiteBoard takes 12+ months and ₹50L+. usage is instant and costs a fraction.' }
        ]
    },
    'real-estate-plot-management': {
        title: 'Advanced Real Estate Plot Management System',
        description: 'Master your inventory with our Real Estate Plot Management software. Visual layouts, live status, and error-free bookings.',
        headline: <>
            Visual Real Estate <br />
            Plot Management.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>See Every Inch.</span>
        </>,
        subheadline: 'The most intuitive Real Estate Plot Management system. Visualize availability, block units, and manage bookings on an interactive map.',
        features: [
            { title: 'Visual Layout Editor', description: 'Upload your layout map and define plot boundaries visually.', icon: '✏️' },
            { title: 'Color Coded Status', description: 'Green for Available, Yellow for Booked, Red for Sold. Instantly clear.', icon: '🎨' },
            { title: 'Odd Plot Support', description: 'Full support for irregular, corner, and odd-shaped plots common in layouts.', icon: '📐' },
            { title: 'Facing & Dimensions', description: 'Store plot details like East/West facing, exact dimensions, and PLC charges.', icon: '🧭' },
            { title: 'Inventory Export', description: 'Export your current availability list to PDF or Excel to share with agents.', icon: '📤' },
            { title: 'Pricing Slabs', description: 'Set different base prices for different blocks or plot categories.', icon: '💲' }
        ],
        benefits: [
            'Visualise entire layout',
            'Price plots accurately',
            'Share live map with clients',
            'Track sold vs unsold'
        ],
        ctaText: 'Manage Plots Visually',
        faqs: [
            { question: 'Can it handle large townships?', answer: 'Yes, SiteBoard can handle townships with thousands of plots across multiple phases.' },
            { question: 'Can I mark plots as "Mortgaged"?', answer: 'Yes, you can create custom statuses like Mortgaged, Blocked, or Reserved.' },
            { question: 'Does it work for apartments?', answer: 'While optimized for plots, it works perfectly for flat grid views as well.' }
        ]
    },
    'real-estate-software': {
        title: 'SiteBoard | Modern Real Estate Software',
        description: 'The modern Real Estate Software for forward-thinking developers. Cloud-based, mobile-friendly, and easy to use.',
        headline: <>
            Modern <br />
            Real Estate Software.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Simply Powerful.</span>
        </>,
        subheadline: 'Upgrade to Real Estate Software that actually works for you. No clunky interfaces, just smooth, efficient management.',
        features: [
            { title: 'Cloud Native', description: 'Access from any device, anywhere. No installation required.', icon: '☁️' },
            { title: 'Modern UI/UX', description: 'Clean, beautiful interface that your team will actually enjoy using.', icon: '✨' },
            { title: 'Fast Implementation', description: 'Get started in minutes. Import your existing data easily.', icon: '⏱️' },
            { title: 'Secure Access', description: 'Enterprise-grade security with encrypted connections and backups.', icon: '🔒' },
            { title: 'Team Collaboration', description: 'Comments, activity logs, and notifications keep everyone in sync.', icon: '💬' },
            { title: 'Analytics Dashboard', description: 'Powerful insights into your sales velocity and revenue trends.', icon: '📊' }
        ],
        benefits: [
            'Work from anywhere',
            'No training required',
            'Modern tech stack',
            'Reliable uptime'
        ],
        ctaText: 'Upgrade Your Software',
        faqs: [
            { question: 'Do I need to install anything?', answer: 'No, SiteBoard is 100% cloud-based. You just need a web browser.' },
            { question: ' Does it work on Mac?', answer: 'It works on Mac, Windows, Android, iPhone, and tablets seamlessly.' },
            { question: 'Can I import my Excel data?', answer: 'Yes, we provide bulk import tools to migrate your existing data quickly.' }
        ]
    }
};
