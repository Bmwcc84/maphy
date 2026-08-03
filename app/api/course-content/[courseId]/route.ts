import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { getEnrollmentsForUser } from "@/lib/server-supabase";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  const { courseId } = await context.params;
  const course = getCourse(courseId);
  if (!course?.contentFile) {
    return NextResponse.json({ error: "Notes file is not available." }, { status: 404 });
  }

  const enrollments = await getEnrollmentsForUser(user.id);
  const hasAccess = enrollments.some((enrollment) => enrollment.course_id === course.id);
  if (!hasAccess) {
    return NextResponse.json({ error: "Please buy this chapter first." }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), "content", "notes", course.contentFile);
  const file = await readFile(filePath);
  const fileName = `${course.id}.pdf`;

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Content-Type": "application/pdf",
      "Cache-Control": "private, no-store",
    },
  });
}
