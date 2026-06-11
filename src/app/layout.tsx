import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <header>🎮 Where&apos;s Waldo?</header>
        <nav>Home | Scenes | Leaderboard</nav>
        {children} {/* ← Pages/child layouts go here */}
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
