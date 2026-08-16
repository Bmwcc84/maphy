import { createHmac, timingSafeEqual } from "node:crypto";
import { open, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasCourseEntitlement } from "@/lib/course-entitlement";
import { getCourse } from "@/lib/courses";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { getEnrollmentsForUser } from "@/lib/server-supabase";

export const runtime = "nodejs";

const DOWNLOAD_CHUNK_SIZE = 3 * 1024 * 1024;
const DOWNLOAD_TOKEN_LIFETIME_MS = 5 * 60 * 1000;

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

function getDownloadSecret() {
  return process.env.DOWNLOAD_TOKEN_SECRET ?? process.env.RAZORPAY_KEY_SECRET;
}

function createDownloadToken(courseId: string, userId: string, expiresAt: number) {
  const secret = getDownloadSecret();
  if (!secret) return null;

  const payload = Buffer.from(`${courseId}:${userId}:${expiresAt}`).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function isValidDownloadToken(token: string | null, courseId: string) {
  const secret = getDownloadSecret();
  if (!token || !secret) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return false;
  }

  const decoded = Buffer.from(payload, "base64url").toString("utf8");
  const [tokenCourseId, userId, expiresAt] = decoded.split(":");
  return (
    tokenCourseId === courseId &&
    Boolean(userId) &&
    Number.isFinite(Number(expiresAt)) &&
    Date.now() < Number(expiresAt)
  );
}

export async function GET(request: Request, context: RouteContext) {
  const { courseId } = await context.params;
  const course = getCourse(courseId);
  if (!course?.contentFile) {
    return NextResponse.json({ error: "Notes file is not available." }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "content", "notes", course.contentFile);
  const requestUrl = new URL(request.url);
  const requestedPart = requestUrl.searchParams.get("part");

  if (requestedPart !== null) {
    if (!isValidDownloadToken(requestUrl.searchParams.get("token"), course.id)) {
      return NextResponse.json({ error: "Download link expired." }, { status: 401 });
    }

    const partNumber = Number(requestedPart);
    const fileStats = await stat(filePath);
    const totalParts = Math.ceil(fileStats.size / DOWNLOAD_CHUNK_SIZE);
    if (!Number.isInteger(partNumber) || partNumber < 0 || partNumber >= totalParts) {
      return NextResponse.json({ error: "Download part not found." }, { status: 404 });
    }

    const start = partNumber * DOWNLOAD_CHUNK_SIZE;
    const length = Math.min(DOWNLOAD_CHUNK_SIZE, fileStats.size - start);
    const buffer = Buffer.allocUnsafe(length);
    const fileHandle = await open(filePath, "r");

    try {
      await fileHandle.read(buffer, 0, length, start);
    } finally {
      await fileHandle.close();
    }

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Type": "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  if (requestUrl.searchParams.get("meta") !== "1") {
    return NextResponse.json({ error: "Download request is incomplete." }, { status: 400 });
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  let hasAccess = hasCourseEntitlement(request, user.id, course.id);
  if (!hasAccess) {
    try {
      const enrollments = await getEnrollmentsForUser(user.id);
      hasAccess = enrollments.some((enrollment) => enrollment.course_id === course.id);
    } catch (error) {
      console.error("Enrollment lookup failed during download", error);
      return NextResponse.json(
        { error: "Course access check abhi unavailable hai. Recover PDF use karein." },
        { status: 503 },
      );
    }
  }
  if (!hasAccess) {
    return NextResponse.json({ error: "Please buy this chapter first." }, { status: 403 });
  }

  const fileStats = await stat(filePath);
  const expiresAt = Date.now() + DOWNLOAD_TOKEN_LIFETIME_MS;
  const token = createDownloadToken(course.id, user.id, expiresAt);
  if (!token) {
    return NextResponse.json({ error: "Secure download is not configured." }, { status: 503 });
  }

  const fileName = `${course.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.pdf`;
  return NextResponse.json(
    {
      fileName,
      parts: Math.ceil(fileStats.size / DOWNLOAD_CHUNK_SIZE),
      size: fileStats.size,
      token,
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
