type PreviewClaimResult =
  | { status: "claimed"; userId: string }
  | { status: "used"; userId: string }
  | { status: "unauthorized" }
  | { status: "unavailable" };

const PREVIEW_USAGE_KEY = "maphy_preview_usage";

function getAccessToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
}

function getPreviewUsage(metadata: Record<string, unknown>) {
  const value = metadata[PREVIEW_USAGE_KEY];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, string>;
  }
  return value as Record<string, string>;
}

export async function claimPreviewForUser(
  request: Request,
  courseId: string,
): Promise<PreviewClaimResult> {
  const accessToken = getAccessToken(request);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!accessToken || !supabaseUrl || !publishableKey) {
    return { status: "unauthorized" };
  }

  const headers = {
    apikey: publishableKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers,
    cache: "no-store",
  });
  if (userResponse.status === 401 || userResponse.status === 403) {
    return { status: "unauthorized" };
  }
  if (!userResponse.ok) {
    return { status: "unavailable" };
  }

  const user = (await userResponse.json()) as {
    id?: string;
    user_metadata?: Record<string, unknown>;
  };
  if (!user.id) return { status: "unauthorized" };

  const metadata = user.user_metadata ?? {};
  const previewUsage = getPreviewUsage(metadata);
  if (previewUsage[courseId]) {
    return { status: "used", userId: user.id };
  }

  const updateResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      data: {
        ...metadata,
        [PREVIEW_USAGE_KEY]: {
          ...previewUsage,
          [courseId]: new Date().toISOString(),
        },
      },
    }),
    cache: "no-store",
  });
  if (updateResponse.status === 401 || updateResponse.status === 403) {
    return { status: "unauthorized" };
  }
  if (!updateResponse.ok) {
    return { status: "unavailable" };
  }

  return { status: "claimed", userId: user.id };
}
