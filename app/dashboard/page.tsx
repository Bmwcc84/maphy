"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const learningCards = [
  { eyebrow: "CONTINUE LEARNING", title: "Kinematics Sprint", text: "Relative motion, graphs and selected numericals.", action: "Open class", accent: "bg-cyan-300 text-slate-950" },
  { eyebrow: "STUDY NOTES", title: "Chapter-wise Notes", text: "Formula sheets and revision PDFs in one place.", action: "View notes", accent: "bg-orange-500 text-white" },
  { eyebrow: "PRACTICE", title: "Daily Problem Set", text: "35 exam-focused questions for today.", action: "Start practice", accent: "bg-emerald-500 text-white" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      if (isMounted) {
        setEmail(data.session.user.email ?? "Student");
        setIsChecking(false);
      }
    };
    void checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300" />
          <p className="mt-4 font-semibold text-slate-300">Dashboard loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <header className="border-b border-white/10 bg-[#07111f] px-5 py-4 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300 font-black text-slate-950">M</span>
            <span className="text-xl font-black">MAPHY</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-60 truncate text-sm text-slate-300 sm:block">{email}</span>
            <button type="button" onClick={logout} disabled={isSigningOut} className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/15 disabled:opacity-60">
              {isSigningOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <section className="bg-[#07111f] px-5 pb-16 pt-12 text-white sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">Student Dashboard</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Welcome back, Student.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">Aaj ki class continue karein, notes revise karein aur practice complete karein.</p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {learningCards.map((card) => (
              <article key={card.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-black tracking-[0.16em] text-cyan-700">{card.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-black">{card.title}</h2>
                <p className="mt-3 min-h-14 leading-7 text-slate-600">{card.text}</p>
                <button type="button" className={`mt-6 w-full rounded-lg px-4 py-3 text-sm font-black ${card.accent}`}>{card.action}</button>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-sm font-black text-cyan-700">TODAY&apos;S PLAN</p><h2 className="mt-2 text-2xl font-black">3 focused tasks</h2></div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">0/3 done</span>
              </div>
              <div className="mt-6 space-y-3">
                {["Watch concept class", "Solve 35 numericals", "Revise formula sheet"].map((task, index) => (
                  <div key={task} className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                    <span className="font-bold text-slate-800">{task}</span>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-lg bg-orange-500 p-6 text-white shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-orange-100">Account</p>
              <h2 className="mt-3 text-2xl font-black">Free access</h2>
              <p className="mt-3 leading-7 text-orange-50">Premium course access payment ke baad yahin activate hoga.</p>
              <Link href="/#courses" className="mt-6 block rounded-lg bg-white px-4 py-3 text-center text-sm font-black text-orange-600">View courses</Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
