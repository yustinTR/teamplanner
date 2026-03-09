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
    "voetbal training oefeningen",
    "trainingsplan voetbal",
    "opstelling maker",
    "wisselschema maker",
    "voetbal.nl import",
    "jeugdvoetbal app",
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
        url: "/api/og",
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
    images: ["/api/og"],
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
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
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
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5MMCHJS2');`,
          }}
        />
        <link rel="dns-prefetch" href="https://zonxfimxwqgpgycblvcg.supabase.co" />
        <link rel="preconnect" href="https://zonxfimxwqgpgycblvcg.supabase.co" crossOrigin="anonymous" />
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5MMCHJS2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
