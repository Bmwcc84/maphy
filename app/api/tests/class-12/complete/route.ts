import { NextResponse } from "next/server";
import {
  progressForCycle,
  readClass12Progress,
  recordClass12TestCompletion,
} from "@/lib/class12-test-progress";
import { getCourseEntitlement } from "@/lib/course-entitlement";
import { class12BoardTestSeries, getCourseAccessExpiresAt } from "@/lib/courses";
import { getAuthenticatedUser, getRequestAccessToken } from "@/lib/server-auth";
import { getEnrollmentsForUser } from "@/lib/server-supabase";

export const runtime = "nodejs";

const TEST_ID_PATTERN = /^(?:[a-z0-9]+-)+set-(?:0[1-9]|[12][0-9]|30)$/;

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  const accessToken = getRequestAccessToken(request);
  if (!user || !accessToken) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { testId?: string } | null;
  const testId = body?.testId?.trim().toLowerCase();
  if (!testId || !TEST_ID_PATTERN.test(testId)) {
    return NextResponse.json({ error: "Invalid Class 12 test selected." }, { status: 400 });
  }

  const storedProgress = readClass12Progress(user.userMetadata);
  let cycleId: string | null = null;
  let expiresAt: number | null = null;

  if (storedProgress && Date.now() < storedProgress.expiresAt) {
    cycleId = storedProgress.cycleId;
    expiresAt = storedProgress.expiresAt;
  }

  if (!cycleId) {
    try {
      const enrollments = await getEnrollmentsForUser(user.id);
      const enrollment = enrollments.find(
        (item) => item.course_id === class12BoardTestSeries.id,
      );
      if (enrollment) {
        const activatedAt = Date.parse(enrollment.updated_at ?? enrollment.created_at);
        const enrollmentExpiresAt = getCourseAccessExpiresAt(
          enrollment.course_id,
          activatedAt,
        );
        if (
          enrollmentExpiresAt !== null &&
          Number.isFinite(enrollmentExpiresAt) &&
          Date.now() < enrollmentExpiresAt
        ) {
          cycleId = enrollment.razorpay_order_id;
          expiresAt = enrollmentExpiresAt;
        }
      }
    } catch (error) {
      console.error("Enrollment lookup failed while recording test progress", error);
    }
  }

  if (!cycleId || expiresAt === null) {
    const entitlement = getCourseEntitlement(
      request,
      user.id,
      class12BoardTestSeries.id,
    );
    if (entitlement) {
      cycleId = entitlement.cycleId ?? `signed-${entitlement.expiresAt}`;
      expiresAt = entitlement.expiresAt;
    }
  }

  if (!cycleId || expiresAt === null || Date.now() >= expiresAt) {
    return NextResponse.json(
      { error: "Test-series access expired. Please subscribe again.", renewalRequired: true },
      { status: 403 },
    );
  }

  try {
    const currentProgress = progressForCycle(storedProgress, cycleId, expiresAt);
    if (currentProgress.completedTests >= currentProgress.limit) {
      return NextResponse.json(
        {
          error: "30 tests complete ho chuke hain. Naya Rs 30 cycle activate karein.",
          progress: currentProgress,
          renewalRequired: true,
        },
        { status: 402 },
      );
    }

    const alreadyCompleted = currentProgress.completedTestIds.includes(testId);
    const progress = alreadyCompleted
      ? currentProgress
      : await recordClass12TestCompletion(accessToken, currentProgress, testId);

    return NextResponse.json({
      recorded: !alreadyCompleted,
      alreadyCompleted,
      progress,
      renewalRequired: progress.completedTests >= progress.limit,
    });
  } catch (error) {
    console.error("Class 12 test progress save failed", error);
    return NextResponse.json(
      { error: "Test result mil gaya hai, lekin progress save nahi ho saki." },
      { status: 503 },
    );
  }
}
