"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/lib/supabase";

const videoUrl = "https://youtu.be/MdDhFdfxhUg?si=w_ebjSZ90bfFtRP3";

export default function ClassPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      if (!data.session) {
        router.replace("/login");
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-semibold">Class load ho rahi hai...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" aria-label="MAPHY dashboard">
            <BrandLogo size="lg" />
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-600 px-4 py-2 font-bold transition hover:border-cyan-300 hover:text-cyan-300"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="mb-3 text-sm font-black tracking-[0.25em] text-cyan-300">
            CLASS 12 VIDEO CLASSES
          </p>
          <h1 className="text-4xl font-black sm:text-5xl">Physics Classes & Test Solutions</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Video ko dhyan se dekhein aur important points apne notes mein likhein.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-video bg-black">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/MdDhFdfxhUg?rel=0&modestbranding=1"
              title="Kinematics Sprint class video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Class video</h2>
              <p className="mt-1 text-slate-600">
                Video yahan play na ho to YouTube par kholen.
              </p>
            </div>
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-orange-500 px-6 py-3 text-center font-black text-white transition hover:bg-orange-600"
            >
              YouTube par kholen
            </a>
          </div>
        </div>

        <article className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-cyan-700">Test solution 01</p>
            <h2 className="mt-2 text-2xl font-black">Class 12 Test 1 Solution</h2>
            <p className="mt-2 max-w-2xl text-slate-700">
              Electrostatics Test 1 ke answers aur explanations yahan dekhein.
            </p>
          </div>
          <Link
            href="/class-12-board-2027/electrostatics-test"
            className="mt-5 inline-flex shrink-0 rounded-xl bg-cyan-700 px-6 py-3 font-black text-white transition hover:bg-cyan-800 sm:mt-0"
          >
            Test 1 Solution kholen
          </Link>
        </article>
      </section>
    </main>
  );
}
