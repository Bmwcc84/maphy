"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

const benefits = [
  "Access saved notes and practice material",
  "Track live classes and revision plans",
  "Continue preparation across devices",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setStep("otp");
    setMessage("6-digit login code aapke email par bhej diya gaya hai.");
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Code galat ya expire ho gaya hai. Naya code mangayein.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="grid min-h-screen bg-[#07111f] text-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative flex items-center overflow-hidden px-5 py-20 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.22),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.16),transparent_30%)]" />
        <div className="relative mx-auto max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-300 text-lg font-black text-slate-950">
              M
            </span>
            <span className="text-2xl font-black">MAPHY</span>
          </Link>

          <h1 className="mt-12 text-5xl font-black leading-tight tracking-normal sm:text-6xl">
            Welcome back to focused preparation.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Sign in to continue your Maths and Physics journey with notes,
            practice sets and class material in one place.
          </p>

          <div className="mt-10 space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-lg border border-white/10 bg-white/[0.07] px-5 py-4 font-semibold text-slate-100"
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-[#f7f9fc] px-5 py-16 text-slate-950 sm:px-8 lg:px-16">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
            Student Login
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-normal">
            {step === "email" ? "Login with email OTP" : "Enter login code"}
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            {step === "email"
              ? "Password ki zaroorat nahi. Hum aapke email par secure login code bhejenge."
              : `Code ${email} par bheja gaya hai.`}
          </p>

          {step === "email" ? (
            <form className="mt-8" onSubmit={sendOtp}>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@example.com"
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <button
                disabled={isLoading}
                className="mt-6 w-full rounded-lg bg-orange-500 px-5 py-4 text-base font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Sending code..." : "Send login code"}
              </button>
            </form>
          ) : (
            <form className="mt-8" onSubmit={verifyOtp}>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  8-digit code
                </span>
                <input
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  placeholder="12345678"
                  className="h-14 w-full rounded-lg border border-slate-300 px-4 text-center text-2xl font-black tracking-[0.25em] text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <button
                disabled={isLoading || otp.length !== 8}
                className="mt-6 w-full rounded-lg bg-orange-500 px-5 py-4 text-base font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Checking code..." : "Verify and login"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setMessage("");
                  setErrorMessage("");
                }}
                className="mt-4 w-full text-sm font-bold text-cyan-700 hover:text-cyan-900"
              >
                Change email or resend code
              </button>
            </form>
          )}

          {message ? (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700">
              {message}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <Link
            href="/"
            className="mt-6 block text-center text-sm font-bold text-cyan-700 transition hover:text-cyan-900"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
