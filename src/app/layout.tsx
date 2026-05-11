import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Architectural AI — Construction Intelligence Platform",
  description: "The AI operating system for construction. Design, estimate, and build smarter with multi-agent AI intelligence across residential, commercial, and institutional projects.",
  keywords: ["architecture", "AI", "floor plan", "construction", "3D model", "cost estimation", "building design"],
  openGraph: {
    title: "Architectural AI — Build Intelligently",
    description: "Multi-agent AI for residential, commercial & institutional construction worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
