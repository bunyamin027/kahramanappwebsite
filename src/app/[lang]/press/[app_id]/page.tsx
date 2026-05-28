import { getAppById, getAllApps } from "@/lib/data";
import { notFound } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import type { Metadata } from "next";
import MediaKitDownloader from "./MediaKitDownloader";

export const revalidate = 604800; // 1 week

// ── Supported languages ─────────────────────────────────
const VALID_LANGS = ["en", "tr"] as const;
type Lang = (typeof VALID_LANGS)[number];

// Security: Prevent Path Traversal & Invalid Bot Requests
const appIdSchema = z.string().regex(/^[a-z0-9-]+$/).min(2).max(50);

interface Props {
  params: Promise<{
    lang: string;
    app_id: string;
  }>;
}

export async function generateStaticParams() {
  const apps = await getAllApps();
  const paths: { lang: string; app_id: string }[] = [];

  for (const lang of VALID_LANGS) {
    for (const app of apps) {
      paths.push({ lang, app_id: app.id });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  if (!appIdSchema.safeParse(resolvedParams.app_id).success) {
    return { title: "App Not Found - AgenticApps" };
  }

  const app = await getAppById(resolvedParams.app_id);

  if (!app) {
    return {
      title: "App Not Found - AgenticApps",
    };
  }

  return {
    title: `${app.name} - AgenticApps Showcase`,
    description: app.tagline || app.description.substring(0, 160),
    openGraph: {
      title: `${app.name} | Future of Mobile`,
      description: app.tagline || app.description.substring(0, 160),
      images: [
        {
          url: app.icon_url || "/icons/default-og.png",
          width: 1200,
          height: 630,
          alt: `${app.name} Cover Image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.name} | Future of Mobile`,
      description: app.tagline || app.description.substring(0, 160),
      images: [app.icon_url || "/icons/default-og.png"],
    },
  };
}

export default async function PressPage({ params }: Props) {
  const resolvedParams = await params;
  
  if (!VALID_LANGS.includes(resolvedParams.lang as Lang) || !appIdSchema.safeParse(resolvedParams.app_id).success) {
    notFound();
  }

  const app = await getAppById(resolvedParams.app_id);

  if (!app) {
    notFound();
  }

  return (
    <>
      <header className="press-header">
        {app.icon_url && (
          <Image
            src={app.icon_url}
            alt={`${app.name} icon`}
            width={128}
            height={128}
            className="press-app-icon"
          />
        )}
        <h1 className="press-title">{app.name} Press Kit</h1>
        <p className="press-tagline">{app.tagline}</p>
      </header>

      <section className="press-section">
        <h2>About {app.name}</h2>
        <p>{resolvedParams.lang === "tr" && app.description_tr ? app.description_tr : app.description}</p>
      </section>

      <section className="press-section">
        <h2>At a Glance</h2>
        <ul>
          <li><strong>Developer:</strong> {app.developer}</li>
          <li><strong>Company:</strong> {app.company_name}</li>
          <li><strong>Category:</strong> {app.category}</li>
          <li><strong>Contact:</strong> <a href={`mailto:${app.contact_email}`}>{app.contact_email}</a></li>
          {app.release_date && <li><strong>Release Date:</strong> {new Date(app.release_date).toLocaleDateString()}</li>}
        </ul>
      </section>

      {app.screenshots && app.screenshots.length > 0 && (
        <section className="press-section">
          <h2>Screenshots</h2>
          <div className="press-screenshots">
            {app.screenshots.map((url, i) => (
              <Image 
                key={i} 
                src={url} 
                alt={`${app.name} screenshot ${i + 1}`} 
                width={300} 
                height={600} 
                className="press-screenshot"
              />
            ))}
          </div>
        </section>
      )}

      {/* Client component for ZIP generation */}
      <MediaKitDownloader app={app} />
    </>
  );
}
