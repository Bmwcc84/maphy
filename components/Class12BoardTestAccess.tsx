"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { class12BoardTestSeries } from "@/lib/courses";
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
  modal: { ondismiss: () => void };
  handler: (result: RazorpayResult) => void;
};

type RazorpayWindow = Window & {
  Razorpay?: new (options: RazorpayOptions) => { open: () => void };
};

type EnrollmentResponse = {
  error?: string;
  enrollments?: Array<{
    course_id: string;
    expires_at?: string | null;
    test_progress?: TestProgress | null;
  }>;
  testSeriesProgress?: TestProgress | null;
  testSeriesRenewalRequired?: boolean;
};

type TestProgress = {
  completedTests: number;
  remainingTests: number;
  limit: number;
};

const TEST_PATH = "/class-12-board-2027/electrostatics-test";

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    const razorpayWindow = window as RazorpayWindow;
    if (razorpayWindow.Razorpay) return resolve(true);

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-razorpay-checkout]",
    );
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

function formatExpiry(value: string | null) {
  if (!value) return "30 days after activation";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function Class12BoardTestAccess({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState<TestProgress | null>(null);
  const [renewalRequired, setRenewalRequired] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAccess(token: string, userEmail: string) {
      if (!mounted) return;
      setAccessToken(token);
      setEmail(userEmail);
      setFailed(false);
      setMessage("");

      try {
        const response = await fetch("/api/enrollments", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const result = (await response.json().catch(() => null)) as
          | EnrollmentResponse
          | null;
        if (!response.ok) {
          throw new Error(result?.error ?? "Subscription access could not be checked.");
        }

        const enrollment = result?.enrollments?.find(
          (item) => item.course_id === class12BoardTestSeries.id,
        );
        if (!mounted) return;
        setHasAccess(Boolean(enrollment));
        setExpiresAt(enrollment?.expires_at ?? null);
        setTestProgress(enrollment?.test_progress ?? result?.testSeriesProgress ?? null);
        setRenewalRequired(Boolean(result?.testSeriesRenewalRequired));
        if (!enrollment && result?.testSeriesRenewalRequired) {
          setFailed(true);
          setMessage(
            "Aapke 30 unique tests complete ho chuke hain. Agle cycle ke liye Rs 30 payment karein.",
          );
        }
      } catch (error) {
        if (!mounted) return;
        setFailed(true);
        setMessage(
          error instanceof Error
            ? error.message
            : "Subscription access could not be checked.",
        );
      } finally {
        if (mounted) setChecking(false);
      }
    }

    async function initialize() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) {
        setChecking(false);
        return;
      }
      await checkAccess(data.session.access_token, data.session.user.email ?? "");
    }

    void initialize();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) {
        setAccessToken("");
        setEmail("");
        setHasAccess(false);
        setExpiresAt(null);
        setTestProgress(null);
        setRenewalRequired(false);
        setChecking(false);
        return;
      }
      setChecking(true);
      void checkAccess(session.access_token, session.user.email ?? "");
    });

    function handleProgress(event: Event) {
      const detail = (event as CustomEvent<TestProgress>).detail;
      if (!detail || !mounted) return;
      setTestProgress(detail);
      setRenewalRequired(detail.completedTests >= detail.limit);
    }
    window.addEventListener("maphy-class12-test-progress", handleProgress);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener("maphy-class12-test-progress", handleProgress);
    };
  }, []);

  async function startSubscription() {
    if (!accessToken) return;
    setProcessing(true);
    setFailed(false);
    setMessage("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout load nahi hua. Internet check karein.");

      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ courseId: class12BoardTestSeries.id }),
      });
      const order = (await orderResponse.json().catch(() => null)) as
        | {
            error?: string;
            key?: string;
            orderId?: string;
            amount?: number;
            currency?: string;
            course?: { title: string };
          }
        | null;
      if (
        !orderResponse.ok ||
        !order?.key ||
        !order.orderId ||
        !order.amount ||
        !order.currency
      ) {
        throw new Error(order?.error ?? "Subscription payment start nahi ho saka.");
      }

      const RazorpayCheckout = (window as RazorpayWindow).Razorpay;
      if (!RazorpayCheckout) throw new Error("Razorpay checkout unavailable hai.");

      const checkout = new RazorpayCheckout({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "MAPHY",
        description: order.course?.title ?? class12BoardTestSeries.title,
        order_id: order.orderId,
        prefill: { email },
        theme: { color: "#0891b2" },
        modal: { ondismiss: () => setProcessing(false) },
        handler: async (result) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                courseId: class12BoardTestSeries.id,
                ...result,
              }),
            });
            const verification = (await verifyResponse.json().catch(() => null)) as
              | { error?: string; verified?: boolean; expiresAt?: number }
              | null;
            if (!verifyResponse.ok || !verification?.verified) {
              throw new Error(
                verification?.error ?? "Payment verify nahi hua. Recover Access use karein.",
              );
            }

            setHasAccess(true);
            setTestProgress({ completedTests: 0, remainingTests: 30, limit: 30 });
            setRenewalRequired(false);
            setExpiresAt(
              verification.expiresAt
                ? new Date(verification.expiresAt).toISOString()
                : null,
            );
            setFailed(false);
            setMessage(
              "Payment successful. Fresh 30-test cycle active hai, maximum validity 30 days hai.",
            );
          } catch (error) {
            setFailed(true);
            setMessage(
              error instanceof Error
                ? error.message
                : "Payment verify nahi hua. Recover Access use karein.",
            );
          } finally {
            setProcessing(false);
          }
        },
      });
      checkout.open();
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error ? error.message : "Subscription payment start nahi ho saka.",
      );
      setProcessing(false);
    }
  }

  async function recoverSubscription() {
    if (!accessToken) return;
    setRecovering(true);
    setFailed(false);
    setMessage("Paid subscription check ho rahi hai...");

    try {
      const response = await fetch("/api/payments/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ courseId: class12BoardTestSeries.id }),
      });
      const result = (await response.json().catch(() => null)) as
        | { error?: string; recovered?: boolean; expiresAt?: number }
        | null;
      if (!response.ok || !result?.recovered) {
        throw new Error(result?.error ?? "Paid subscription nahi mili.");
      }

      setHasAccess(true);
      setRenewalRequired(false);
      setExpiresAt(result.expiresAt ? new Date(result.expiresAt).toISOString() : null);
      setFailed(false);
      setMessage("Subscription recovered. Test series access active hai.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Subscription recover nahi hui.");
    } finally {
      setRecovering(false);
    }
  }

  if (checking) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="h-2 w-40 animate-pulse bg-cyan-600" />
        <p className="mt-4 font-bold text-slate-600">Subscription access check ho raha hai...</p>
      </section>
    );
  }

  if (!hasAccess) {
    return (
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                Complete Physics Test Series
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                {renewalRequired
                  ? "30 tests complete. Renew your series."
                  : "30 tests. One protected payment cycle."}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Ek Rs 30 payment se 30 unique tests unlock honge. Cycle 30 tests complete
                hone ya activation ke 30 days baad, jo pehle ho, expire ho jayega.
              </p>
              <div className="mt-6 grid gap-2 text-sm font-black text-slate-700 sm:grid-cols-3 sm:gap-5">
                <span>30 bilingual tests</span>
                <span>Instant results</span>
                <span>Question PDFs</span>
              </div>
            </div>
            <div className="min-w-64 border-l-4 border-orange-500 pl-6">
              <span className="block text-sm font-black uppercase text-slate-500">Full series</span>
              <strong className="mt-1 block text-5xl font-black text-slate-950">Rs 30</strong>
              <span className="mt-1 block text-sm font-bold text-slate-600">
                30 tests or 30 days
              </span>
            </div>
          </div>

          {message ? (
            <div
              className={`mt-7 border-l-4 px-5 py-4 font-bold ${
                failed
                  ? "border-red-500 bg-red-50 text-red-800"
                  : "border-cyan-500 bg-cyan-50 text-cyan-900"
              }`}
              role="status"
            >
              {message}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {accessToken ? (
              <>
                <button
                  type="button"
                  onClick={startSubscription}
                  disabled={processing || recovering}
                  className="min-h-12 w-full rounded-lg bg-orange-500 px-7 py-3 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {processing ? "Opening payment..." : "Get Complete Series - Rs 30"}
                </button>
                <button
                  type="button"
                  onClick={recoverSubscription}
                  disabled={processing || recovering}
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-6 py-3 font-black text-slate-800 transition hover:border-cyan-500 hover:text-cyan-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {recovering ? "Checking..." : "Recover Paid Access"}
                </button>
              </>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(TEST_PATH)}`}
                className="min-h-12 w-full rounded-lg bg-orange-500 px-7 py-3 text-center font-black text-white transition hover:bg-orange-600 sm:w-auto"
              >
                Login to Get Series - Rs 30
              </Link>
            )}
          </div>
          <p className="mt-4 break-words text-sm font-semibold text-slate-500">
            Rs 1 ka individual test purchase option available nahi hai.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-7 sm:px-8">
        <div className="border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-900">
          Subscription active. {testProgress?.completedTests ?? 0}/
          {testProgress?.limit ?? 30} unique tests completed, {testProgress?.remainingTests ?? 30}
          {" "}remaining. Access expires on {formatExpiry(expiresAt)}.
          {renewalRequired ? " This cycle is complete; the next test needs Rs 30 renewal." : ""}
        </div>
      </div>
      {children}
    </>
  );
}
