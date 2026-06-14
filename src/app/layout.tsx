import type { Metadata } from "next";
import { Bangers, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Where's Waldo? | Find the Hidden Characters",
  description:
    "The classic search game — find hidden characters in detailed illustrated scenes!",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bangers.variable} ${inter.variable}`}>
      <body
        className="min-h-screen"
        style={{
          backgroundColor: "#030712",
          color: "#f9fafb",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
      >
        <nav
          className="border-b sticky top-0 z-50"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            borderColor: "#1f2937",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-bangers text-2xl tracking-wide transition-colors leading-none"
              style={{ color: "#ef4444" }}
            >
              WHERE&apos;S WALDO?
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/scenes"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: "#9ca3af" }}
              >
                Scenes
              </Link>
              <Link
                href="/calibration"
                className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
                style={{ backgroundColor: "rgba(234,179,8,0.1)", color: "#ca8a04", border: "1px solid rgba(234,179,8,0.2)" }}
              >
                Dev
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
