import { getAllApps } from "@/lib/data";
import HeroSection from "@/components/marketing/HeroSection";
import AppShowcase from "@/components/marketing/AppShowcase";
import { Metadata } from "next";

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
      
      {/* Footer */}
      <footer className="text-center py-12 border-t border-white/10 mt-12 relative z-10">
        <p className="text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Our App Studio. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
