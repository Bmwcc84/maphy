"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import katex from "katex";
import BrandLogo from "@/components/BrandLogo";
import { splitBpscMathText } from "@/lib/bpsc-math";
import { bpscTre4AllQuestions, type BpscQuestionFigureCrop } from "@/lib/bpsc-tre-4-series";
import { bpscTre4Test2Questions, type BpscTre4OnlineQuestion } from "@/lib/bpsc-tre-4-test-2";
import { bpscTre4Test3Questions } from "@/lib/bpsc-tre-4-test-3";
import { bpscTre4Test4Questions } from "@/lib/bpsc-tre-4-test-4";
import { bpscPhysicsTest } from "@/lib/courses";
import { supabase } from "@/lib/supabase";

type ResourceTab = "videos" | "pdfs" | "tests";
type Language = "both" | "english" | "hindi";

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

type RazorpayWindow = Window & {
  Razorpay?: new (options: RazorpayOptions) => { open: () => void };
};

type EnrollmentResponse = {
  error?: string;
  enrollments?: Array<{ course_id: string; expires_at?: string | null }>;
};

const tabs: Array<{ id: ResourceTab; label: string; count: string }> = [
  { id: "videos", label: "Video Classes", count: "2 classes" },
  { id: "pdfs", label: "PDF Notes", count: "2 PDFs" },
  { id: "tests", label: "Online Tests", count: "4 complete tests" },
];

const onlineTests = [
  {
    number: 1,
    title: ["Test 1 - Complete Shuffled Physics Test", "टेस्ट 1 - संपूर्ण मिश्रित भौतिकी टेस्ट"] as [string, string],
    description: "Document 38 · 43 questions",
    questions: bpscTre4AllQuestions as BpscTre4OnlineQuestion[],
    downloadPath: "/downloads/bpsc-tre-4-complete-test.pdf",
  },
  {
    number: 2,
    title: ["Test 2 - Complete Shuffled Physics Test", "टेस्ट 2 - संपूर्ण मिश्रित भौतिकी टेस्ट"] as [string, string],
    description: "Document 39 · 30 questions",
    questions: bpscTre4Test2Questions,
    downloadPath: "/downloads/bpsc-tre-4-test-2-complete-question-paper.pdf",
  },
  {
    number: 3,
    title: ["Test 3 - BPSC TRE 4.0 Physics Mock Test", "टेस्ट 3 - BPSC TRE 4.0 भौतिकी मॉक टेस्ट"] as [string, string],
    description: "Final Test 3 · 80 questions · 90 minutes",
    questions: bpscTre4Test3Questions,
    downloadPath: "/downloads/bpsc-tre-4-test-3-final.pdf",
    durationMinutes: 90,
  },
  {
    number: 4,
    title: ["Test 4 - BPSC TRE 4.0 Physics Mock Test", "टेस्ट 4 - BPSC TRE 4.0 भौतिकी मॉक टेस्ट"] as [string, string],
    description: "Final Test 4 · 80 questions · 90 minutes",
    questions: bpscTre4Test4Questions,
    downloadPath: "/downloads/bpsc-tre-4-test-4-final.pdf",
    durationMinutes: 90,
  },
];

function shuffledQuestions(questionBank: BpscTre4OnlineQuestion[]) {
  const questions = [...questionBank];
  for (let index = questions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [questions[index], questions[randomIndex]] = [questions[randomIndex], questions[index]];
  }
  return questions;
}

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
  if (!value) return "activation ke 30 din baad";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function MathText({ value }: { value: string }) {
  return splitBpscMathText(value).map((part, index) => part.kind === "text"
    ? <span key={`${part.kind}-${index}`}>{part.value}</span>
    : <span
        key={`${part.kind}-${index}`}
        className="inline-block max-w-full align-baseline"
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(part.value, {
            output: "html",
            throwOnError: false,
          }),
        }}
      />);
}

function BilingualText({ value, language }: { value: [string, string]; language: Language }) {
  if (language === "english") return <MathText value={value[0]} />;
  if (language === "hindi") return <MathText value={value[1]} />;
  return (
    <>
      <span className="block"><MathText value={value[0]} /></span>
      <span lang="hi" className="mt-1 block text-slate-600"><MathText value={value[1]} /></span>
    </>
  );
}

