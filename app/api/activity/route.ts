import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { listPrivateActivity, savePrivateActivity } from "@/lib/server-supabase";

const ADMIN_EMAIL = "amitkumar847308@gmail.com";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { kind?: string; pageUrl?: string; testName?: string; score?: number; totalQuestions?: number } | null;
  if (body?.kind !== "visit" && body?.kind !== "test_attempt") return NextResponse.json({ error: "Invalid activity." }, { status: 400 });
  const user = await getAuthenticatedUser(request);
  await savePrivateActivity({
    kind: body.kind,
    createdAt: new Date().toISOString(),
    pageUrl: body.pageUrl?.slice(0, 500),
    testName: body.testName?.slice(0, 120),
    score: typeof body.score === "number" ? body.score : undefined,
    totalQuestions: typeof body.totalQuestions === "number" ? body.totalQuestions : undefined,
    userId: user?.id,
    userEmail: user?.email || undefined,
  });
  return NextResponse.json({ recorded: true });
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (user?.email.toLowerCase() !== ADMIN_EMAIL) return NextResponse.json({ error: "Admin access only." }, { status: 403 });
  return NextResponse.json({ records: await listPrivateActivity() });
}
