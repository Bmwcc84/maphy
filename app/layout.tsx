import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { siteConfig } from "@/lib/seo";
import SiteActivityTracker from "@/components/SiteActivityTracker";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MAPHY Physics Learning",
    template: "%s | MAPHY",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "education",
  icons: {
    icon: "/maphy-logo-mark.png",
    apple: "/maphy-logo-mark.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
    images: [siteConfig.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [siteConfig.socialImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><SiteActivityTracker />{children}</body>
    </html>
  );
}
