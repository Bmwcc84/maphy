import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { createStudentFeedback } from "@/lib/server-supabase";

export const runtime = "nodejs";

const categories = new Set([
  "suggestion",
  "payment",
  "access",
  "test",
  "notes",
  "technical",
  "other",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestWindowMs = 10 * 60 * 1000;
const requestLimit = 4;
const requestsByAddress = new Map<string, number[]>();

type FeedbackBody = {
  name?: unknown;
  email?: unknown;
  category?: unknown;
  subject?: unknown;
  message?: unknown;
  rating?: unknown;
  pageUrl?: unknown;
  website?: unknown;
};

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function createReferenceId() {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `MPH-${day}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function getClientAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(address: string) {
  const now = Date.now();
  const activeRequests = (requestsByAddress.get(address) ?? []).filter(
    (timestamp) => now - timestamp < requestWindowMs,
  );
  if (activeRequests.length >= requestLimit) {
    requestsByAddress.set(address, activeRequests);
    return true;
  }
  activeRequests.push(now);
  requestsByAddress.set(address, activeRequests);
  return false;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (rawBody.length > 20_000) {
    return NextResponse.json({ error: "Message bahut bada hai." }, { status: 413 });
  }

  let body: FeedbackBody;
  try {
    body = JSON.parse(rawBody) as FeedbackBody;
  } catch {
    return NextResponse.json({ error: "Invalid feedback request." }, { status: 400 });
  }

  if (cleanString(body.website, 200)) {
    return NextResponse.json({ ok: true, referenceId: createReferenceId() }, { status: 201 });
  }

  const address = getClientAddress(request);
  if (isRateLimited(address)) {
    return NextResponse.json(
      { error: "Thodi der baad dobara submit karein." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const user = await getAuthenticatedUser(request);
  const name = cleanString(body.name, 80);
  const email = (user?.email || cleanString(body.email, 254)).toLowerCase();
  const category = cleanString(body.category, 30);
  const subject = cleanString(body.subject, 120);
  const message = cleanString(body.message, 2_000);
  const pageUrl = cleanString(body.pageUrl, 500);
  const parsedRating = Number(body.rating);
  const rating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
    ? parsedRating
    : undefined;

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Valid email address enter karein." }, { status: 400 });
  }
  if (!categories.has(category)) {
    return NextResponse.json({ error: "Valid help category select karein." }, { status: 400 });
  }
  if (subject.length < 5) {
    return NextResponse.json({ error: "Subject kam se kam 5 characters ka rakhein." }, { status: 400 });
  }
  if (message.length < 20) {
    return NextResponse.json({ error: "Message mein kam se kam 20 characters likhein." }, { status: 400 });
  }

  const referenceId = createReferenceId();
  try {
    const feedback = await createStudentFeedback({
      referenceId,
      userId: user?.id,
      studentName: name || undefined,
      studentEmail: email,
      category,
      subject,
      message,
      rating,
      pageUrl: /^https?:\/\//.test(pageUrl) ? pageUrl : undefined,
      userAgent: cleanString(request.headers.get("user-agent"), 500),
    });

    return NextResponse.json(
      {
        ok: true,
        referenceId: feedback?.reference_id ?? referenceId,
        createdAt: feedback?.created_at ?? new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Student feedback submission failed", error);
    return NextResponse.json(
      { error: "Feedback abhi save nahi ho saka. Kripya thodi der baad dobara try karein." },
      { status: 503 },
    );
  }
}
