import { NextRequest, NextResponse } from "next/server";
import { claimPreviewForUser } from "@/lib/server-preview-claim";
import {
  createCurrentElectricityPreviewToken,
  CURRENT_ELECTRICITY_PREVIEW_COOKIE,
  CURRENT_ELECTRICITY_PREVIEW_COOKIE_MAX_AGE,
  CURRENT_ELECTRICITY_PREVIEW_DURATION_MS,
  readCurrentElectricityPreviewToken,
} from "../../../../../lib/current-electricity-preview";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const existingStartedAt = readCurrentElectricityPreviewToken(
    request.cookies.get(CURRENT_ELECTRICITY_PREVIEW_COOKIE)?.value,
  );
  const claim = await claimPreviewForUser(
    request,
    "current-electricity-handwritten-notes",
  );
  if (claim.status === "unauthorized") {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }
  if (claim.status === "unavailable") {
    return NextResponse.json(
      { error: "Preview access check is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (existingStartedAt !== null) {
    const expiresAt = existingStartedAt + CURRENT_ELECTRICITY_PREVIEW_DURATION_MS;
    return NextResponse.json(
      {
        expiresAt,
        locked: Date.now() >= expiresAt,
        reason: Date.now() >= expiresAt ? "expired" : null,
      },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }

  if (claim.status === "used") {
    return NextResponse.json(
      { expiresAt: 0, locked: true, reason: "used" },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }

  const startedAt = Date.now();
  const expiresAt = startedAt + CURRENT_ELECTRICITY_PREVIEW_DURATION_MS;
  const response = NextResponse.json(
    { expiresAt, locked: false, reason: null },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );

  response.cookies.set({
    name: CURRENT_ELECTRICITY_PREVIEW_COOKIE,
    value: createCurrentElectricityPreviewToken(startedAt),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/preview/current-electricity",
    maxAge: CURRENT_ELECTRICITY_PREVIEW_COOKIE_MAX_AGE,
  });

  return response;
}
