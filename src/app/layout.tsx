import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { AudioProvider } from "@/context/AudioContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import "./marketing.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AgenticApps — Futuristic Mobile App Showcase",
  description:
    "Explore our universe of innovative mobile applications. AI-powered app discovery in an immersive 3D experience.",
  keywords: [
    "mobile apps",
    "iOS apps",
    "app showcase",
    "Dayzero",
    "Ninniai",
    "AI assistant",
    "app portfolio",
  ],
  openGraph: {
    title: "AgenticApps — Futuristic Mobile App Showcase",
    description:
      "Explore our universe of innovative mobile applications in 3D.",
    type: "website",
  },
};

import Navbar from "@/components/hud/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head />
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AudioProvider>
              <Navbar />
              {children}
            </AudioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
