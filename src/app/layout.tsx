import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://myteamplanner.nl";

export const metadata: Metadata = {
  title: {
    default: "MyTeamPlanner — Gratis teamplanner voor amateurvoetbal",
    template: "%s | MyTeamPlanner",
  },
  description:
    "De gratis app voor amateurvoetbalteams. Beheer wedstrijden, opstellingen, beschikbaarheid en evenementen. Makkelijker dan WhatsApp, speciaal voor coaches en spelers.",
  keywords: [
    "teamplanner",
    "voetbal",
    "amateurvoetbal",
    "opstelling",
    "wedstrijden",
    "beschikbaarheid",
    "wisselschema",
    "voetbal app",
    "team beheer",
    "coach app",
    "gratis teamplanner",
  ],
  authors: [{ name: "MyTeamPlanner" }],
  creator: "MyTeamPlanner",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "MyTeamPlanner",
    title: "MyTeamPlanner — Gratis teamplanner voor amateurvoetbal",
    description:
      "De gratis app voor amateurvoetbalteams. Beheer wedstrijden, opstellingen, beschikbaarheid en evenementen.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyTeamPlanner — Gratis teamplanner voor amateurvoetbal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyTeamPlanner — Gratis teamplanner voor amateurvoetbal",
    description:
      "De gratis app voor amateurvoetbalteams. Beheer wedstrijden, opstellingen, beschikbaarheid en evenementen.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MyTeamPlanner",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MyTeamPlanner",
              applicationCategory: "SportsApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
              description:
                "De gratis app voor amateurvoetbalteams. Beheer wedstrijden, opstellingen, beschikbaarheid en evenementen.",
              url: siteUrl,
              inLanguage: "nl",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
