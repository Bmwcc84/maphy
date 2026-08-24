"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Activity = { kind: string; createdAt: string; pageUrl?: string; testName?: string; score?: number; totalQuestions?: number; userEmail?: string };
export default function ActivityAdmin() {
  const [records, setRecords] = useState<Activity[]>([]); const [message, setMessage] = useState("Loading private records...");
  useEffect(() => { void (async () => {
    try {
      const sessionResult = await Promise.race([supabase.auth.getSession(), new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("Login check timed out. Refresh the page and login again.")), 10_000))]);
      if (!sessionResult.data.session) return setMessage("Please login with amitkumar847308@gmail.com first.");
      const response = await fetch("/api/activity", { headers: { Authorization: `Bearer ${sessionResult.data.session.access_token}` }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
      const body = await response.json().catch(() => null);
      if (!response.ok) return setMessage(body?.error ?? "Private records could not be loaded.");
      setRecords(body.records ?? []); setMessage("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Private records could not be loaded."); }
  })(); }, []);
  if (message) return <main className="mx-auto max-w-4xl p-8"><p className="font-bold">{message}</p></main>;
  return <main className="mx-auto max-w-6xl p-6 sm:p-10"><h1 className="text-3xl font-black">MAPHY Private Activity</h1><p className="mt-2 text-slate-600">Only your account can open this page.</p><div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="bg-slate-950 text-white"><tr><th className="p-3">Time</th><th className="p-3">Email</th><th className="p-3">Activity</th><th className="p-3">Details</th></tr></thead><tbody>{records.map((r, i) => <tr key={`${r.createdAt}-${i}`} className="border-t"><td className="p-3">{new Date(r.createdAt).toLocaleString("en-IN")}</td><td className="p-3">{r.userEmail ?? "Not logged in"}</td><td className="p-3">{r.kind === "visit" ? "Visit" : "Test attempt"}</td><td className="p-3">{r.kind === "visit" ? r.pageUrl : `${r.testName} - ${r.score}/${r.totalQuestions}`}</td></tr>)}</tbody></table></div></main>;
}
