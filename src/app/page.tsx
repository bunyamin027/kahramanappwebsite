import { getAllApps } from "@/lib/data";
import HeroSection from "@/components/marketing/HeroSection";
import AppShowcase from "@/components/marketing/AppShowcase";
import AboutSection from "@/components/marketing/AboutSection";
import ContactSection from "@/components/marketing/ContactSection";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Premium Mobile Apps",
  description: "Discover our suite of beautifully designed mobile applications.",
};

export default async function Home() {
  const apps = await getAllApps();

  return (
    <main className="marketing-container">
      {/* Aura animated background gradient */}
      <div className="marketing-aura"></div>
      
      {/* Main Content */}
      <HeroSection />
      
      <AppShowcase apps={apps} />
      
      <AboutSection />
      
      <ContactSection />
      
      {/* Footer */}
      <footer className="text-center py-12 border-t border-white/10 mt-12 relative z-10">
        <p className="text-white/50 text-sm mb-4">
          &copy; {new Date().getFullYear()} Our App Studio. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm text-white/40">
          <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white/80 transition-colors">Terms of Use (EULA)</Link>
        </div>
      </footer>
    </main>
  );
}
