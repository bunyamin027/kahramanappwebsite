"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Home, Grid } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Do not show the admin navbar on the login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#030308] text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
      {/* Admin Navbar */}
      <nav className="border-b border-[rgba(0,240,255,0.15)] bg-[rgba(10,10,30,0.6)] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf00ff]">
                ADMIN
              </Link>
              <div className="hidden sm:flex gap-4">
                <Link href="/admin" className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#00f0ff] transition-colors">
                  <Grid size={16} /> Dashboard
                </Link>
                <Link href="/" className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#00f0ff] transition-colors" target="_blank">
                  <Home size={16} /> Siteyi Gör
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-md hover:bg-red-400/10"
              >
                <LogOut size={16} /> Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {children}
      </main>
    </div>
  );
}
