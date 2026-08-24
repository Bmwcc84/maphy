"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SiteActivityTracker() {
  const pathname = usePathname();
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      void fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json", ...(data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}) }, body: JSON.stringify({ kind: "visit", pageUrl: window.location.href }) });
    });
  }, [pathname]);
  return null;
}
