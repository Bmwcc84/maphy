"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const PREVIEW_SECONDS = 60;

export default function ElectrostaticsPreview() {
  const [secondsLeft, setSecondsLeft] = useState(PREVIEW_SECONDS);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(PREVIEW_SECONDS - elapsed, 0));
    }, 500);

    return () => window.clearInterval(timer);
  }, []);

  const isLocked = secondsLeft <= 0;

  return (
    <section id="electrostatics-preview" className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between gap-3 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            Free 1 minute preview
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Electrostatics Handwritten Notes
          </h2>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ${isLocked ? "bg-orange-500 text-white" : "bg-emerald-400 text-slate-950"}`}>
          {isLocked ? "Locked" : `${secondsLeft}s`}
        </span>
      </div>

      <div className="relative h-[520px] overflow-hidden rounded-lg bg-slate-100">
        <Image
          src="/previews/electrostatics-page-01.png"
          alt="Electrostatics handwritten notes first page preview"
          fill
          priority
          sizes="(min-width: 1024px) 44vw, 100vw"
          className={`object-cover object-top transition duration-500 ${isLocked ? "scale-[1.02] blur-sm" : ""}`}
        />

        {isLocked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 px-5 text-center text-white">
            <div className="max-w-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-200">
                Preview finished
              </p>
              <h3 className="mt-3 text-3xl font-black">
                Full Electrostatics notes unlock karein
              </h3>
              <p className="mt-3 leading-7 text-slate-200">
                Sirf Rs 50 me complete handwritten PDF access milega.
              </p>
              <Link
                href="/login?next=/courses%23electrostatics-handwritten-notes"
                className="mt-6 inline-flex w-full justify-center rounded-lg bg-orange-500 px-5 py-4 text-base font-black text-white transition hover:bg-orange-400"
              >
                Pay Rs 50
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
