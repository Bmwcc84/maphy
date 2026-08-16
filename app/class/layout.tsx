import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata("Student Class");

export default function ClassLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
