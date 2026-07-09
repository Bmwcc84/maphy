"use client";

import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const benefits = [
  "Access saved notes and practice material",
  "Track live classes and revision plans",
  "Continue preparation across devices",
];

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push("/");
        }
      })
      .catch((error: unknown) => {
        setErrorMessage(getLoginErrorMessage(error));
      });
  }, [router]);

  const handleGoogleLogin = async () => {
    setErrorMessage("");

    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error(error);
      setErrorMessage(getLoginErrorMessage(error));
    }
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
            Enter your MAPHY account
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            Use Google login for quick and secure access.
          </p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Email
              </span>
              <input
                type="email"
                placeholder="student@example.com"
                className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Password
              </span>
              <input
                type="password"
                placeholder="Your password"
                className="h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full rounded-lg bg-orange-500 px-5 py-4 text-base font-black text-white transition hover:bg-orange-400"
          >
            Continue with Google
          </button>

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

function getLoginErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/unauthorized-domain") {
      return "Firebase me www.maphy.in authorized domain add nahi hai. Firebase Console > Authentication > Settings > Authorized domains me maphy.in aur www.maphy.in add karein.";
    }

    if (error.code === "auth/network-request-failed") {
      return "Google login network request fail hua. Browser extensions/ad blocker band karke refresh karein, ya Chrome Incognito me try karein.";
    }

    return `Google login failed: ${error.code}`;
  }

  return "Google login failed. Please try again.";
}