function QuestionFigure({
  crop,
  language,
  sourceImage,
}: {
  crop: BpscQuestionFigureCrop;
  language: Language;
  sourceImage: string;
}) {
  const sourceWidth = crop.sourceWidth ?? 992;
  const sourceHeight = crop.sourceHeight ?? 1403;
  const alt = language === "hindi" ? crop.alt[1] : crop.alt[0];

  return (
    <figure className="mt-4" aria-label={language === "hindi" ? "प्रश्न का चित्र" : "Question figure"}>
      <div
        className="relative mx-auto overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm"
        style={{
          aspectRatio: `${crop.width} / ${crop.height}`,
          maxWidth: `${Math.min(crop.width, 760)}px`,
        }}
      >
        <Image
          src={sourceImage}
          alt={alt}
          width={sourceWidth}
          height={sourceHeight}
          unoptimized
          className="absolute max-w-none"
          style={{
            height: "auto",
            left: `${-(crop.x / crop.width) * 100}%`,
            top: `${-(crop.y / crop.height) * 100}%`,
            width: `${(sourceWidth / crop.width) * 100}%`,
          }}
        />
        {crop.masks?.map((mask, index) => (
          <span
            key={`${mask.x}-${mask.y}-${index}`}
            aria-hidden="true"
            className="absolute bg-white"
            style={{
              height: `${(mask.height / crop.height) * 100}%`,
              left: `${((mask.x - crop.x) / crop.width) * 100}%`,
              top: `${((mask.y - crop.y) / crop.height) * 100}%`,
              width: `${(mask.width / crop.width) * 100}%`,
            }}
          />
        ))}
      </div>
    </figure>
  );
}

