import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";
import { getAuthenticatedUser } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { courseId?: string } | null;
  const course = body?.courseId ? getCourse(body.courseId) : undefined;
  if (!course) {
    return NextResponse.json({ error: "Invalid course selected." }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay Test Mode keys abhi configure nahi hui hain." },
      { status: 503 },
    );
  }

  const receipt = `maphy_${Date.now()}_${user.id.slice(0, 8)}`;
  const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: course.priceInPaise,
      currency: "INR",
      receipt,
      notes: {
        courseId: course.id,
        userId: user.id,
        userEmail: user.email,
      },
    }),
    cache: "no-store",
  });

  const razorpayOrder = (await razorpayResponse.json().catch(() => null)) as
    | { id?: string; amount?: number; currency?: string; error?: { description?: string } }
    | null;

  if (!razorpayResponse.ok || !razorpayOrder?.id) {
    return NextResponse.json(
      { error: razorpayOrder?.error?.description ?? "Payment order create nahi ho saka." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    key: keyId,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount ?? course.priceInPaise,
    currency: razorpayOrder.currency ?? "INR",
    course: { id: course.id, title: course.title },
  });
}
