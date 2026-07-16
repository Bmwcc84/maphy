"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { courses, type CourseId } from "@/lib/courses";
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
          const validCourseIds = new Set(courses.map((course) => course.id));
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
            setMessage("Payment verify ho gaya aur course access activate ho gaya.");
            setIsSuccess(true);
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

  if (isChecking) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-white">Checking login...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-3 text-xl font-black">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300 text-slate-950">M</span>
            MAPHY
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
        <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          Abhi Test Mode setup hai. Test payment mein real paisa charge nahi hota.
        </div>

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
                key={course.id}
                className={`flex min-h-80 flex-col rounded-xl border bg-white p-7 shadow-sm ${isEnrolled ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200"}`}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{course.tag}</p>
                <h2 className="mt-4 text-2xl font-black">{course.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{course.detail}</p>
                <div className="mt-auto pt-8">
                  <p className="mb-4 text-3xl font-black">{course.displayPrice}</p>
                  <button
                    type="button"
                    onClick={() => void startPayment(course.id)}
                    disabled={isEnrolled || processingCourse !== null}
                    className={`w-full rounded-lg px-5 py-3 font-black text-white transition disabled:cursor-not-allowed ${isEnrolled ? "bg-emerald-500" : "bg-orange-500 hover:bg-orange-600 disabled:opacity-60"}`}
                  >
                    {isEnrolled
                      ? "Enrolled"
                      : processingCourse === course.id
                        ? "Opening checkout..."
                        : `Pay ${course.displayPrice}`}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