export default function BpscTre4TestSeries() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<ResourceTab>(() => {
    if (typeof window === "undefined") return "tests";
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    return requestedTab === "videos" || requestedTab === "pdfs" ? requestedTab : "tests";
  });
  const [language, setLanguage] = useState<Language>("both");
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [selectedTestNumber, setSelectedTestNumber] = useState(1);
  const [questions, setQuestions] = useState(() => shuffledQuestions(onlineTests[0].questions));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const selectedTestDefinition = onlineTests.find((test) => test.number === selectedTestNumber) ?? onlineTests[0];
  const selectedTest = { ...selectedTestDefinition, questions };
  const score = useMemo(
    () => questions.reduce(
      (total, question, index) => total + (answers[index] === question.correctOption ? 1 : 0),
      0,
    ),
    [answers, questions],
  );
  const answeredCount = Object.keys(answers).length;
  const incorrectCount = answeredCount - score;
  const skippedCount = questions.length - answeredCount;
  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    const durationMinutes = selectedTestDefinition.durationMinutes;
    if (!durationMinutes || showResult) return;

    const storageKey = `maphy-bpsc-test-${selectedTestDefinition.number}-deadline`;
    let deadline = Number(window.localStorage.getItem(storageKey));
    if (!Number.isFinite(deadline) || deadline <= 0) {
      deadline = Date.now() + durationMinutes * 60 * 1000;
      window.localStorage.setItem(storageKey, String(deadline));
    }

    const updateTimer = () => {
      const nextSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(nextSeconds);
      if (nextSeconds === 0) {
        setAutoSubmitted(true);
        setShowResult(true);
        requestAnimationFrame(() => {
          document.getElementById("bpsc-test-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [selectedTestDefinition.durationMinutes, selectedTestDefinition.number, showResult]);

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace(`/login?next=${encodeURIComponent("/bpsc-physics-tre-4?tab=tests")}`);
        return;
      }
      if (!mounted) return;

      setAccessToken(data.session.access_token);
      setEmail(data.session.user.email ?? "");
      try {
        const response = await fetch("/api/enrollments", {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
          cache: "no-store",
        });
        const result = (await response.json().catch(() => null)) as EnrollmentResponse | null;
        if (!response.ok) throw new Error(result?.error ?? "Subscription access check nahi hua.");
        const enrollment = result?.enrollments?.find(
          (item) => item.course_id === bpscPhysicsTest.id,
        );
        if (!mounted) return;
        setHasAccess(Boolean(enrollment));
        setExpiresAt(enrollment?.expires_at ?? null);
        if (enrollment) setQuestions(shuffledQuestions(selectedTestDefinition.questions));
      } catch (error) {
        if (!mounted) return;
        setFailed(true);
        setMessage(error instanceof Error ? error.message : "Subscription access check nahi hua.");
      } finally {
        if (mounted) setChecking(false);
      }
    }

    void checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace(`/login?next=${encodeURIComponent("/bpsc-physics-tre-4?tab=tests")}`);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, selectedTestDefinition.questions]);

  function changeTab(tab: ResourceTab) {
    setActiveTab(tab);
    window.history.replaceState(null, "", `/bpsc-physics-tre-4?tab=${tab}`);
  }

  function submitTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAutoSubmitted(false);
    setShowResult(true);
    void supabase.auth.getSession().then(({ data }) => {
      void fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json", ...(data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}) }, body: JSON.stringify({ kind: "test_attempt", testName: selectedTest.title[0], score, totalQuestions: selectedTest.questions.length }) });
    });
    requestAnimationFrame(() => {
      document.getElementById("bpsc-test-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function resetTest() {
    if (selectedTestDefinition.durationMinutes) {
      const deadline = Date.now() + selectedTestDefinition.durationMinutes * 60 * 1000;
      window.localStorage.setItem(`maphy-bpsc-test-${selectedTestDefinition.number}-deadline`, String(deadline));
      setRemainingSeconds(selectedTestDefinition.durationMinutes * 60);
    }
    setQuestions(shuffledQuestions(selectedTestDefinition.questions));
    setAnswers({});
    setAutoSubmitted(false);
    setShowResult(false);
    document.getElementById("selected-bpsc-test")?.scrollIntoView({ behavior: "smooth" });
  }

  function selectTest(testNumber: number) {
    const nextTest = onlineTests.find((test) => test.number === testNumber) ?? onlineTests[0];
    setSelectedTestNumber(nextTest.number);
    setQuestions(shuffledQuestions(nextTest.questions));
    setAnswers({});
    setAutoSubmitted(false);
    setShowResult(false);
  }

  async function startSubscription() {
    setProcessing(true);
    setFailed(false);
    setMessage("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout load nahi hua. Internet check karein.");
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ courseId: bpscPhysicsTest.id }),
      });
      const order = (await orderResponse.json().catch(() => null)) as {
        error?: string;
        key?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        course?: { title: string };
      } | null;
      if (!orderResponse.ok || !order?.key || !order.orderId || !order.amount || !order.currency) {
        throw new Error(order?.error ?? "Subscription payment start nahi hua.");
      }

      const RazorpayCheckout = (window as RazorpayWindow).Razorpay;
      if (!RazorpayCheckout) throw new Error("Razorpay checkout unavailable hai.");
      const checkout = new RazorpayCheckout({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "MAPHY",
        description: order.course?.title ?? bpscPhysicsTest.title,
        order_id: order.orderId,
        prefill: { email },
        theme: { color: "#0891b2" },
        modal: { ondismiss: () => setProcessing(false) },
        handler: async (result) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify({ courseId: bpscPhysicsTest.id, ...result }),
            });
            const verification = (await verifyResponse.json().catch(() => null)) as {
              error?: string;
              verified?: boolean;
              expiresAt?: number;
            } | null;
            if (!verifyResponse.ok || !verification?.verified) {
              throw new Error(verification?.error ?? "Payment verify nahi hua. Recover Access use karein.");
            }
            setHasAccess(true);
            setQuestions(shuffledQuestions(selectedTestDefinition.questions));
            setExpiresAt(verification.expiresAt ? new Date(verification.expiresAt).toISOString() : null);
            setFailed(false);
            setMessage("Payment successful. Complete shuffled test 30 days ke liye unlock ho gaya hai.");
          } catch (error) {
            setFailed(true);
            setMessage(error instanceof Error ? error.message : "Payment verify nahi hua.");
          } finally {
            setProcessing(false);
          }
        },
      });
      checkout.open();
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Subscription payment start nahi hua.");
      setProcessing(false);
    }
  }

  async function recoverSubscription() {
    setRecovering(true);
    setFailed(false);
    setMessage("Paid subscription check ho rahi hai...");
    try {
      const response = await fetch("/api/payments/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ courseId: bpscPhysicsTest.id }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        recovered?: boolean;
        expiresAt?: number;
      } | null;
      if (!response.ok || !result?.recovered) throw new Error(result?.error ?? "Paid subscription nahi mili.");
      setHasAccess(true);
      setQuestions(shuffledQuestions(selectedTestDefinition.questions));
      setExpiresAt(result.expiresAt ? new Date(result.expiresAt).toISOString() : null);
      setFailed(false);
      setMessage("Subscription recovered. Complete shuffled test ka access active hai.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Subscription recover nahi hui.");
    } finally {
      setRecovering(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <p className="text-lg font-bold">BPSC TRE 4.0 complete test load ho raha hai...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-800 bg-[#07111f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/dashboard" aria-label="MAPHY dashboard"><BrandLogo size="lg" priority /></Link>
          <Link href="/dashboard" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-black hover:border-cyan-300 hover:text-cyan-300">Dashboard</Link>
        </div>
      </header>

      <section className="bg-[#07111f] text-white">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16">
          <p className="text-sm font-black uppercase text-amber-300">Teacher TRE 4.0 preparation</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">BPSC Physics TRE 4.0</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">Document 38 aur Document 39 ke saare questions do alag bilingual online tests mein. Har attempt par question order shuffle hoga, result turant milega aur detailed explanation dikhega.</p>
          <div className="mt-7 grid max-w-3xl grid-cols-3 gap-3">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => changeTab(tab.id)} className={`min-h-20 rounded-lg border px-3 py-3 text-left transition ${activeTab === tab.id ? "border-amber-300 bg-amber-300 text-slate-950" : "border-slate-700 bg-slate-900 text-white hover:border-cyan-300"}`}>
                <span className="block text-sm font-black">{tab.label}</span>
                <span className={`mt-1 block text-xs font-bold ${activeTab === tab.id ? "text-slate-700" : "text-slate-400"}`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {activeTab === "videos" ? (
          <div>
            <p className="text-xs font-black uppercase text-cyan-700">Video classes</p>
            <h2 className="mt-2 text-3xl font-black">BPSC Physics TRE 4.0 Classes</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="aspect-video bg-black"><iframe className="h-full w-full" src="https://www.youtube-nocookie.com/embed/MdDhFdfxhUg?rel=0&modestbranding=1" title="BPSC Physics TRE 4.0 video class 01" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
                <div className="p-6"><p className="text-xs font-black uppercase text-cyan-700">Video class 01</p><h3 className="mt-2 text-xl font-black">Motion, graphs and selected numericals</h3><p className="mt-2 text-slate-600">BPSC Physics preparation ke liye concept revision class.</p></div>
              </article>
              <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="aspect-video bg-black"><iframe className="h-full w-full" src="https://www.youtube-nocookie.com/embed/BcLcJZfjB9Q?rel=0&modestbranding=1" title="BPSC Physics TRE 4.0 video class 02" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
                <div className="p-6"><p className="text-xs font-black uppercase text-cyan-700">Video class 02</p><h3 className="mt-2 text-xl font-black">Test 1 Solution</h3><p className="mt-2 text-slate-600">BPSC Physics TRE 4.0 Test 1 ka complete solution video.</p></div>
              </article>
            </div>
          </div>
        ) : null}

        {activeTab === "pdfs" ? (
          <div>
            <p className="text-xs font-black uppercase text-cyan-700">Chapter resources</p>
            <h2 className="mt-2 text-3xl font-black">Physics PDF Notes</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                ["Electrostatics", "Electrostatics Handwritten Notes", "Electric charge, field, potential aur capacitance.", "/preview/electrostatics"],
                ["Current Electricity", "Current Electricity Handwritten Notes", "Current, resistance, circuits aur Kirchhoff laws.", "/preview/current-electricity"],
              ].map(([chapter, title, detail, href]) => (
                <article key={chapter} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase text-cyan-700">{chapter}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className="mt-3 min-h-14 leading-7 text-slate-600">{detail}</p>
                  <Link href={href} className="mt-6 block rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-black text-white hover:bg-orange-600">Open PDF notes</Link>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "tests" && message ? <div role="status" className={`mb-6 rounded-lg border p-4 font-bold ${failed ? "border-red-300 bg-red-50 text-red-800" : "border-emerald-300 bg-emerald-50 text-emerald-800"}`}>{message}</div> : null}

        {activeTab === "tests" && !hasAccess ? (
          <section className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase text-cyan-700">30-day complete access</p>
            <div className="mt-3 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
              <div><h2 className="text-3xl font-black">BPSC TRE 4.0 Complete Physics Tests</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Test 1 ke 43, Test 2 ke 30, Test 3 ke 80 aur Test 4 ke 80 bilingual questions; timed auto-submit, instant result aur explanations ke saath.</p></div>
              <div className="border-l-4 border-orange-500 pl-5"><strong className="block text-4xl font-black">Rs 99</strong><span className="mt-1 block text-sm font-bold text-slate-600">30 days</span></div>
            </div>
            <div className="mt-6 grid gap-3 border-y border-slate-200 py-5 text-sm font-black text-slate-700 sm:grid-cols-3"><span>4 complete tests</span><span>English + Hindi</span><span>Instant result</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => void startSubscription()} disabled={processing || recovering} className="rounded-lg bg-orange-500 px-6 py-4 font-black text-white hover:bg-orange-600 disabled:opacity-60">{processing ? "Opening checkout..." : "Get 30-day Access - Rs 99"}</button>
              <button type="button" onClick={() => void recoverSubscription()} disabled={processing || recovering} className="rounded-lg border border-slate-300 bg-white px-6 py-4 font-black text-slate-800 hover:bg-slate-50 disabled:opacity-60">{recovering ? "Checking payment..." : "Already paid? Recover Access"}</button>
            </div>
          </section>
        ) : null}

        {activeTab === "tests" && hasAccess ? (
          <div>
            <div className="border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-900">Subscription active. Access expires on {formatExpiry(expiresAt)}.</div>

            <section className="mt-8" aria-labelledby="choose-bpsc-test">
              <p className="text-xs font-black uppercase text-cyan-700">Online test series</p>
              <h2 id="choose-bpsc-test" className="mt-2 text-3xl font-black">Choose your test</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {onlineTests.map((test) => {
                  const selected = test.number === selectedTestNumber;
                  return (
                    <button
                      key={test.number}
                      type="button"
                      onClick={() => selectTest(test.number)}
                      aria-pressed={selected}
                      className={`rounded-lg border p-5 text-left shadow-sm transition ${selected ? "border-cyan-700 bg-cyan-50 ring-2 ring-cyan-700" : "border-slate-200 bg-white hover:border-cyan-400"}`}
                    >
                      <span className="text-xs font-black uppercase text-cyan-700">Test {test.number}</span>
                      <strong className="mt-2 block text-xl">{test.description}</strong>
                      <span className="mt-2 block text-sm font-semibold text-slate-600">Shuffle · bilingual · {test.durationMinutes ? `${test.durationMinutes}-min auto-submit` : "instant result"}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section id="selected-bpsc-test" className="mt-10 scroll-mt-5">
              <div className="flex flex-col gap-5 border-b border-slate-300 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div><p className="text-xs font-black uppercase text-cyan-700">Complete online test</p><h2 className="mt-2 text-3xl font-black"><BilingualText value={selectedTest.title} language={language} /></h2><p className="mt-3 font-semibold text-slate-600">{selectedTest.questions.length} shuffled questions · Skip allowed · Submit anytime</p></div>
                <div className="inline-flex w-full rounded-lg border border-slate-300 bg-white p-1 sm:w-auto" aria-label="Question language">
                  {(["both", "english", "hindi"] as const).map((item) => <button key={item} type="button" onClick={() => setLanguage(item)} className={`min-h-10 flex-1 rounded-md px-4 text-sm font-black capitalize sm:flex-none ${language === item ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item}</button>)}
                </div>
              </div>

              <div className="mt-6 border-l-4 border-cyan-600 bg-cyan-50 px-5 py-4 text-sm font-bold text-cyan-950">Questions ka order har attempt par badlega. Zaroori diagrams sambandhit questions ke andar diye gaye hain.</div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-black">{selectedTest.questions.length} Questions · {selectedTest.questions.length} Marks</p><div className="flex items-center gap-3"><p className="text-sm font-bold text-cyan-700">{answeredCount}/{selectedTest.questions.length} answered</p>{selectedTest.durationMinutes ? <p className={`rounded-md px-3 py-1 font-mono text-lg font-black ${remainingSeconds <= 300 && !showResult ? "bg-red-100 text-red-700" : "bg-slate-950 text-white"}`} aria-live="polite">{String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:{String(remainingSeconds % 60).padStart(2, "0")}</p> : null}</div></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-cyan-600 transition-all" style={{ width: `${(answeredCount / selectedTest.questions.length) * 100}%` }} /></div>
              </div>

              <form onSubmit={submitTest} className="mt-6 space-y-5">
                {selectedTest.questions.map((question, questionIndex) => (
                  <fieldset key={question.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <legend className="max-w-full px-1 text-lg font-black"><span className="mr-2 text-cyan-700">{questionIndex + 1}.</span><BilingualText value={question.question} language={language} /></legend>
                    {question.figure ? <QuestionFigure crop={question.figure} language={language} sourceImage={question.sourceImage} /> : null}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const selected = answers[questionIndex] === optionIndex;
                        const correct = optionIndex === question.correctOption;
                        const stateClass = showResult ? correct ? "border-emerald-500 bg-emerald-50 text-emerald-950" : selected ? "border-red-400 bg-red-50 text-red-900" : "border-slate-200 bg-slate-50" : selected ? "border-cyan-600 bg-cyan-50" : "border-slate-200 bg-slate-50 hover:border-cyan-300";
                        return <label key={`${question.id}-${optionIndex}`} className={`flex min-h-14 items-start gap-3 rounded-lg border px-4 py-3 font-semibold ${showResult ? "cursor-default" : "cursor-pointer"} ${stateClass}`}><input type="radio" name={`question-${questionIndex}`} checked={selected} disabled={showResult} onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))} className="mt-1 h-4 w-4 shrink-0 accent-cyan-700" /><span><BilingualText value={option} language={language} /></span></label>;
                      })}
                    </div>
                    {showResult ? <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-black uppercase text-cyan-800">Answer explanation</p>{answers[questionIndex] === undefined ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">Skipped</span> : null}</div><p className="mt-2 leading-7"><BilingualText value={question.explanation} language={language} /></p></div> : null}
                  </fieldset>
                ))}

                {showResult ? (
                  <section id="bpsc-test-result" className="scroll-mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-5 text-emerald-950 shadow-sm sm:p-6" aria-live="polite">
                    <p className="text-sm font-black uppercase">{autoSubmitted ? "Time expired · Test auto-submitted and locked" : "Result declared · Complete shuffled test"}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
                      {[['Score', `${score}/${selectedTest.questions.length}`], ['Percentage', `${percentage}%`], ['Correct', score], ['Incorrect', incorrectCount], ['Skipped', skippedCount]].map(([label, value]) => <div key={label} className="rounded-lg bg-white p-4"><span className="block text-sm font-bold text-slate-600">{label}</span><strong className="mt-1 block text-3xl">{value}</strong></div>)}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">{selectedTest.downloadPath ? <><a href={selectedTest.downloadPath} download className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-black text-white hover:bg-orange-600">Download Complete Test PDF</a><a href="/downloads/bpsc-tre-4-all-extracted-questions.md" download className="rounded-lg border border-emerald-700 bg-white px-6 py-3 text-sm font-black text-emerald-900 hover:bg-emerald-100">Download Extracted Question Bank</a></> : null}<button type="button" onClick={resetTest} className="rounded-lg bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">Retake with new shuffle</button></div>
                  </section>
                ) : <button type="submit" className="w-full rounded-lg bg-orange-500 px-6 py-4 text-lg font-black text-white hover:bg-orange-600">Submit test and view result</button>}
              </form>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}
