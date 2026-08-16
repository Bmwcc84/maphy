import type { Metadata } from "next";
import HelpCentre from "@/components/HelpCentre";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import { helpArticles } from "@/lib/help-centre";
import { createPageJsonLd, createPublicMetadata } from "@/lib/seo";

const description =
  "Get MAPHY help for payments, PDF downloads, login and online tests, or submit student feedback and suggestions.";

export const metadata: Metadata = createPublicMetadata({
  title: "Help Centre & Student Feedback | MAPHY",
  description,
  path: "/help",
});

const pageJsonLd = createPageJsonLd({
  title: "MAPHY Help Centre",
  description,
  path: "/help",
  breadcrumbName: "Help Centre",
});

const helpJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: helpArticles.map((article) => ({
    "@type": "Question",
    name: article.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: article.answer,
    },
  })),
};

export default function HelpPage() {
  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={helpJsonLd} />
      <Navbar />
      <HelpCentre />
      <footer className="bg-slate-950 px-5 py-7 text-center text-sm text-slate-400">
        MAPHY - Maths and Physics Learning Platform
      </footer>
    </>
  );
}
