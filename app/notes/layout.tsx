import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata("Student Notes");

export default function NotesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
