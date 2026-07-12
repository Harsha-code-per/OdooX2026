import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

/* ─── Typography ────────────────────────────────────────────────────────────
   Inter is the only permitted font per the EcoSphere design specification.
   Geist and all other fonts are explicitly excluded.
────────────────────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/* ─── SEO Metadata ──────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "EcoSphere — Enterprise ESG Intelligence Platform",
    template: "%s | EcoSphere",
  },
  description:
    "Modern sustainability management for organizations that care about measurable environmental, social and governance impact.",
  keywords: [
    "ESG",
    "sustainability",
    "environmental",
    "social",
    "governance",
    "enterprise",
    "analytics",
  ],
  authors: [{ name: "EcoSphere Team" }],
  creator: "EcoSphere",
  openGraph: {
    type: "website",
    siteName: "EcoSphere",
    title: "EcoSphere — Enterprise ESG Intelligence Platform",
    description:
      "Modern sustainability management for organizations that care about measurable impact.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ────────────────────────────────────────────────────────────
   Wraps the entire application.
   Only providers and font setup belong here.
   Business logic must never appear in this file.
────────────────────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning /* Required for next-themes to avoid hydration mismatch */
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
