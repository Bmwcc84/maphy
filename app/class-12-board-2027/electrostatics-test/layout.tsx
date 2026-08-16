import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createPageJsonLd, createPublicMetadata } from "@/lib/seo";

const title = "Class 12 Physics Test Series 2027: Bilingual Tests";
const description =
  "Practice four Electrostatics test sets with 120 unique bilingual Physics questions, instant results, explanations and a downloadable question PDF for every set.";
const path = "/class-12-board-2027/electrostatics-test";

export const metadata: Metadata = createPublicMetadata({
  title,
  description,
  path,
});

const jsonLd = createPageJsonLd({
  title,
  description,
  path,
  breadcrumbName: "Class 12 Physics Test Series 2027",
});

export default function Class12PhysicsTestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
