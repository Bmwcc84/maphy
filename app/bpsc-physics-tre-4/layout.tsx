import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createPageJsonLd, createPublicMetadata } from "@/lib/seo";

const title = "BPSC TRE 4 Physics Complete Bilingual Online Test";
const description =
  "Attempt one complete BPSC Teacher TRE 4.0 Physics test with 43 shuffled Hindi-English questions, instant result, explanations and PDF download for Rs 99 per 30 days.";
const path = "/bpsc-physics-tre-4";

export const metadata: Metadata = createPublicMetadata({
  title,
  description,
  path,
});

const jsonLd = createPageJsonLd({
  title,
  description,
  path,
  breadcrumbName: "BPSC TRE 4 Physics Complete Test",
});

export default function BpscPhysicsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
