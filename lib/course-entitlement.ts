import { createHmac, timingSafeEqual } from "node:crypto";
import {
  getCourseAccessDurationSeconds,
  paymentProducts,
  type CourseId,
} from "@/lib/courses";

export const COURSE_ENTITLEMENT_MAX_AGE = 365 * 24 * 60 * 60;

type EntitlementPayload = {
  userId: string;
  courseId: CourseId;
  expiresAt: number;
  cycleId?: string;
};

function getEntitlementSecret() {
  return process.env.RAZORPAY_KEY_SECRET;
}

export function courseEntitlementCookieName(courseId: string) {
  return `maphy_access_${courseId}`;
}

export function createCourseEntitlementToken(
  userId: string,
  courseId: CourseId,
  expiresAt = Date.now() + getCourseEntitlementMaxAge(courseId) * 1000,
  cycleId?: string,
) {
  const secret = getEntitlementSecret();
  if (!secret) return null;

  const payload: EntitlementPayload = {
    userId,
    courseId,
    expiresAt,
    cycleId,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
}

export function getCourseEntitlementMaxAge(courseId: string) {
  return getCourseAccessDurationSeconds(courseId) ?? COURSE_ENTITLEMENT_MAX_AGE;
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const item of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = item.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

export function hasCourseEntitlement(
  request: Request,
  userId: string,
  courseId: CourseId,
) {
  const secret = getEntitlementSecret();
  const token = readCookie(request, courseEntitlementCookieName(courseId));
  if (!secret || !token) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expectedSignature = createHmac("sha256", secret)
    .update(encoded)
    .digest("hex");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as EntitlementPayload;
    return (
      payload.userId === userId &&
      payload.courseId === courseId &&
      Date.now() < payload.expiresAt
    );
  } catch {
    return false;
  }
}

export function getCourseEntitlement(
  request: Request,
  userId: string,
  courseId: CourseId,
) {
  const secret = getEntitlementSecret();
  const token = readCookie(request, courseEntitlementCookieName(courseId));
  if (!secret || !token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSignature = createHmac("sha256", secret)
    .update(encoded)
    .digest("hex");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as EntitlementPayload;
    return payload.userId === userId &&
      payload.courseId === courseId &&
      Date.now() < payload.expiresAt
      ? payload
      : null;
  } catch {
    return null;
  }
}

export function getCourseEntitlements(request: Request, userId: string) {
  return paymentProducts
    .map((course) => getCourseEntitlement(request, userId, course.id))
    .filter((entitlement): entitlement is EntitlementPayload => entitlement !== null);
}

export function getEntitledCourseIds(request: Request, userId: string) {
  return paymentProducts
    .map((course) => course.id)
    .filter((courseId) => hasCourseEntitlement(request, userId, courseId));
}
