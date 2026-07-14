"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const pdfPath = "/notes/formula-chart.pdf";

export default function NotesPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      if (isMounted) setIsChecking(false);
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

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300" />
          <p className="mt-4 font-semibold text-slate-300">Notes loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <header className="border-b border-white/10 bg-[#07111f] px-5 py-4 text-white sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300 font-black text-slate-950">M</span>
            <span className="text-xl font-black">MAPHY</span>
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/15">
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-[#07111f] p-6 text-white sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">Mathematics Notes</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">Trigonometry Formula Chart</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">6-page quick revision PDF. Formulae ko online padhein ya apne device par download karein.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">
                Open full screen
              </a>
              <a href={pdfPath} download="MAPHY-Trigonometry-Formula-Chart.pdf" className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-black text-white">
                Download PDF
              </a>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <iframe title="MAPHY Trigonometry Formula Chart" src={`${pdfPath}#toolbar=1&navpanes=0`} className="h-[72vh] min-h-[560px] w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
