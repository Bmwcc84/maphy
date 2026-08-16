import { NextRequest, NextResponse } from "next/server";
import { claimPreviewForUser } from "@/lib/server-preview-claim";
import {
  createElectrostaticsPreviewToken,
  ELECTROSTATICS_PREVIEW_COOKIE,
  ELECTROSTATICS_PREVIEW_COOKIE_MAX_AGE,
  ELECTROSTATICS_PREVIEW_DURATION_MS,
  readElectrostaticsPreviewToken,
} from "../../../../../lib/electrostatics-preview";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const existingStartedAt = readElectrostaticsPreviewToken(
    request.cookies.get(ELECTROSTATICS_PREVIEW_COOKIE)?.value,
  );
  const claim = await claimPreviewForUser(
    request,
    "electrostatics-handwritten-notes",
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
    const expiresAt = existingStartedAt + ELECTROSTATICS_PREVIEW_DURATION_MS;
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
  const expiresAt = startedAt + ELECTROSTATICS_PREVIEW_DURATION_MS;
  const response = NextResponse.json(
    {
      expiresAt,
      locked: false,
      reason: null,
    },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );

  response.cookies.set({
    name: ELECTROSTATICS_PREVIEW_COOKIE,
    value: createElectrostaticsPreviewToken(startedAt),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/preview/electrostatics",
    maxAge: ELECTROSTATICS_PREVIEW_COOKIE_MAX_AGE,
  });

  return response;
}
