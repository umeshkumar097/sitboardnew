import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';
import { KEYWORD_CONFIG } from '@/lib/seo-config';

// Start: Fix for missing Params type
interface PageProps {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}
// End: Fix for missing Params type

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const config = KEYWORD_CONFIG[params.slug];

    if (!config) {
        return {};
    }

    return {
        title: config.title,
        description: config.description,
        openGraph: {
            title: config.title,
            description: config.description,
        }
    };
}

export function generateStaticParams() {
    return Object.keys(KEYWORD_CONFIG).map((slug) => ({
        slug,
    }));
}

export default function KeywordLandingPage({ params }: PageProps) {
    const config = KEYWORD_CONFIG[params.slug];

    if (!config) {
        notFound();
    }

    return (
        <LandingPageTemplate
            headline={config.headline}
            subheadline={config.subheadline}
            source={params.slug}
        />
    );
}
