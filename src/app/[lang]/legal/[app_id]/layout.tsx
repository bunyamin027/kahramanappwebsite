import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex", // Legal pages don't need indexing
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      {children}
    </div>
  );
}
