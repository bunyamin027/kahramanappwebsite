import { getAllApps } from "@/lib/data";
import BioDownloadButton from "./BioDownloadButton";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 604800; // 1 week

export default async function LinkInBioPage() {
  const apps = await getAllApps();

  return (
    <>
      <header className="link-in-bio-header">
        <h1 className="link-in-bio-logo">KAHRAMAN APP</h1>
        <p className="link-in-bio-subtitle">
          Next-generation mobile experiences powered by AI.
        </p>
      </header>

      <section className="link-in-bio-links">
        {apps.map((app) => (
          <div key={app.id} className="bio-app-card">
            {/* If an icon URL exists, use it. Otherwise placeholder */}
            {app.icon ? (
              <Image
                src={app.icon}
                alt={`${app.name} icon`}
                width={64}
                height={64}
                className="bio-app-icon"
              />
            ) : (
              <div className="bio-app-icon" />
            )}
            
            <div className="bio-app-info">
              <h2 className="bio-app-name">{app.name}</h2>
              <p className="bio-app-tagline">{app.tagline || app.description.substring(0, 50) + "..."}</p>
            </div>

            <BioDownloadButton appId={app.id} color={app.color} />
          </div>
        ))}
      </section>

      <footer className="link-in-bio-footer">
        <p className="link-in-bio-footer-text">© {new Date().getFullYear()} KAHRAMAN APP. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px', fontSize: '14px' }}>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms of Use</Link>
        </div>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
          <a href="https://twitter.com/agenticapps" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>𝕏</a>
          <a href="https://instagram.com/agenticapps" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Instagram</a>
          <a href="mailto:kahramandev01@gmail.com" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </>
  );
}
