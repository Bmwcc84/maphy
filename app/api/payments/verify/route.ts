import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { upsertEnrollment } from "@/lib/server-supabase";

export const runtime = "nodejs";

type RazorpayOrder = {
  id: string;
  amount: number;
  amount_paid: number;
  currency: string;
  status: string;
  notes?: Record<string, string>;
};

type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
};

async function razorpayRequest<T>(path: string, keyId: string, keySecret: string) {
  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    headers: { Authorization: `Basic ${authorization}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Razorpay verification failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        courseId?: string;
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
      }
    | null;
  const course = body?.courseId ? getCourse(body.courseId) : undefined;
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!course || !orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });
  }

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment verification is not configured." },
      { status: 503 },
    );
  }

  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);
  const signatureMatches =
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer);

  if (!signatureMatches) {
    return NextResponse.json({ error: "Payment signature is invalid." }, { status: 400 });
  }

  try {
    const [order, payment] = await Promise.all([
      razorpayRequest<RazorpayOrder>(`orders/${encodeURIComponent(orderId)}`, keyId, keySecret),
      razorpayRequest<RazorpayPayment>(
        `payments/${encodeURIComponent(paymentId)}`,
        keyId,
        keySecret,
      ),
    ]);
    const notes = order.notes ?? {};
    const paymentIsValid =
      order.id === orderId &&
      payment.id === paymentId &&
      payment.order_id === orderId &&
      order.status === "paid" &&
      payment.status === "captured" &&
      order.amount === course.priceInPaise &&
      order.amount_paid === course.priceInPaise &&
      payment.amount === course.priceInPaise &&
      order.currency === "INR" &&
      payment.currency === "INR" &&
      notes.courseId === course.id &&
      notes.userId === user.id;

    if (!paymentIsValid) {
      return NextResponse.json(
        { error: "Payment could not be matched to this course." },
        { status: 400 },
      );
    }

    await upsertEnrollment({
      userId: user.id,
      userEmail: user.email,
      courseId: course.id,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      amount: payment.amount,
      currency: payment.currency,
      paymentStatus: "captured",
    });

    return NextResponse.json({
      verified: true,
      activated: true,
      course: { id: course.id, title: course.title },
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Payment activation failed", error);
    return NextResponse.json(
      { error: "Payment was received, but course activation is temporarily unavailable." },
      { status: 503 },
    );
  }
}
