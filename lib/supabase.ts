import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

// Keep static builds and the public landing page available even before the
// deployment environment has been configured. Auth calls still fail safely
// until the real public Supabase values are provided in Vercel.
export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabasePublishableKey ?? "placeholder-publishable-key",
);
