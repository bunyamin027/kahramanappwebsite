import "./link-in-bio.css";

export const metadata = {
  title: "Apps | Agentic 3D Showcase",
  description: "Download our futuristic apps directly.",
};

export default function LinkInBioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="link-in-bio-wrapper">
      {/* 2D scanline background instead of 3D Canvas */}
      <div className="link-in-bio-bg"></div>
      <div className="link-in-bio-scanlines"></div>
      
      {/* Content wrapper */}
      <main className="link-in-bio-content">{children}</main>
    </div>
  );
}
