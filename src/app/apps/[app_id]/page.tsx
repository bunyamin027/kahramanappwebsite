import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apps } from "@/data/apps";
import AppStoreBadge from "@/components/ui/AppStoreBadge";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppData } from "@/types/app";
import "./app-detail.css";

// Generate static params for all apps
export function generateStaticParams() {
  return apps.map((app) => ({
    app_id: app.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ app_id: string }>;
}): Promise<Metadata> {
  const { app_id } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  
  const app = apps.find((a) => a.id === app_id);

  if (!app) {
    return { title: "App Not Found" };
  }

  const localizedName = (app[`name_${lang}` as keyof AppData] as string) || app.name;
  const localizedTagline = (app[`tagline_${lang}` as keyof AppData] as string) || app.tagline;
  const localizedDescription = (app[`description_${lang}` as keyof AppData] as string) || app.description;

  return {
    title: `${localizedName} — ${localizedTagline} | Kahraman App`,
    description: localizedDescription,
    openGraph: {
      title: `${localizedName} — ${localizedTagline}`,
      description: localizedDescription,
      type: "website",
    },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ app_id: string }>;
}) {
  const { app_id } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  
  const app = apps.find((a) => a.id === app_id);

  if (!app) {
    notFound();
  }

  const localizedName = (app[`name_${lang}` as keyof AppData] as string) || app.name;
  const localizedTagline = (app[`tagline_${lang}` as keyof AppData] as string) || app.tagline;
  const localizedDescription = (app[`description_${lang}` as keyof AppData] as string) || app.description;
  const localizedReadme = (app[`readmeDescription_${lang}` as keyof AppData] as string) || app.readmeDescription || localizedDescription;
  const localizedFeatures = (app[`features_${lang}` as keyof AppData] as string[]) || app.features;

  // Simple hardcoded translations for the static UI text on this page based on lang cookie
  const ui = {
    allApps: lang === "tr" ? "Tüm Uygulamalar" : lang === "es" ? "Todas las aplicaciones" : "All Apps",
    features: lang === "tr" ? "Özellikler" : lang === "es" ? "Características" : "Features",
    techStack: lang === "tr" ? "Teknolojiler" : lang === "es" ? "Tecnologías" : "Tech Stack",
    downloadToday: lang === "tr" ? `Hemen ${localizedName} İndir` : lang === "es" ? `Descarga ${localizedName} Hoy` : `Download ${localizedName} Today`
  };

  return (
    <main
      className="app-detail-page"
      style={
        { "--detail-app-color": app.color } as React.CSSProperties
      }
    >
      {/* Back Navigation */}
      <Link href="/" className="app-detail-back">
        <span className="app-detail-back-arrow">←</span>
        {ui.allApps}
      </Link>

      {/* Hero Section */}
      <section className="app-detail-hero">
        <div className="app-detail-hero-icon">
          <Image
            src={app.icon}
            alt={`${localizedName} icon`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div className="app-detail-hero-info">
          <h1 className="app-detail-hero-name">{localizedName}</h1>
          <p className="app-detail-hero-tagline">{localizedTagline}</p>
          <p className="app-detail-hero-desc">
            {localizedReadme}
          </p>

          {app.appStoreUrl && (
            <div className="app-detail-hero-badge">
              <AppStoreBadge appStoreUrl={app.appStoreUrl} />
            </div>
          )}
        </div>
      </section>

      {/* Content Cards */}
      <section className="app-detail-content">
        {/* Features Card */}
        {localizedFeatures && localizedFeatures.length > 0 && (
          <div className="app-detail-card">
            <h2 className="app-detail-card-title">
              <span className="app-detail-card-title-icon">✨</span>
              {ui.features}
            </h2>
            <ul className="app-detail-features">
              {localizedFeatures.map((feature, i) => {
                // Split "Title — Description" format
                const parts = feature.split(" — ");
                return (
                  <li key={i} className="app-detail-feature-item">
                    <span className="app-detail-feature-bullet" />
                    <span>
                      {parts.length > 1 ? (
                        <>
                          <span className="app-detail-feature-title">
                            {parts[0]}
                          </span>
                          {" — "}
                          {parts.slice(1).join(" — ")}
                        </>
                      ) : (
                        feature
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Tech Stack Card */}
        {app.techStack && app.techStack.length > 0 && (
          <div className="app-detail-card">
            <h2 className="app-detail-card-title">
              <span className="app-detail-card-title-icon">🛠</span>
              {ui.techStack}
            </h2>
            <div className="app-detail-tech-list">
              {app.techStack.map((tech, i) => (
                <span key={i} className="app-detail-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="app-detail-footer-cta">
        <div className="app-detail-cta-card">
          <h2 className="app-detail-cta-title">
            {ui.downloadToday}
          </h2>
          <p className="app-detail-cta-subtitle">
            {localizedDescription}
          </p>
          {app.appStoreUrl && (
            <AppStoreBadge appStoreUrl={app.appStoreUrl} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="landing-footer-text">
          &copy; {new Date().getFullYear()} Kahraman App. All rights reserved.
        </p>
        <div className="landing-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <Link href="/#contact">Contact Us</Link>
        </div>
      </footer>
    </main>
  );
}
