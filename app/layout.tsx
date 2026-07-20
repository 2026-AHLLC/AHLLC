import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AHChatbot } from "@/components/chat/AHChatbot";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahllc.biz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "AH LLC | AI • Automation • Growth",
    template: "%s | AH LLC",
  },

  description:
    "AH LLC helps businesses grow with AI-powered websites, automation, SEO, intelligent marketing, and custom software solutions.",

  keywords: [
    "AI",
    "Artificial Intelligence",
    "Automation",
    "Website Design",
    "SEO",
    "Marketing",
    "Small Business",
    "Lead Generation",
    "Long Island",
    "New York",
  ],

  applicationName: "AH LLC",

  authors: [
    {
      name: "AH LLC",
      url: siteUrl,
    },
  ],

  creator: "AH LLC",
  publisher: "AH LLC",

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "AH LLC | AI • Automation • Growth",
    description:
      "AI-powered business growth through automation, websites, SEO, and marketing.",
    url: siteUrl,
    siteName: "AH LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AH LLC",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AH LLC",
    description:
      "AI-powered websites, automation, and business growth.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AH LLC",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "AI-powered websites, automation, SEO, and business growth.",
    sameAs: [],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "AH LLC",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    areaServed: [
      "Long Island",
      "New York",
      "United States",
    ],
    priceRange: "$$",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} bg-zinc-950 text-white antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        {children}

        <AHChatbot />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}