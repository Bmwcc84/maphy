import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";
import {
  CURRENT_ELECTRICITY_PREVIEW_COOKIE,
  CURRENT_ELECTRICITY_PREVIEW_DURATION_MS,
  CURRENT_ELECTRICITY_PREVIEW_PAGE_COUNT,
  readCurrentElectricityPreviewToken,
} from "../../../../../lib/current-electricity-preview";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ page: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const startedAt = readCurrentElectricityPreviewToken(
    request.cookies.get(CURRENT_ELECTRICITY_PREVIEW_COOKIE)?.value,
  );
  if (startedAt === null) {
    return new Response("Preview session required", { status: 401 });
  }
  if (Date.now() >= startedAt + CURRENT_ELECTRICITY_PREVIEW_DURATION_MS) {
    return new Response("Preview expired", { status: 403 });
  }

  const { page } = await context.params;
  const pageNumber = Number(page);
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > CURRENT_ELECTRICITY_PREVIEW_PAGE_COUNT
  ) {
    return new Response("Page not found", { status: 404 });
  }

  const fileName = `page-${String(pageNumber).padStart(2, "0")}.jpg`;
  const filePath = path.join(
    process.cwd(),
    "content",
    "previews",
    "current-electricity",
    fileName,
  );
  const file = await readFile(filePath);

  return new Response(new Uint8Array(file), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `inline; filename="current-electricity-preview-${pageNumber}.jpg"`,
      "Content-Type": "image/jpeg",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
