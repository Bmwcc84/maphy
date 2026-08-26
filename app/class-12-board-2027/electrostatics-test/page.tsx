"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import Class12BoardTestAccess from "@/components/Class12BoardTestAccess";
import testSetsData from "@/content/tests/class-12-board-2027-electrostatics-sets.json";
import set05Data from "@/content/tests/class-12-board-2027-electrostatics-set-05.json";
import { supabase } from "@/lib/supabase";

type LanguageMode = "both" | "english" | "hindi";

type TestProgressResponse = {
  error?: string;
  alreadyCompleted?: boolean;
  renewalRequired?: boolean;
  progress?: {
    completedTests: number;
    remainingTests: number;
    limit: number;
  };
};

const languageOptions: Array<{ id: LanguageMode; label: string }> = [
  { id: "both", label: "English + हिन्दी" },
  { id: "english", label: "English" },
  { id: "hindi", label: "हिन्दी" },
];

const allTestSets = [...testSetsData.tests, ...set05Data.tests];

function BilingualText({
  english,
  hindi,
  mode,
  hindiClassName = "mt-2 text-slate-700",
}: {
  english: string;
  hindi: string;
  mode: LanguageMode;
  hindiClassName?: string;
}) {
  if (english === hindi) {
    return <span className="block">{english}</span>;
  }

  return (
    <>
      {mode !== "hindi" ? <span className="block">{english}</span> : null}
      {mode !== "english" ? <span className={`block ${hindiClassName}`}>{hindi}</span> : null}
    </>
  );
}

