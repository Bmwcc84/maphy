import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const CLASS12_TEST_LIMIT = 30;
export const CLASS12_PROGRESS_METADATA_KEY = "maphy_class12_test_progress";

export type Class12TestProgress = {
  completedTestIds: string[];
  completedTests: number;
  remainingTests: number;
  limit: number;
};

export type Class12ProgressCycle = Class12TestProgress & {
  cycleId: string;
  expiresAt: number;
  updatedAt: number;
};

type StoredPayload = {
  version: 1;
  cycleId: string;
  expiresAt: number;
  completedTestIds: string[];
  updatedAt: number;
};

function getProgressSecret() {
  return process.env.RAZORPAY_KEY_SECRET ?? null;
}

function progressSummary(completedTestIds: string[]): Class12TestProgress {
  const uniqueIds = [...new Set(completedTestIds)].slice(0, CLASS12_TEST_LIMIT);
  return {
    completedTestIds: uniqueIds,
    completedTests: uniqueIds.length,
    remainingTests: Math.max(CLASS12_TEST_LIMIT - uniqueIds.length, 0),
    limit: CLASS12_TEST_LIMIT,
  };
}

function encodeCycle(payload: StoredPayload) {
  const secret = getProgressSecret();
  if (!secret) throw new Error("Secure test progress is not configured.");
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
}

function decodeCycle(token: string) {
  const secret = getProgressSecret();
  if (!secret) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = Buffer.from(
    createHmac("sha256", secret).update(encoded).digest("hex"),
  );
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as StoredPayload;
    if (
      payload.version !== 1 ||
      !payload.cycleId ||
      !Number.isFinite(payload.expiresAt) ||
      !Array.isArray(payload.completedTestIds)
    ) {
      return null;
    }
    const summary = progressSummary(
      payload.completedTestIds.filter((value): value is string => typeof value === "string"),
    );
    return {
      ...summary,
      cycleId: payload.cycleId,
      expiresAt: payload.expiresAt,
      updatedAt: payload.updatedAt,
    } satisfies Class12ProgressCycle;
  } catch {
    return null;
  }
}

export function readClass12Progress(userMetadata: Record<string, unknown>) {
  const token = userMetadata[CLASS12_PROGRESS_METADATA_KEY];
  return typeof token === "string" ? decodeCycle(token) : null;
}

export function createEmptyClass12Progress(cycleId: string, expiresAt: number) {
  return {
    ...progressSummary([]),
    cycleId,
    expiresAt,
    updatedAt: Date.now(),
  } satisfies Class12ProgressCycle;
}

async function saveClass12Progress(accessToken: string, cycle: Class12ProgressCycle) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    throw new Error("Login progress storage is not configured.");
  }

  const token = encodeCycle({
    version: 1,
    cycleId: cycle.cycleId,
    expiresAt: cycle.expiresAt,
    completedTestIds: cycle.completedTestIds,
    updatedAt: cycle.updatedAt,
  });
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { [CLASS12_PROGRESS_METADATA_KEY]: token } }),
    cache: "no-store",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Unable to save login test progress: ${message}`);
  }
  return cycle;
}

export function progressForCycle(
  stored: Class12ProgressCycle | null,
  cycleId: string,
  expiresAt: number,
) {
  if (stored?.cycleId === cycleId) return stored;
  return createEmptyClass12Progress(cycleId, expiresAt);
}

export async function startClass12ProgressCycle(
  accessToken: string,
  cycleId: string,
  expiresAt: number,
) {
  return saveClass12Progress(
    accessToken,
    createEmptyClass12Progress(cycleId, expiresAt),
  );
}

export async function recordClass12TestCompletion(
  accessToken: string,
  cycle: Class12ProgressCycle,
  testId: string,
) {
  if (
    cycle.completedTests >= cycle.limit ||
    cycle.completedTestIds.includes(testId)
  ) {
    return cycle;
  }
  const summary = progressSummary([...cycle.completedTestIds, testId]);
  return saveClass12Progress(accessToken, {
    ...summary,
    cycleId: cycle.cycleId,
    expiresAt: cycle.expiresAt,
    updatedAt: Date.now(),
  });
}
