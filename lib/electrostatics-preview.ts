import { createHmac, timingSafeEqual } from "node:crypto";

export const ELECTROSTATICS_PREVIEW_COOKIE = "maphy_electrostatics_preview";
export const ELECTROSTATICS_PREVIEW_DURATION_MS = 2 * 60 * 1000;
export const ELECTROSTATICS_PREVIEW_PAGE_COUNT = 93;
export const ELECTROSTATICS_PREVIEW_COOKIE_MAX_AGE = 24 * 60 * 60;

function getSigningSecret() {
  return (
    process.env.PREVIEW_SESSION_SECRET ??
    process.env.RAZORPAY_KEY_SECRET ??
    "maphy-electrostatics-preview-v1"
  );
}

function sign(startedAt: string) {
  return createHmac("sha256", getSigningSecret()).update(startedAt).digest("hex");
}

export function createElectrostaticsPreviewToken(startedAt: number) {
  const value = String(startedAt);
  return `${value}.${sign(value)}`;
}

export function readElectrostaticsPreviewToken(token?: string) {
  if (!token) return null;

  const [startedAt, signature] = token.split(".");
  if (!startedAt || !signature) return null;

  const expected = Buffer.from(sign(startedAt));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  const timestamp = Number(startedAt);
  return Number.isFinite(timestamp) ? timestamp : null;
}
