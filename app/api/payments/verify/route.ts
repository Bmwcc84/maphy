import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { startClass12ProgressCycle } from "@/lib/class12-test-progress";
import {
  courseEntitlementCookieName,
  createCourseEntitlementToken,
  getCourseEntitlementMaxAge,
} from "@/lib/course-entitlement";
import { class12BoardTestSeries, getCourse } from "@/lib/courses";
import { getAuthenticatedUser, getRequestAccessToken } from "@/lib/server-auth";
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
  const accessToken = getRequestAccessToken(request);
  if (!user || !accessToken) {
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

    let activated = true;
    try {
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
    } catch (error) {
      activated = false;
      console.error("Database enrollment save failed; signed access granted", error);
    }

    const entitlementMaxAge = getCourseEntitlementMaxAge(course.id);
    const expiresAt = Date.now() + entitlementMaxAge * 1000;
    const entitlementToken = createCourseEntitlementToken(
      user.id,
      course.id,
      expiresAt,
      orderId,
    );
    if (!entitlementToken) {
      return NextResponse.json(
        { error: "Payment was received, but secure access is not configured." },
        { status: 503 },
      );
    }

    if (course.id === class12BoardTestSeries.id) {
      try {
        await startClass12ProgressCycle(accessToken, orderId, expiresAt);
      } catch (error) {
        console.error("Fresh Class 12 test progress could not be initialized", error);
      }
    }

    const response = NextResponse.json({
      verified: true,
      activated,
      expiresAt,
      course: { id: course.id, title: course.title },
      user: { id: user.id, email: user.email },
    });
    response.cookies.set({
      name: courseEntitlementCookieName(course.id),
      value: entitlementToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: entitlementMaxAge,
    });
    return response;
  } catch (error) {
    console.error("Payment verification failed", error);
    return NextResponse.json(
      { error: "Payment verification is temporarily unavailable. Please use Recover PDF." },
      { status: 503 },
    );
  }
}
