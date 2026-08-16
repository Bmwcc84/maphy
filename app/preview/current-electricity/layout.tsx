import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createPageJsonLd, createPublicMetadata } from "@/lib/seo";

const title = "Current Electricity Handwritten Notes for Class 12";
const description =
  "Preview Class 12 Physics Current Electricity handwritten notes for board revision, then unlock the complete downloadable chapter PDF on MAPHY.";
const path = "/preview/current-electricity";

export const metadata: Metadata = createPublicMetadata({
  title,
  description,
  path,
});

const jsonLd = createPageJsonLd({
  title,
  description,
  path,
  breadcrumbName: "Current Electricity Handwritten Notes",
});

export default function CurrentElectricityPreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
