"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Activity = { kind: string; createdAt: string; pageUrl?: string; testName?: string; score?: number; totalQuestions?: number; userEmail?: string };
export default function ActivityAdmin() {
  const [records, setRecords] = useState<Activity[]>([]); const [message, setMessage] = useState("Loading private records...");
  useEffect(() => { void supabase.auth.getSession().then(async ({ data }) => { if (!data.session) return setMessage("Please login with the admin account."); const response = await fetch("/api/activity", { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: "no-store" }); const body = await response.json(); if (!response.ok) return setMessage(body.error ?? "Access denied."); setRecords(body.records); setMessage(""); }); }, []);
  if (message) return <main className="mx-auto max-w-4xl p-8"><p className="font-bold">{message}</p></main>;
  return <main className="mx-auto max-w-6xl p-6 sm:p-10"><h1 className="text-3xl font-black">MAPHY Private Activity</h1><p className="mt-2 text-slate-600">Only your account can open this page.</p><div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="bg-slate-950 text-white"><tr><th className="p-3">Time</th><th className="p-3">Email</th><th className="p-3">Activity</th><th className="p-3">Details</th></tr></thead><tbody>{records.map((r, i) => <tr key={`${r.createdAt}-${i}`} className="border-t"><td className="p-3">{new Date(r.createdAt).toLocaleString("en-IN")}</td><td className="p-3">{r.userEmail ?? "Not logged in"}</td><td className="p-3">{r.kind === "visit" ? "Visit" : "Test attempt"}</td><td className="p-3">{r.kind === "visit" ? r.pageUrl : `${r.testName} - ${r.score}/${r.totalQuestions}`}</td></tr>)}</tbody></table></div></main>;
}
