import type { Metadata } from "next";

export const siteConfig = {
  name: "MAPHY",
  url: "https://www.maphy.in",
  description:
    "Physics learning platform for Class 12 board preparation, handwritten notes and BPSC TRE online tests.",
  socialImage: {
    url: "https://www.maphy.in/maphy-logo-final.png",
    width: 1254,
    height: 1254,
    alt: "MAPHY Physics Learning logo",
  },
} as const;

type PublicMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

export function absoluteUrl(path: string) {
  return path === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${path}`;
}

export function createPublicMetadata({
  title,
  description,
  path,
}: PublicMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = title.endsWith(`| ${siteConfig.name}`)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      alternateLocale: ["hi_IN"],
      images: [siteConfig.socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [siteConfig.socialImage.url],
    },
  };
}

export function createNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

type PageJsonLdOptions = PublicMetadataOptions & {
  breadcrumbName: string;
};

export function createPageJsonLd({
  title,
  description,
  path,
  breadcrumbName,
}: PageJsonLdOptions) {
  const canonical = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: ["en-IN", "hi-IN"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "MAPHY Home",
            item: `${siteConfig.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbName,
            item: canonical,
          },
        ],
      },
    ],
  };
}
