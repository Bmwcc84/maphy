"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { helpArticles, type HelpCategory } from "@/lib/help-centre";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const helpCategories: HelpCategory[] = [
  "All",
  "Payment",
  "Access",
  "Tests",
  "Notes",
  "Account",
];

const feedbackCategories = [
  { value: "suggestion", label: "Suggestion" },
  { value: "payment", label: "Payment issue" },
  { value: "access", label: "Course/PDF access" },
  { value: "test", label: "Online test" },
  { value: "notes", label: "Handwritten notes" },
  { value: "technical", label: "Technical problem" },
  { value: "other", label: "Other" },
];

const quickLinks = [
  {
    label: "Recover purchase",
    detail: "Paid access ko same login par restore karein",
    href: "/dashboard",
  },
  {
    label: "Physics tests",
    detail: "Board aur BPSC test series open karein",
    href: "/#board-2027-tests",
  },
  {
    label: "Handwritten notes",
    detail: "Preview aur purchased PDFs dekhein",
    href: "/#notes",
  },
];

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; referenceId: string }
  | { kind: "error"; message: string };

const fieldClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";

export default function HelpCentre() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<HelpCategory>("All");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email) setEmail(data.session.user.email);
    });
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return helpArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${article.question} ${article.answer}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitState.kind === "submitting") return;

    setSubmitState({ kind: "submitting" });
    const formData = new FormData(event.currentTarget);

    try {
      const { data } = isSupabaseConfigured
        ? await supabase.auth.getSession()
        : { data: { session: null } };
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (data.session?.access_token) {
        headers.Authorization = `Bearer ${data.session.access_token}`;
      }

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          email,
          category,
          subject,
          message,
          rating,
          pageUrl: window.location.href,
          website: formData.get("website"),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { error?: string; referenceId?: string }
        | null;

      if (!response.ok || !result?.referenceId) {
        throw new Error(result?.error || "Feedback submit nahi ho saka.");
      }

      setSubmitState({ kind: "success", referenceId: result.referenceId });
      setName("");
      setCategory("suggestion");
      setSubject("");
      setMessage("");
      setRating(null);
    } catch (error) {
      setSubmitState({
        kind: "error",
        message: error instanceof Error ? error.message : "Feedback submit nahi ho saka.",
      });
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f9fc] pt-[69px] text-slate-950">
      <section className="border-b border-slate-800 bg-[#07111f] px-5 py-14 text-white sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
            Student Support
          </p>
          <div className="mt-3 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h1 className="break-words text-3xl font-black leading-tight sm:text-5xl">MAPHY Help Centre</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Payment, PDF, login aur online test se related help yahan milegi.
                Apna suggestion ya problem bhi directly bhej sakte hain.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="w-full rounded-lg bg-cyan-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-cyan-500 hover:bg-cyan-50"
            >
              <span className="block font-black text-slate-950">{item.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">{item.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="min-w-0">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
                Find An Answer
              </p>
              <h2 className="mt-2 text-3xl font-black">Frequently asked questions</h2>
            </div>

            <label className="mt-7 block font-bold text-slate-800" htmlFor="help-search">
              Search help
              <input
                id="help-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={fieldClass}
                placeholder="Payment, PDF, test ya login search karein"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-2" aria-label="Help categories">
              {helpCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    activeCategory === item
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-cyan-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-7 space-y-3">
              {filteredArticles.map((article) => (
                <details
                  key={article.question}
                  className="group rounded-lg border border-slate-200 bg-white px-5 py-1 shadow-sm open:border-cyan-300"
                >
                  <summary className="cursor-pointer list-none py-4 font-black text-slate-950">
                    <span className="mr-3 inline-block text-cyan-700 group-open:rotate-45">+</span>
                    {article.question}
                  </summary>
                  <p className="border-t border-slate-100 pb-5 pt-4 leading-7 text-slate-600">
                    {article.answer}
                  </p>
                </details>
              ))}
              {filteredArticles.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
                  Is search ka answer nahi mila. Neeche feedback form se apna question bhejein.
                </div>
              )}
            </div>
          </div>

          <div id="feedback" className="min-w-0 scroll-mt-28">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                Feedback & Suggestions
              </p>
              <h2 className="mt-2 text-3xl font-black">Apni baat MAPHY tak bhejein</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Problem report karein ya platform ko better banane ke liye suggestion dein.
              </p>

              {submitState.kind === "success" ? (
                <div className="mt-7 rounded-lg border border-emerald-300 bg-emerald-50 p-5" role="status">
                  <p className="font-black text-emerald-900">Feedback receive ho gaya.</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    Reference ID: <strong>{submitState.referenceId}</strong>. Is ID ko future
                    follow-up ke liye note rakhein.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitState({ kind: "idle" })}
                    className="mt-4 rounded-lg border border-emerald-400 bg-white px-4 py-2 text-sm font-black text-emerald-900"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-bold text-slate-800">
                      Name (optional)
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={80}
                        autoComplete="name"
                        className={fieldClass}
                        placeholder="Student name"
                      />
                    </label>
                    <label className="block text-sm font-bold text-slate-800">
                      Email
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={254}
                        autoComplete="email"
                        required
                        className={fieldClass}
                        placeholder="student@example.com"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-bold text-slate-800">
                    Category
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className={fieldClass}
                    >
                      {feedbackCategories.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm font-bold text-slate-800">
                    Subject
                    <input
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      minLength={5}
                      maxLength={120}
                      required
                      className={fieldClass}
                      placeholder="Short summary"
                    />
                  </label>

                  <label className="block text-sm font-bold text-slate-800">
                    Message
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      minLength={20}
                      maxLength={2_000}
                      rows={6}
                      required
                      className={`${fieldClass} resize-y`}
                      placeholder="Problem ya suggestion detail mein likhein"
                    />
                    <span className="mt-1 block text-right text-xs font-medium text-slate-500">
                      {message.length}/2000
                    </span>
                  </label>

                  <fieldset>
                    <legend className="text-sm font-bold text-slate-800">
                      Experience rating (optional)
                    </legend>
                    <div className="mt-2 grid grid-cols-5 overflow-hidden rounded-lg border border-slate-300">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={rating === value}
                          onClick={() => setRating(rating === value ? null : value)}
                          className={`h-11 border-r border-slate-300 text-sm font-black last:border-r-0 ${
                            rating === value
                              ? "bg-cyan-700 text-white"
                              : "bg-white text-slate-700 hover:bg-cyan-50"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="sr-only" aria-hidden="true">
                    Website
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </label>

                  {submitState.kind === "error" && (
                    <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800" role="alert">
                      {submitState.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitState.kind === "submitting"}
                    className="w-full rounded-lg bg-orange-500 px-5 py-4 font-black text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:bg-slate-400"
                  >
                    {submitState.kind === "submitting" ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <p className="text-xs leading-5 text-slate-500">
                    Email ka use sirf is request par response aur access verification ke liye hoga.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
