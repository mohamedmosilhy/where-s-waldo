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
      <body className="min-h-screen bg-gray-950 text-gray-50">
        <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="font-bangers text-2xl tracking-wide transition-colors leading-none text-red-500"
            >
              WHERE&apos;S WALDO?
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/scenes"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
              >
                Scenes
              </Link>
              <Link
                href="/calibration"
                className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
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
