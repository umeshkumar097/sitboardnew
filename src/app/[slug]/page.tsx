import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import LandingPageTemplate from '@/components/LandingPageTemplate';
import { KEYWORD_CONFIG } from '@/lib/seo-config';

// Start: Fix for missing Params type
// Start: Fix for missing Params type
interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
// End: Fix for missing Params type

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
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

export default async function KeywordLandingPage(props: PageProps) {
    const params = await props.params;
    const config = KEYWORD_CONFIG[params.slug];

    if (!config) {
        notFound();
    }

    return (
        <LandingPageTemplate
            headline={config.headline}
            subheadline={config.subheadline}
            source={params.slug}
            features={config.features}
            benefits={config.benefits}
            ctaText={config.ctaText}
            faqs={config.faqs}
        />
    );
}
