import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://siteboard.in',
            lastModified: new Date(),
            changeFrequency: 'weekly', // Keep it simple
            priority: 1,
        },
        {
            url: 'https://siteboard.in/admin/login',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
