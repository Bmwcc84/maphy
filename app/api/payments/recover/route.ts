import { NextResponse } from "next/server";
import {
  readClass12Progress,
  startClass12ProgressCycle,
} from "@/lib/class12-test-progress";
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
  created_at: number;
};

async function razorpayRequest<T>(path: string, keyId: string, keySecret: string) {
  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    headers: { Authorization: `Basic ${authorization}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Razorpay recovery failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  const accessToken = getRequestAccessToken(request);
  if (!user || !accessToken) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { courseId?: string } | null;
  const course = body?.courseId ? getCourse(body.courseId) : undefined;
  if (!course) {
    return NextResponse.json({ error: "Invalid course selected." }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment recovery is not configured." }, { status: 503 });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 90 * 24 * 60 * 60;
    const orderList = await razorpayRequest<{ items: RazorpayOrder[] }>(
      `orders?from=${from}&to=${now}&count=100`,
      keyId,
      keySecret,
    );
    const order = orderList.items.find((item) => {
      const notes = item.notes ?? {};
      return (
        item.status === "paid" &&
        item.amount === course.priceInPaise &&
        item.amount_paid === course.priceInPaise &&
        item.currency === "INR" &&
        notes.courseId === course.id &&
        notes.userId === user.id
      );
    });

    if (!order) {
      return NextResponse.json(
        { error: "Is account ke liye paid purchase nahi mila." },
        { status: 404 },
      );
    }

    const paymentList = await razorpayRequest<{ items: RazorpayPayment[] }>(
      `orders/${encodeURIComponent(order.id)}/payments`,
      keyId,
      keySecret,
    );
    const payment = paymentList.items.find(
      (item) =>
        item.order_id === order.id &&
        item.status === "captured" &&
        item.amount === course.priceInPaise &&
        item.currency === "INR",
    );
    if (!payment) {
      return NextResponse.json(
        { error: "Payment abhi captured status me nahi hai." },
        { status: 409 },
      );
    }

    const entitlementMaxAge = getCourseEntitlementMaxAge(course.id);
    const activatedAt = payment.created_at * 1000;
    const expiresAt = activatedAt + entitlementMaxAge * 1000;
    if (Date.now() >= expiresAt) {
      return NextResponse.json(
        { error: "Your 30-day test-series subscription has expired. Please subscribe again." },
        { status: 410 },
      );
    }

    if (course.id === class12BoardTestSeries.id) {
      const progress = readClass12Progress(user.userMetadata);
      if (
        progress?.cycleId === order.id &&
        progress.completedTests >= progress.limit
      ) {
        return NextResponse.json(
          {
            error: "30 tests complete ho chuke hain. Naya Rs 30 cycle activate karein.",
            renewalRequired: true,
            progress,
          },
          { status: 410 },
        );
      }
    }

    try {
      await upsertEnrollment({
        userId: user.id,
        userEmail: user.email,
        courseId: course.id,
        razorpayOrderId: order.id,
        razorpayPaymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        paymentStatus: "captured",
        activatedAt: new Date(activatedAt).toISOString(),
      });
    } catch (error) {
      console.error("Recovered payment could not be saved to database", error);
    }

    const entitlementToken = createCourseEntitlementToken(
      user.id,
      course.id,
      expiresAt,
      order.id,
    );
    if (!entitlementToken) {
      return NextResponse.json({ error: "Secure access is not configured." }, { status: 503 });
    }

    if (course.id === class12BoardTestSeries.id) {
      const progress = readClass12Progress(user.userMetadata);
      if (progress?.cycleId !== order.id) {
        try {
          await startClass12ProgressCycle(accessToken, order.id, expiresAt);
        } catch (error) {
          console.error("Recovered Class 12 progress could not be initialized", error);
        }
      }
    }

    const response = NextResponse.json({
      recovered: true,
      courseId: course.id,
      expiresAt,
    });
    response.cookies.set({
      name: courseEntitlementCookieName(course.id),
      value: entitlementToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 1),
    });
    return response;
  } catch (error) {
    console.error("Payment recovery failed", error);
    return NextResponse.json(
      { error: "Paid purchase recovery abhi complete nahi ho saka." },
      { status: 503 },
    );
  }
}
