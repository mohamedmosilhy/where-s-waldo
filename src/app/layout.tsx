import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children} {/* ← Pages/child layouts go here */}
      </body>
    </html>
  );
}
