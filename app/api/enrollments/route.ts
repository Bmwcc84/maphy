import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { getEnrollmentsForUser } from "@/lib/server-supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  try {
    const enrollments = await getEnrollmentsForUser(user.id);
    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Enrollment lookup failed", error);
    return NextResponse.json(
      { error: "Course access is temporarily unavailable." },
      { status: 503 },
    );
  }
}