export default function Class12ElectrostaticsTestPage() {
  const [selectedSetId, setSelectedSetId] = useState(allTestSets[0].id);
  const [languageMode, setLanguageMode] = useState<LanguageMode>("both");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [progressFailed, setProgressFailed] = useState(false);
  const selectedTest =
    allTestSets.find((test) => test.id === selectedSetId) ?? allTestSets[0];

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () =>
      selectedTest.questions.reduce(
        (total, question, index) =>
          total + (answers[index] === question.correctOption ? 1 : 0),
        0,
      ),
    [answers, selectedTest.questions],
  );
  const incorrectCount = answeredCount - score;
  const skippedCount = selectedTest.questions.length - answeredCount;
  const percentage = Math.round((score / selectedTest.questions.length) * 100);

  function chooseSet(setId: string) {
    setSelectedSetId(setId);
    setAnswers({});
    setShowResult(false);
    setProgressMessage("");
    setProgressFailed(false);
    window.setTimeout(() => {
      document.getElementById("electrostatics-test-controls")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function submitTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowResult(true);
    setProgressMessage("Test completion login account me save ho rahi hai...");
    setProgressFailed(false);
    void recordTestCompletion();
    window.setTimeout(() => {
      document.getElementById("board-test-result")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function resetTest() {
    setAnswers({});
    setShowResult(false);
    setProgressMessage("");
    setProgressFailed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function recordTestCompletion() {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error("Progress save karne ke liye dobara login karein.");

      void fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify({ kind: "test_attempt", testName: `Class 12 Electrostatics ${selectedTest.id}`, score, totalQuestions: selectedTest.questions.length }) });

      const response = await fetch("/api/tests/class-12/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ testId: `electrostatics-${selectedTest.id}` }),
      });
      const result = (await response.json().catch(() => null)) as TestProgressResponse | null;
      if (!response.ok || !result?.progress) {
        throw new Error(result?.error ?? "Test progress save nahi ho saki.");
      }

      window.dispatchEvent(
        new CustomEvent("maphy-class12-test-progress", { detail: result.progress }),
      );
      setProgressFailed(false);
      if (result.renewalRequired) {
        setProgressMessage(
          "30/30 tests complete. Is result ka PDF download available hai; agle cycle ke liye Rs 30 renewal hoga.",
        );
      } else if (result.alreadyCompleted) {
        setProgressMessage(
          `Yeh set pehle count ho chuka hai. Progress ${result.progress.completedTests}/${result.progress.limit}; retake dobara count nahi hua.`,
        );
      } else {
        setProgressMessage(
          `Progress saved: ${result.progress.completedTests}/${result.progress.limit} unique tests complete, ${result.progress.remainingTests} remaining.`,
        );
      }
    } catch (error) {
      setProgressFailed(true);
      setProgressMessage(
        error instanceof Error ? error.message : "Test progress save nahi ho saki.",
      );
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-slate-950">
      <header className="border-b border-slate-800 bg-[#07111f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5">
          <Link href="/" aria-label="MAPHY home" className="min-w-0">
            <BrandLogo size="md" priority />
          </Link>
          <Link
            href="/#board-2027-tests"
            className="shrink-0 rounded-lg border border-slate-600 px-3 py-2 text-sm font-black transition hover:border-cyan-300 hover:text-cyan-200 sm:px-4"
          >
            <span className="sm:hidden">Tests</span>
            <span className="hidden sm:inline">Test Series Home</span>
          </Link>
        </div>
      </header>

      <section className="bg-[#07111f] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
            Class 12 Board Exam 2027
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl break-words text-3xl font-black leading-tight sm:text-5xl">
                {selectedTest.titleEn}
              </h1>
              <p className="mt-3 text-xl font-bold text-cyan-100">
                {selectedTest.titleHi}
              </p>
              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                5 live online sets mein 150 different bilingual questions available hain.
                Theory, formula, applications, units, dimensions aur important facts cover kiye gaye hain.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-3 text-center">
              {[
                [String(selectedTest.questions.length), "Questions"],
                [String(selectedTest.questions.length), "Marks"],
                ["30 Days", "Access"],
              ].map(([value, label]) => (
                <div key={label} className="min-w-0 border-l border-slate-700 px-2 first:border-l-0 sm:px-4">
                  <strong className="block text-xl font-black text-white sm:text-2xl">{value}</strong>
                  <span className="mt-1 block text-xs font-bold text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Class12BoardTestAccess>
      <section id="electrostatics-test-controls" className="mx-auto max-w-7xl scroll-mt-4 px-5 py-8 sm:px-8">
        <div className="border-b border-slate-200 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
            Electrostatics Test Folder
          </p>
          <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black">Choose one of 5 test sets</h2>
              <p className="mt-2 text-slate-600">Har live set mein 30 अलग questions aur submit ke baad usi set ka PDF download.</p>
            </div>
            <strong className="text-sm text-cyan-800">120 unique questions</strong>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {allTestSets.map((test) => {
              const isSelected = selectedTest.id === test.id;
              return (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => chooseSet(test.id)}
                  aria-pressed={isSelected}
                  className={`min-h-32 rounded-lg border p-5 text-left transition ${
                    isSelected
                      ? "border-cyan-600 bg-cyan-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-cyan-300"
                  }`}
                >
                  <span className={`text-xs font-black uppercase tracking-[0.16em] ${isSelected ? "text-cyan-800" : "text-slate-500"}`}>
                    Set {String(test.number).padStart(2, "0")} · 30 Questions
                  </span>
                  <strong className="mt-3 block text-xl text-slate-950">{test.focusEn}</strong>
                  <span className="mt-1 block font-bold text-slate-600">{test.focusHi}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
              Question language
            </p>
            <h2 className="mt-2 text-2xl font-black">Choose how questions appear</h2>
          </div>
          <div
            className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-300 bg-white"
            aria-label="Question language"
          >
            {languageOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguageMode(option.id)}
                className={`min-h-11 border-l border-slate-300 px-3 py-2 text-sm font-black first:border-l-0 transition sm:px-5 ${
                  languageMode === option.id
                    ? "bg-cyan-700 text-white"
                    : "bg-white text-slate-700 hover:bg-cyan-50"
                }`}
                aria-pressed={languageMode === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-sm font-semibold leading-6 text-amber-950">
          Submit button hamesha active hai. Aap unanswered questions ko skip karke
          kisi bhi samay result dekh sakte hain.
        </div>

        {showResult ? (
          <section
            id="board-test-result"
            className="scroll-mt-5 border-y border-emerald-300 bg-emerald-50 py-7"
            aria-live="polite"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
                  Result declared / परिणाम घोषित
                </p>
                <h2 className="mt-2 text-3xl font-black text-emerald-950">
                  {selectedTest.titleEn}: Score {score}/{selectedTest.questions.length} ({percentage}%)
                </h2>
                <p className="mt-3 max-w-2xl font-semibold leading-7 text-emerald-900">
                  Correct answers green, wrong selections red aur skipped questions
                  amber color me dikh rahe hain. Har question ke neeche explanation bhi hai.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={selectedTest.downloadPath}
                  download
                  className="rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-orange-600"
                >
                  Download Set {String(selectedTest.number).padStart(2, "0")} PDF
                </a>
                <button
                  type="button"
                  onClick={resetTest}
                  className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Retake Test
                </button>
              </div>
            </div>
            {progressMessage ? (
              <div
                className={`mt-5 border-l-4 px-4 py-3 text-sm font-bold ${
                  progressFailed
                    ? "border-red-500 bg-red-50 text-red-800"
                    : "border-cyan-500 bg-cyan-50 text-cyan-900"
                }`}
                role="status"
              >
                {progressMessage}
              </div>
            ) : null}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Correct", score, "text-emerald-700"],
                ["Incorrect", incorrectCount, "text-red-700"],
                ["Skipped", skippedCount, "text-amber-700"],
                ["Attempted", answeredCount, "text-cyan-700"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="border-l-2 border-slate-300 pl-4">
                  <span className="block text-sm font-bold text-slate-600">{label}</span>
                  <strong className={`mt-1 block text-3xl font-black ${color}`}>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <form onSubmit={submitTest} className="mt-7 space-y-5 pb-28">
          {selectedTest.questions.map((question, questionIndex) => {
            const selectedOption = answers[questionIndex];
            const wasSkipped = showResult && selectedOption === undefined;

            return (
              <fieldset
                key={`${selectedTest.id}-${question.id}`}
                className={`rounded-lg border bg-white p-5 shadow-sm sm:p-6 ${
                  wasSkipped ? "border-amber-300" : "border-slate-200"
                }`}
              >
                <legend className="max-w-[calc(100%-1rem)] px-2 text-lg font-black leading-7 sm:text-xl">
                  <span className="mr-2 text-cyan-700">{question.id}.</span>
                  <BilingualText
                    english={question.questionEn}
                    hindi={question.questionHi}
                    mode={languageMode}
                    hindiClassName="mt-2 font-bold text-slate-700"
                  />
                </legend>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedOption === optionIndex;
                    const isCorrect = question.correctOption === optionIndex;
                    const resultClass = showResult
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                        : isSelected
                          ? "border-red-500 bg-red-50 text-red-950"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      : isSelected
                        ? "border-cyan-600 bg-cyan-50 text-slate-950"
                        : "border-slate-200 bg-slate-50 text-slate-800 hover:border-cyan-300";

                    return (
                      <label
                        key={`${question.id}-${optionIndex}`}
                        className={`flex min-h-16 items-start gap-3 rounded-lg border px-4 py-3 font-semibold leading-6 transition ${
                          showResult ? "cursor-default" : "cursor-pointer"
                        } ${resultClass}`}
                      >
                        <input
                          type="radio"
                          name={`${selectedTest.id}-question-${question.id}`}
                          value={optionIndex}
                          checked={isSelected}
                          disabled={showResult}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [questionIndex]: optionIndex,
                            }))
                          }
                          className="mt-1 h-4 w-4 shrink-0 accent-cyan-700"
                        />
                        <span className="flex min-w-0 gap-3">
                          <strong className="text-cyan-800">
                            {String.fromCharCode(65 + optionIndex)}.
                          </strong>
                          <span>
                            <BilingualText
                              english={option.en}
                              hindi={option.hi}
                              mode={languageMode}
                              hindiClassName="mt-1 text-slate-700"
                            />
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                {!showResult && selectedOption !== undefined ? (
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers((current) => {
                        const next = { ...current };
                        delete next[questionIndex];
                        return next;
                      })
                    }
                    className="mt-4 text-sm font-black text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-red-700"
                  >
                    Clear answer / उत्तर हटाएँ
                  </button>
                ) : null}

                {showResult ? (
                  <div
                    className={`mt-5 border-l-4 px-4 py-3 ${
                      wasSkipped
                        ? "border-amber-400 bg-amber-50"
                        : selectedOption === question.correctOption
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-700">
                        Explanation / व्याख्या
                      </p>
                      {wasSkipped ? (
                        <span className="text-xs font-black text-amber-800">Skipped / छोड़ा गया</span>
                      ) : null}
                    </div>
                    <p className="mt-2 font-semibold leading-7 text-slate-800">
                      {question.explanationEn}
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">{question.explanationHi}</p>
                  </div>
                ) : null}
              </fieldset>
            );
          })}

          {!showResult ? (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-300 bg-white/95 px-5 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur sm:px-8">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div>
                  <p className="font-black text-slate-950">
                    {answeredCount}/{selectedTest.questions.length} answered
                  </p>
                  <p className="hidden text-sm font-semibold text-slate-500 sm:block">
                    Unanswered questions will be counted as skipped.
                  </p>
                </div>
                <button
                  type="submit"
                  className="min-h-12 rounded-lg bg-orange-500 px-6 py-3 font-black text-white transition hover:bg-orange-600 sm:px-9"
                >
                  Submit Anytime
                </button>
              </div>
            </div>
          ) : null}
        </form>
      </section>
      </Class12BoardTestAccess>
    </main>
  );
}
