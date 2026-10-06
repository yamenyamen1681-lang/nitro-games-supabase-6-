import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const SITE_URL = "https://nitro-games-supabase-6.vercel.app";

const STORE_NAME_AR = "نيترو قيمز";
const STORE_NAME_EN = "NITRO GAMES";
const WHATSAPP = "972595852044";

const description =
  "NITRO GAMES (نيترو قيمز) — متجر إلكتروني متخصص في عتاد الجيمينج في فلسطين: كيبورد، ماوس، ماوس باد، مايك، وسماعات.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "NITRO GAMES | نيترو قيمز",
    template: "%s | NITRO GAMES",
  },

  description,

  keywords: [
    "NITRO GAMES",
    "Nitro Games",
    "NitroGames",
    "نيترو قيمز",
    "نيتروقيز",
    "نتيرو قيمز",
    "متجر نيترو قيمز",
    "متجر قيمنق فلسطين",
    "قيمنق فلسطين",
    "عتاد قيمنق فلسطين",
    "كيبورد قيمنق",
    "ماوس قيمنق",
    "ماوس باد",
    "مايك قيمنق",
    "سماعات قيمنق",
    "gaming store palestine",
    "gaming peripherals palestine",
    "keyboard palestine",
    "gaming mouse palestine",
    "mousepad",
    "microphone",
    "headset",
  ],

  authors: [
    {
      name: STORE_NAME_EN,
      url: SITE_URL,
    },
  ],

  creator: STORE_NAME_EN,
  publisher: STORE_NAME_EN,
  applicationName: STORE_NAME_EN,

  openGraph: {
    type: "website",
    locale: "ar_PS",
    alternateLocale: ["ar", "en_US"],
    url: SITE_URL,
    siteName: STORE_NAME_EN,
    title: "NITRO GAMES | نيترو قيمز",
    description,
    images: [
      {
        url: "/images/deep-space-nebula.jpg",
        width: 1200,
        height: 630,
        alt: "NITRO GAMES - نيترو قيمز",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NITRO GAMES | نيترو قيمز",
    description,
    images: ["/images/deep-space-nebula.jpg"],
  },

  appleWebApp: {
    capable: true,
    title: STORE_NAME_EN,
    statusBarStyle: "black-translucent",
  },

  formatDetection: {
    telephone: true,
    address: false,
    email: true,
  },

  verification: {
    google: "025401ee1a873bc6",
  },

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

/*
 * Structured Data
 *
 * يساعد Google على فهم:
 * - اسم الموقع
 * - اسم العلامة
 * - أن الموقع تابع لـ NITRO GAMES
 * - رابط الموقع الرسمي
 */

const jsonLd = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "Organization",

      "@id": `${SITE_URL}/#organization`,

      name: STORE_NAME_EN,

      alternateName: [
        STORE_NAME_AR,
        "NitroGames",
        "نيترو قيمز",
      ],

      url: SITE_URL,

      description,

      telephone: `+${WHATSAPP}`,

      areaServed: {
        "@type": "Country",
        name: "Palestine",
      },
    },

    {
      "@type": "WebSite",

      "@id": `${SITE_URL}/#website`,

      url: SITE_URL,

      name: STORE_NAME_EN,

      alternateName: STORE_NAME_AR,

      inLanguage: ["ar", "en"],

      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <meta
          name="theme-color"
          content="#00a3ff"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&family=Michroma&family=Chakra+Petch:wght@600;700&family=Orbitron:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body className="min-h-screen bg-[#05070d] text-gray-100 antialiased selection:bg-[#00a3ff] selection:text-black font-['Tajawal','Cairo',sans-serif]">
        {children}
      </body>
    </html>
  );
}
