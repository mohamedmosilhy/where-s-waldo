export default function ScenesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="scenes-container">
      <aside className="sidebar">
        {/* Sidebar stays on ALL scenes pages */}
      </aside>
      <main>
        {children} {/* ← Scenes list OR detail page */}
      </main>
    </div>
  );
}
