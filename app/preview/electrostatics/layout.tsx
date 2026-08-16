import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createPageJsonLd, createPublicMetadata } from "@/lib/seo";

const title = "Electrostatics Handwritten Notes for Class 12 Physics";
const description =
  "Preview Class 12 Physics Electrostatics handwritten notes for board revision, then unlock the complete downloadable chapter PDF on MAPHY.";
const path = "/preview/electrostatics";

export const metadata: Metadata = createPublicMetadata({
  title,
  description,
  path,
});

const jsonLd = createPageJsonLd({
  title,
  description,
  path,
  breadcrumbName: "Electrostatics Handwritten Notes",
});

export default function ElectrostaticsPreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
