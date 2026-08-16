import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata("Student Courses");

export default function CoursesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
