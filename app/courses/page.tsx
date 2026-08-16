"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { courses, type CourseId } from "@/lib/courses";
import { downloadCoursePdf } from "@/lib/download-course-pdf";
import { supabase } from "@/lib/supabase";

type RazorpayResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { email: string };
  theme: { color: string };
  handler: (result: RazorpayResult) => void;
  modal: { ondismiss: () => void };
};

type EnrollmentResponse = {
  enrollments?: Array<{ course_id: string }>;
  error?: string;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>("script[data-razorpay-checkout]");
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CoursesPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [processingCourse, setProcessingCourse] = useState<CourseId | null>(null);
  const [downloadingCourse, setDownloadingCourse] = useState<CourseId | null>(null);
  const [recoveringCourse, setRecoveringCourse] = useState<CourseId | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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
      setAccessToken(data.session.access_token);
      setEmail(data.session.user.email ?? "");

      try {
        const response = await fetch("/api/enrollments", {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
          cache: "no-store",
        });
        const result = (await response.json()) as EnrollmentResponse;
        if (response.ok && isMounted) {
          const validCourseIds = new Set<CourseId>(courses.map((course) => course.id));
          setEnrolledCourseIds(
            (result.enrollments ?? [])
              .map((enrollment) => enrollment.course_id)
              .filter((courseId): courseId is CourseId => validCourseIds.has(courseId as CourseId)),
          );
        }
      } catch {
        if (isMounted) {
          setMessage("Existing course access abhi load nahi ho saka. Page refresh karein.");
        }
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

  const downloadCourseContent = async (courseId: CourseId) => {
    setDownloadingCourse(courseId);

    try {
      await downloadCoursePdf(courseId, accessToken, (progress) => {
        setMessage(`PDF download ho raha hai... ${progress}%`);
      });
    } finally {
      setDownloadingCourse(null);
    }
  };

  const startPayment = async (courseId: CourseId) => {
    setProcessingCourse(courseId);
    setMessage("");
    setIsSuccess(false);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout load nahi hua. Internet connection check karein.");

      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ courseId }),
      });
      const order = (await orderResponse.json()) as {
        error?: string;
        key?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        mode?: "live" | "test";
        course?: { title: string };
      };
      if (!orderResponse.ok || !order.key || !order.orderId || !order.amount || !order.currency) {
        throw new Error(order.error ?? "Payment start nahi ho saka.");
      }

      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "MAPHY",
        description: order.course?.title ?? "Course enrollment",
        order_id: order.orderId,
        prefill: { email },
        theme: { color: "#06b6d4" },
        modal: { ondismiss: () => setProcessingCourse(null) },
        handler: async (result) => {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ courseId, ...result }),
          });
          const verification = (await verifyResponse.json()) as { error?: string; verified?: boolean; activated?: boolean };
          if (!verifyResponse.ok || !verification.verified) {
            setMessage(verification.error ?? "Payment verify nahi ho saka.");
            setIsSuccess(false);
          } else {
            setEnrolledCourseIds((current) => current.includes(courseId) ? current : [...current, courseId]);
            setIsSuccess(true);
            try {
              setMessage("Payment successful. PDF download ho raha hai...");
              await downloadCourseContent(courseId);
              setMessage("Payment successful. PDF download ho gaya hai.");
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? `Payment successful aur access active hai. ${error.message} Download PDF button dobara dabayein.`
                  : "Payment successful aur access active hai. Download PDF button dabayein.",
              );
            }
          }
          setProcessingCourse(null);
        },
      });
      checkout.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment start nahi ho saka.");
      setIsSuccess(false);
      setProcessingCourse(null);
    }
  };

  const handleCourseDownload = async (courseId: CourseId) => {
    setMessage("");
    setIsSuccess(true);

    try {
      await downloadCourseContent(courseId);
      setMessage("PDF download ho gaya hai.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PDF download nahi ho saka.");
      setIsSuccess(false);
    }
  };

  const recoverPurchase = async (courseId: CourseId) => {
    setRecoveringCourse(courseId);
    setMessage("Paid purchase check ho raha hai...");
    setIsSuccess(false);

    try {
      const response = await fetch("/api/payments/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ courseId }),
      });
      const result = (await response.json().catch(() => null)) as
        | { error?: string; recovered?: boolean }
        | null;
      if (!response.ok || !result?.recovered) {
        throw new Error(result?.error ?? "Paid purchase recover nahi ho saka.");
      }

      setEnrolledCourseIds((current) =>
        current.includes(courseId) ? current : [...current, courseId],
      );
      setIsSuccess(true);
      setMessage("Payment mil gaya. PDF download ho raha hai...");
      await downloadCourseContent(courseId);
      setMessage("Payment mil gaya aur PDF download ho gaya hai.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Paid purchase recover nahi ho saka.");
      setIsSuccess(false);
    } finally {
      setRecoveringCourse(null);
    }
  };

  if (isChecking) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-white">Checking login...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" aria-label="MAPHY dashboard">
            <BrandLogo />
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-bold">Dashboard</Link>
        </div>
      </header>

      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Course enrollment</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Choose your MAPHY course.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">UPI, cards aur netbanking ke secure checkout ke liye Razorpay integration ready hai.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {message && (
          <div className={`mb-8 rounded-lg border p-4 font-semibold ${isSuccess ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <article
                id={course.id}
                key={course.id}
                className={`flex min-h-80 flex-col rounded-xl border bg-white p-7 shadow-sm ${isEnrolled ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200"}`}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{course.tag}</p>
                <h2 className="mt-4 text-2xl font-black">{course.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{course.detail}</p>
                {course.previewPath ? (
                  <Link
                    href={course.previewPath}
                    className="mt-5 inline-flex w-fit rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-800 transition hover:bg-cyan-100"
                  >
                    Free PDF preview
                  </Link>
                ) : null}
                <div className="mt-auto pt-8">
                  <p className="mb-4 text-3xl font-black">{course.displayPrice}</p>
                  {isEnrolled && course.contentFile ? (
                    <button
                      type="button"
                      onClick={() => void handleCourseDownload(course.id)}
                      disabled={downloadingCourse !== null}
                      className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingCourse === course.id ? "Downloading PDF..." : "Download PDF"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => void startPayment(course.id)}
                        disabled={isEnrolled || processingCourse !== null || recoveringCourse !== null}
                        className={`w-full rounded-lg px-5 py-3 font-black text-white transition disabled:cursor-not-allowed ${isEnrolled ? "bg-emerald-500" : "bg-orange-500 hover:bg-orange-600 disabled:opacity-60"}`}
                      >
                        {isEnrolled
                          ? "Enrolled"
                          : processingCourse === course.id
                            ? "Opening checkout..."
                            : `Pay ${course.displayPrice}`}
                      </button>
                      <button
                        type="button"
                        onClick={() => void recoverPurchase(course.id)}
                        disabled={processingCourse !== null || recoveringCourse !== null}
                        className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {recoveringCourse === course.id
                          ? "Checking payment..."
                          : "Already paid? Recover PDF"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
