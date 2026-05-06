import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/login',
                    '/signup',
                    '/reset-password',
                    '/forgot-password',
                    '/admin/',
                ],
            }
        ],
        sitemap: 'https://siteboard.in/sitemap.xml',
    };
}
