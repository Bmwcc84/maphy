import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";
import { getAuthenticatedUser } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    courseId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  } | null;
  const course = body?.courseId ? getCourse(body.courseId) : undefined;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (
    !course ||
    !keySecret ||
    !body?.razorpay_order_id ||
    !body.razorpay_payment_id ||
    !body.razorpay_signature
  ) {
    return NextResponse.json({ error: "Incomplete payment details." }, { status: 400 });
  }

  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
    .digest("hex");
  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(body.razorpay_signature, "utf8");
  const verified = expected.length === received.length && timingSafeEqual(expected, received);

  if (!verified) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  return NextResponse.json({
    verified: true,
    course: { id: course.id, title: course.title },
    user: { id: user.id, email: user.email },
  });
}
