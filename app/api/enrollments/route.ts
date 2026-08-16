import { NextResponse } from "next/server";
import {
  progressForCycle,
  readClass12Progress,
  type Class12TestProgress,
} from "@/lib/class12-test-progress";
import { getCourseEntitlements } from "@/lib/course-entitlement";
import { class12BoardTestSeries, getCourseAccessExpiresAt } from "@/lib/courses";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { getEnrollmentsForUser } from "@/lib/server-supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Please login first." }, { status: 401 });
  }

  const entitlements = getCourseEntitlements(request, user.id);
  const storedProgress = readClass12Progress(user.userMetadata);
  const metadataCycleIsActive = Boolean(
    storedProgress && Date.now() < storedProgress.expiresAt,
  );
  let testSeriesProgress: Class12TestProgress | null = storedProgress;
  let testSeriesRenewalRequired = Boolean(
    storedProgress && storedProgress.completedTests >= storedProgress.limit,
  );

  try {
    const enrollments = await getEnrollmentsForUser(user.id);
    const activeEnrollments: Array<Record<string, unknown>> = [];
    const blockedCourseIds = new Set<string>();

    for (const enrollment of enrollments) {
      const activatedAt = Date.parse(enrollment.updated_at ?? enrollment.created_at);
      const expiresAt = getCourseAccessExpiresAt(enrollment.course_id, activatedAt);
      if (expiresAt !== null && (!Number.isFinite(expiresAt) || Date.now() >= expiresAt)) {
        continue;
      }

      let enrollmentProgress: Class12TestProgress | null = null;
      if (enrollment.course_id === class12BoardTestSeries.id && expiresAt !== null) {
        enrollmentProgress = progressForCycle(
          storedProgress,
          enrollment.razorpay_order_id,
          expiresAt,
        );
        testSeriesProgress = enrollmentProgress;
        testSeriesRenewalRequired =
          enrollmentProgress.completedTests >= enrollmentProgress.limit;
        if (testSeriesRenewalRequired) {
          blockedCourseIds.add(enrollment.course_id);
          continue;
        }
      }

      activeEnrollments.push({
        ...enrollment,
        expires_at: expiresAt === null ? null : new Date(expiresAt).toISOString(),
        ...(enrollmentProgress ? { test_progress: enrollmentProgress } : {}),
      });
    }

    const enrolledIds = new Set(activeEnrollments.map((item) => item.course_id));
    for (const entitlement of entitlements) {
      if (
        enrolledIds.has(entitlement.courseId) ||
        blockedCourseIds.has(entitlement.courseId)
      ) {
        continue;
      }

      let entitlementProgress: Class12TestProgress | null = null;
      if (entitlement.courseId === class12BoardTestSeries.id) {
        const cycleId =
          entitlement.cycleId ?? storedProgress?.cycleId ?? `signed-${entitlement.expiresAt}`;
        entitlementProgress = progressForCycle(
          storedProgress,
          cycleId,
          entitlement.expiresAt,
        );
        testSeriesProgress = entitlementProgress;
        testSeriesRenewalRequired =
          entitlementProgress.completedTests >= entitlementProgress.limit;
        if (testSeriesRenewalRequired) continue;
      }

      activeEnrollments.push({
        course_id: entitlement.courseId,
        payment_status: "captured",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(entitlement.expiresAt).toISOString(),
        ...(entitlementProgress ? { test_progress: entitlementProgress } : {}),
      });
      enrolledIds.add(entitlement.courseId);
    }

    if (
      metadataCycleIsActive &&
      storedProgress &&
      !enrolledIds.has(class12BoardTestSeries.id) &&
      storedProgress.completedTests < storedProgress.limit
    ) {
      activeEnrollments.push({
        course_id: class12BoardTestSeries.id,
        payment_status: "captured",
        created_at: new Date(storedProgress.updatedAt).toISOString(),
        updated_at: new Date(storedProgress.updatedAt).toISOString(),
        expires_at: new Date(storedProgress.expiresAt).toISOString(),
        test_progress: storedProgress,
      });
      testSeriesRenewalRequired = false;
    }

    return NextResponse.json({
      enrollments: activeEnrollments,
      testSeriesProgress,
      testSeriesRenewalRequired,
    });
  } catch (error) {
    console.error("Enrollment lookup failed", error);
    const fallbackEnrollments: Array<Record<string, unknown>> = [];
    for (const entitlement of entitlements) {
      if (entitlement.courseId !== class12BoardTestSeries.id) {
        fallbackEnrollments.push({
          course_id: entitlement.courseId,
          payment_status: "captured",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expires_at: new Date(entitlement.expiresAt).toISOString(),
        });
        continue;
      }
      const cycleId =
        entitlement.cycleId ?? storedProgress?.cycleId ?? `signed-${entitlement.expiresAt}`;
      const progress = progressForCycle(storedProgress, cycleId, entitlement.expiresAt);
      testSeriesProgress = progress;
      testSeriesRenewalRequired = progress.completedTests >= progress.limit;
      if (!testSeriesRenewalRequired) {
        fallbackEnrollments.push({
          course_id: entitlement.courseId,
          payment_status: "captured",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expires_at: new Date(entitlement.expiresAt).toISOString(),
          test_progress: progress,
        });
      }
    }

    if (
      metadataCycleIsActive &&
      storedProgress &&
      !fallbackEnrollments.some((item) => item.course_id === class12BoardTestSeries.id) &&
      storedProgress.completedTests < storedProgress.limit
    ) {
      fallbackEnrollments.push({
        course_id: class12BoardTestSeries.id,
        payment_status: "captured",
        created_at: new Date(storedProgress.updatedAt).toISOString(),
        updated_at: new Date(storedProgress.updatedAt).toISOString(),
        expires_at: new Date(storedProgress.expiresAt).toISOString(),
        test_progress: storedProgress,
      });
    }

    if (fallbackEnrollments.length > 0 || testSeriesRenewalRequired) {
      return NextResponse.json({
        enrollments: fallbackEnrollments,
        testSeriesProgress,
        testSeriesRenewalRequired,
      });
    }
    return NextResponse.json(
      { error: "Course access is temporarily unavailable." },
      { status: 503 },
    );
  }
}
