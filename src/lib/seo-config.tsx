export interface SeoConfig {
    title: string;
    description: string;
    headline: React.ReactNode;
    subheadline: string;
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
        subheadline: 'Stop losing leads to messy spreadsheets. Use the Real Estate CRM Software that gives you 100% control over your sales pipeline.'
    },
    'real-estate-management-software': {
        title: 'Top Real Estate Management Software | SiteBoard',
        description: 'Simplify your operations with our all-in-one Real Estate Management Software. Property tracking, booking management, and more.',
        headline: <>
            Smart Real Estate <br />
            Management Software.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total Control.</span>
        </>,
        subheadline: 'Manage your projects, inventory, and team from one place. The Real Estate Management Software that adapts to your workflow.'
    },
    'real-estate-erp-software-india': {
        title: 'Leading Real Estate ERP Software in India | SiteBoard',
        description: 'SiteBoard is the preferred Real Estate ERP Software in India for developers and builders. End-to-end management for plotted developments.',
        headline: <>
            #1 Real Estate ERP <br />
            Software in India.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Indian Realty Ready.</span>
        </>,
        subheadline: 'Designed specifically for the Indian market. Our Real Estate ERP Software handles GST, RERA compliance, and local workflow needs.'
    },
    'best-real-estate-management-software': {
        title: 'Best Real Estate Management Software for Developers',
        description: 'Discover why SiteBoard is voted the Best Real Estate Management Software. Visual inventory, instant booking, and seamless team collaboration.',
        headline: <>
            Experience the <br />
            Best Real Estate<br />
            Management Software.
        </>,
        subheadline: 'Don\'t settle for generic tools. Choose the Best Real Estate Management Software built explicitly for layout and plot developers.'
    },
    'best-real-estate-crm-software-in-india': {
        title: 'Best Real Estate CRM Software in India | SiteBoard',
        description: 'Maximize efficiency with the Best Real Estate CRM Software in India. tailored for Indian builders to streamline sales and inventory.',
        headline: <>
            India's Choice for <br />
            Best Real Estate CRM.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Sales Automated.</span>
        </>,
        subheadline: 'Join top developers using the Best Real Estate CRM Software in India to transform their sales operations.'
    },
    'real-estate-software-development': {
        title: 'Custom Real Estate Software Development | SiteBoard',
        description: 'Looking for Real Estate Software Development? SiteBoard offers a turnkey solution that is better than custom development. Start today.',
        headline: <>
            The Future of <br />
            Real Estate Software.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Ready to Deploy.</span>
        </>,
        subheadline: 'Skip the months of Real Estate Software Development time. SiteBoard is ready to use, feature-rich, and proven.'
    },
    'real-estate-plot-management': {
        title: 'Advanced Real Estate Plot Management System',
        description: 'Master your inventory with our Real Estate Plot Management software. Visual layouts, live status, and error-free bookings.',
        headline: <>
            Visual Real Estate <br />
            Plot Management.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>See Every Inch.</span>
        </>,
        subheadline: 'The most intuitive Real Estate Plot Management system. Visualize availability, block units, and manage bookings on an interactive map.'
    },
    'real-estate-software': {
        title: 'SiteBoard | Modern Real Estate Software',
        description: 'The modern Real Estate Software for forward-thinking developers. Cloud-based, mobile-friendly, and easy to use.',
        headline: <>
            Modern <br />
            Real Estate Software.<br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Simply Powerful.</span>
        </>,
        subheadline: 'Upgrade to Real Estate Software that actually works for you. No clunky interfaces, just smooth, efficient management.'
    }
};
