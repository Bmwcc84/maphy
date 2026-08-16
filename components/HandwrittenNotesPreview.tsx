"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type PreviewSession = {
  expiresAt: number;
  locked: boolean;
  reason?: "expired" | "used" | null;
};

type HandwrittenNotesPreviewProps = {
  courseId: string;
  pageCount: number;
  previewId: string;
  title: string;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export default function HandwrittenNotesPreview({
  courseId,
  pageCount,
  previewId,
  title,
}: HandwrittenNotesPreviewProps) {
  const router = useRouter();
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [lockReason, setLockReason] = useState<"expired" | "used" | null>(null);
  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, index) => index + 1),
    [pageCount],
  );

  useEffect(() => {
    let cancelled = false;

    async function startPreview() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace(`/login?next=/preview/${previewId}`);
          return;
        }

        const response = await fetch(`/api/preview/${previewId}/session`, {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
          cache: "no-store",
        });
        if (response.status === 401) {
          router.replace(`/login?next=/preview/${previewId}`);
          return;
        }
        if (!response.ok) {
          throw new Error("Preview session could not start");
        }

        const session = (await response.json()) as PreviewSession;
        if (!cancelled) {
          setExpiresAt(session.expiresAt);
          setLockReason(session.reason ?? null);
          setSecondsLeft(
            session.locked
              ? 0
              : Math.max(Math.ceil((session.expiresAt - Date.now()) / 1000), 0),
          );
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    void startPreview();
    return () => {
      cancelled = true;
    };
  }, [previewId, router]);

  useEffect(() => {
    if (expiresAt === null) return;

    const updateCountdown = () => {
      setSecondsLeft(Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0));
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 500);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const isLoading = expiresAt === null && !loadError;
  const isLocked = loadError || (expiresAt !== null && secondsLeft <= 0);
  const previewUsed = lockReason === "used";

  return (
    <section
      id={`${previewId}-preview`}
      className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/30"
    >
      <div className="flex items-center justify-between gap-3 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            One free preview per email login
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white">
            {title}
          </h2>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ${
            isLocked
              ? "bg-orange-500 text-white"
              : "bg-emerald-400 text-slate-950"
          }`}
        >
          {isLoading ? "Starting..." : isLocked ? "Locked" : formatTime(secondsLeft)}
        </span>
      </div>

      <div className="relative h-[76vh] min-h-[540px] overflow-y-auto rounded-lg bg-slate-200">
        {!isLoading && !isLocked ? (
          <div className="mx-auto max-w-4xl space-y-3 p-2 sm:p-4">
            {pages.map((page) => (
              <figure
                key={page}
                className="relative overflow-hidden rounded border border-slate-300 bg-white shadow-sm"
              >
                <Image
                  src={`/api/preview/${previewId}/${page}`}
                  alt={`${title} page ${page}`}
                  width={794}
                  height={1123}
                  loading={page === 1 ? "eager" : "lazy"}
                  priority={page === 1}
                  unoptimized
                  className="h-auto w-full"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs font-black tracking-[0.16em] text-slate-500/55">
                  MAPHY PREVIEW - PAGE {page}
                </div>
              </figure>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-center text-slate-700">
            <p className="font-bold">PDF preview load ho raha hai...</p>
          </div>
        ) : null}

        {isLocked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 px-5 text-center text-white">
            <div className="max-w-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-200">
                {previewUsed ? "Free preview already used" : "2 minute preview finished"}
              </p>
              <h3 className="mt-3 text-3xl font-black">
                Full handwritten notes unlock karein
              </h3>
              <p className="mt-3 leading-7 text-slate-200">
                {previewUsed
                  ? "Is email account ka free preview pehle hi use ho chuka hai."
                  : "Preview time khatam ho gaya hai."}{" "}
                Sirf Rs 50 me complete handwritten PDF download milega.
              </p>
              <Link
                href={`/courses#${courseId}`}
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
