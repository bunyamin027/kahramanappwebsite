import { MetadataRoute } from 'next';
import { getAllApps } from '@/lib/data';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kahramanapp.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apps = await getAllApps();

  const appUrls = apps.map((app) => ({
    url: `${baseUrl}/apps/${app.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = ['', '/link-in-bio', '/privacy', '/terms'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.5,
  }));

  return [...routes, ...appUrls];
}
