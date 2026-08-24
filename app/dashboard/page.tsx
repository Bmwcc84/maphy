"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import {
  class12BoardTestSeries,
  class12PhysicsChapters,
  class12PhysicsFolder,
  paymentProducts,
  type CourseId,
} from "@/lib/courses";
import { downloadCoursePdf } from "@/lib/download-course-pdf";
import { supabase } from "@/lib/supabase";

const learningCards = [
  { eyebrow: "CONTINUE LEARNING", title: "Kinematics Sprint", text: "Relative motion, graphs and selected numericals.", action: "Open class", accent: "bg-cyan-300 text-slate-950", href: "/class" },
  { eyebrow: "STUDY NOTES", title: "Chapter-wise Notes", text: "Formula sheets and revision PDFs in one place.", action: "View notes", accent: "bg-orange-500 text-white", href: "/notes" },
  { eyebrow: "PRACTICE", title: "Daily Problem Set", text: "35 exam-focused questions for today.", action: "Start practice", accent: "bg-emerald-500 text-white" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [downloadingCourse, setDownloadingCourse] = useState<CourseId | null>(null);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<CourseId[]>([]);

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      if (!isMounted) return;
      setEmail(data.session.user.email ?? "Student");
      setAccessToken(data.session.access_token);

      try {
        const response = await fetch("/api/enrollments", {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
          cache: "no-store",
        });
        const result = (await response.json()) as { enrollments?: Array<{ course_id: string }> };
        if (response.ok && isMounted) {
          const validCourseIds = new Set<CourseId>(paymentProducts.map((course) => course.id));
          setEnrolledCourseIds(
            (result.enrollments ?? [])
              .map((enrollment) => enrollment.course_id)
              .filter((courseId): courseId is CourseId => validCourseIds.has(courseId as CourseId)),
          );
        }
      } catch (error) {
        console.error("Enrollment load failed", error);
      } finally {
        if (isMounted) setIsChecking(false);
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

  const downloadChapter = async (courseId: CourseId) => {
    setDownloadingCourse(courseId);
    setDownloadMessage("");
    setDownloadFailed(false);

    try {
      await downloadCoursePdf(courseId, accessToken, (progress) => {
        setDownloadMessage(`PDF download ho raha hai... ${progress}%`);
      });
      setDownloadMessage("PDF download ho gaya hai.");
    } catch (error) {
      setDownloadFailed(true);
      setDownloadMessage(error instanceof Error ? error.message : "PDF download nahi ho saka.");
    } finally {
      setDownloadingCourse(null);
    }
  };

  const hasPremiumAccess = enrolledCourseIds.length > 0;
  const hasClass12SeriesAccess = enrolledCourseIds.includes(class12BoardTestSeries.id);
  const isAdmin = email.toLowerCase() === "amitkumar847308@gmail.com";

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
          <Link href="/" aria-label="MAPHY home">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-60 truncate text-sm text-slate-300 sm:block">{email}</span>
            {isAdmin ? (
              <Link
                href="/admin/activity"
                className="rounded-lg border border-cyan-300/70 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950"
              >
                Admin Activity
              </Link>
            ) : null}
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
                {card.href ? (
                  <Link href={card.href} className={`mt-6 block w-full rounded-lg px-4 py-3 text-center text-sm font-black ${card.accent}`}>
                    {card.action}
                  </Link>
                ) : (
                  <button type="button" className={`mt-6 w-full rounded-lg px-4 py-3 text-sm font-black ${card.accent}`}>{card.action}</button>
                )}
              </article>
            ))}
          </div>

          <section className="mt-8" aria-labelledby="bpsc-tre4-heading">
            <div className="flex flex-col gap-5 rounded-lg bg-[#07111f] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">New exam folder</p>
                <h2 id="bpsc-tre4-heading" className="mt-2 text-3xl font-black">BPSC Physics TRE 4.0</h2>
                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  Video classes, chapter PDFs aur saare questions ka ek shuffled bilingual test.
                </p>
              </div>
              <Link
                href="/bpsc-physics-tre-4"
                className="shrink-0 rounded-lg bg-amber-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-amber-300"
              >
                Open BPSC folder
              </Link>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["VIDEO", "Physics Video Classes", "Concept lectures aur focused revision."],
                ["PDF", "Chapter PDF Notes", "Electrostatics aur Current Electricity notes."],
                ["TEST", "Complete Test - Rs 99", "43 shuffled Hindi-English questions, instant result aur PDF download."],
              ].map(([label, title, text], index) => (
                <Link
                  key={label}
                  href={`/bpsc-physics-tre-4?tab=${["videos", "pdfs", "tests"][index]}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-md"
                >
                  <span className="text-xs font-black tracking-[0.18em] text-cyan-700">{label}</span>
                  <h3 className="mt-2 text-xl font-black">{title}</h3>
                  <p className="mt-2 leading-6 text-slate-600">{text}</p>
                </Link>
              ))}
            </div>
          </section>

          <section
            className="mt-8 overflow-hidden rounded-lg bg-[#07111f] text-white shadow-sm"
            aria-labelledby="class-12-test-series-offer"
          >
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-stretch">
              <div className="border-l-4 border-cyan-300 px-6 py-7 sm:px-8">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    id="class-12-test-series-offer"
                    className="max-w-3xl text-3xl font-black uppercase leading-tight text-white sm:text-4xl"
                  >
                    Class 12 Physics Test Series Offer
                  </h2>
                  {hasClass12SeriesAccess ? (
                    <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-emerald-950">
                      Active
                    </span>
                  ) : null}
                </div>
                <p
                  className="mt-5 text-4xl font-black leading-tight text-cyan-200 sm:text-5xl"
                >
                  Rs 1 per test
                </p>
                <p className="mt-2 text-lg font-bold text-slate-300">
                  Effective series price
                </p>
                <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                  Complete bilingual Physics cycle sirf Rs 30 mein. Access 30 unique
                  tests complete hone ya activation ke 30 days baad, jo pehle ho,
                  renew hoga. Electrostatics ke 4 sets ab available hain.
                </p>
              </div>

              <div className="flex min-w-72 flex-col justify-center border-t border-slate-700 px-6 py-7 lg:border-l lg:border-t-0 sm:px-8">
                <span className="text-sm font-bold text-slate-400">Full package</span>
                <strong className="mt-1 text-3xl font-black">30 Tests / Rs 30</strong>
                <span className="mt-2 text-sm font-bold text-cyan-200">4 Electrostatics sets live</span>
                <Link
                  href="/class-12-board-2027/electrostatics-test"
                  className="mt-5 rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-orange-600"
                >
                  {hasClass12SeriesAccess ? "Open Test Series" : "Get Complete Series - Rs 30"}
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Folder</p>
                <h2 className="mt-2 text-3xl font-black">{class12PhysicsFolder.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{class12PhysicsFolder.description}</p>
              </div>
              <Link href="/courses#electrostatics-handwritten-notes" className="rounded-lg bg-slate-950 px-5 py-3 text-center text-sm font-black text-white">
                Open folder
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {downloadMessage ? (
                <div
                  className={`md:col-span-2 xl:col-span-3 rounded-lg border p-4 font-semibold ${
                    downloadFailed
                      ? "border-red-300 bg-red-50 text-red-800"
                      : "border-emerald-300 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {downloadMessage}
                </div>
              ) : null}
              {class12PhysicsChapters.map((chapter) => {
                const isEnrolled = enrolledCourseIds.includes(chapter.id);
                return (
                  <article key={chapter.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-700">{chapter.tag}</p>
                    <h3 className="mt-3 text-2xl font-black">{chapter.title}</h3>
                    <p className="mt-3 min-h-16 leading-7 text-slate-600">{chapter.detail}</p>
                    {chapter.previewPath ? (
                      <Link
                        href={chapter.previewPath}
                        className="mt-4 inline-flex text-sm font-black text-cyan-700 hover:text-cyan-900"
                      >
                        Free PDF preview
                      </Link>
                    ) : null}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-3xl font-black">{chapter.displayPrice}</span>
                      {isEnrolled ? (
                        <button
                          type="button"
                          onClick={() => void downloadChapter(chapter.id)}
                          disabled={downloadingCourse !== null}
                          className="rounded-lg bg-emerald-600 px-5 py-3 text-center text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {downloadingCourse === chapter.id ? "Downloading..." : "Download PDF"}
                        </button>
                      ) : (
                        <Link
                          href={`/courses#${chapter.id}`}
                          className="rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-black text-white"
                        >
                          Buy chapter
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

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
              <h2 className="mt-3 text-2xl font-black">{hasPremiumAccess ? "Premium access" : "Free access"}</h2>
              <p className="mt-3 leading-7 text-orange-50">
                {hasPremiumAccess
                  ? `${enrolledCourseIds.length} paid course${enrolledCourseIds.length > 1 ? "s" : ""} active hai.`
                  : "Premium course access payment ke baad yahin activate hoga."}
              </p>
              <Link href="/courses" className="mt-6 block rounded-lg bg-white px-4 py-3 text-center text-sm font-black text-orange-600">
                {hasPremiumAccess ? "View courses" : "Choose course"}
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
