type AuthenticatedUser = {
  id: string;
  email: string;
  userMetadata: Record<string, unknown>;
};

export function getRequestAccessToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const accessToken = getRequestAccessToken(request);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!accessToken || !supabaseUrl || !publishableKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const user = (await response.json()) as {
    id?: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
  if (!user.id) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    userMetadata: user.user_metadata ?? {},
  };
}
