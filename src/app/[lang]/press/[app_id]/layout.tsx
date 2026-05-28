import "./press.css";

export default function PressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="press-wrapper">
      <div className="press-bg"></div>
      <div className="press-scanlines"></div>
      
      <main className="press-content">{children}</main>
    </div>
  );
}
