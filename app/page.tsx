import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import JsonLd from "../components/JsonLd";
import { createPublicMetadata, siteConfig } from "../lib/seo";

const homeDescription =
  "Class 12 Physics bilingual test series, handwritten chapter notes and BPSC TRE 4 online practice tests with instant results and explanations.";

export const metadata: Metadata = createPublicMetadata({
  title: "Class 12 Physics Tests & Handwritten Notes | MAPHY",
  description: homeDescription,
  path: "/",
});

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: `${siteConfig.url}/`,
      name: siteConfig.name,
      alternateName: "MAPHY Physics Learning",
      description: homeDescription,
      inLanguage: ["en-IN", "hi-IN"],
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: "MAPHY Physics Learning",
      url: `${siteConfig.url}/`,
      description: homeDescription,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/maphy-logo-final.png`,
        width: 1254,
        height: 1254,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: `${siteConfig.url}/`,
      name: "Class 12 Physics Tests & Handwritten Notes",
      description: homeDescription,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: ["en-IN", "hi-IN"],
    },
  ],
};

const highlights = [
  { value: "3+", label: "Exam tracks" },
  { value: "120+", label: "Practice sets" },
  { value: "24/7", label: "Revision access" },
];

const offers = [
  {
    title: "Live Concept Classes",
    text: "Interactive Maths and Physics sessions with structured notes, examples and doubt discussion.",
  },
  {
    title: "Premium Study Notes",
    text: "Chapter-wise notes, formula sheets and short revision PDFs for fast recall before tests.",
  },
  {
    title: "Test Series + Analysis",
    text: "JEE and NEET mock tests with focused analysis so students know exactly what to improve.",
  },
];

const courses = [
  {
    title: "NEET Physics",
    detail: "Complete NEET Physics course with concepts, DPPs, PYQs and revision support.",
    price: "Rs 1999",
    tag: "Medical",
  },
  {
    title: "JEE Physics",
    detail: "JEE Main and Advanced preparation with problem-solving sessions and test strategy.",
    price: "Rs 2499",
    tag: "Engineering",
  },
  {
    title: "Class 12 Board",
    detail: "CBSE and Bihar Board Physics with exam-focused notes, numericals and revision.",
    price: "Rs 1499",
    tag: "Boards",
  },
];

const resources = [
  "Chapter-wise notes",
  "Daily practice problems",
  "Formula sheets",
  "PYQ solutions",
  "Mock test analysis",
  "Doubt support",
];

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Navbar />

      <main className="min-h-screen bg-[#f7f9fc] text-[#0f172a]">
        <section className="relative overflow-hidden bg-[#07111f] px-5 pb-8 pt-32 text-white sm:px-8 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_84%_16%,rgba(249,115,22,0.13),transparent_28%)]" />
          <Link
            href="/bpsc-physics-tre-4?tab=tests"
            className="relative mx-auto flex max-w-7xl flex-col gap-5 rounded-lg border border-amber-300/40 bg-amber-300 px-5 py-5 text-slate-950 shadow-lg shadow-black/20 transition hover:bg-amber-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Complete shuffled test</p>
              <h2 className="mt-1 text-2xl font-black">BPSC Physics TRE 4.0</h2>
              <p className="mt-1 font-semibold text-slate-700">All 43 questions in one Hindi-English test with instant result and PDF.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-3xl font-black">Rs 99</span>
              <span className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">View Test</span>
            </div>
          </Link>
        </section>

        <section
          id="board-2027-tests"
          className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-16"
        >
          <div className="mx-auto mb-10 grid max-w-7xl overflow-hidden rounded-lg bg-[#07111f] text-white lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="border-l-4 border-cyan-400 px-6 py-7 sm:px-8">
              <h2 className="max-w-3xl text-3xl font-black uppercase leading-tight text-white sm:text-4xl">
                Class 12 Physics Test Series Offer
              </h2>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <strong className="text-4xl font-black sm:text-5xl">Rs 1 per test</strong>
                <span className="font-bold text-slate-300">effective series price</span>
              </div>
              <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-300">
                Complete 30-test series sirf Rs 30 mein. Cycle 30 unique tests complete
                hone ya activation ke 30 days baad, jo pehle ho, renew hoga.
                Electrostatics ke 4 sets ab available hain.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 border-t border-slate-700 px-6 py-7 lg:items-end lg:border-l lg:border-t-0 sm:px-8">
              <div>
                <span className="block text-sm font-bold text-slate-400">Full package</span>
                <strong className="block text-3xl font-black">30 Tests / Rs 30</strong>
              </div>
              <Link
                href="/class-12-board-2027/electrostatics-test"
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Get Complete Series - Rs 30
              </Link>
            </div>
          </div>

          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                Class 12 Board Exam 2027
              </p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                Physics Test Series
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Chapter-wise bilingual tests for 2027 board preparation. Questions
                English aur Hindi dono me milenge, aur result submit karte hi dikhega.
              </p>
              <div className="mt-7 grid grid-cols-3 gap-4 border-y border-slate-200 py-5">
                {[
                  ["4", "Test Sets"],
                  ["2", "Languages"],
                  ["120", "Questions"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <strong className="block text-2xl font-black text-cyan-700">{value}</strong>
                    <span className="mt-1 block text-xs font-bold text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/class-12-board-2027/electrostatics-test"
              className="group block rounded-lg border border-slate-200 bg-[#f7f9fc] p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                    Folder 01 - Online Test
                  </p>
                  <h3 className="mt-3 text-3xl font-black text-slate-950">
                    Electrostatics
                  </h3>
                  <p className="mt-1 text-xl font-bold text-slate-700">
                    स्थिर वैद्युतिकी
                  </p>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                    4 sets with 120 different bilingual questions, optional skipping,
                    detailed explanations and a separate PDF after every result.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-900">
                  Included in Rs 30 Plan
                </span>
              </div>
              <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
                <span className="font-bold text-slate-600">Sets 01-04 of Physics Series</span>
                <span className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-black text-white transition group-hover:bg-orange-600">
                  View Test Series
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#07111f] px-5 py-20 text-white sm:px-8 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_84%_16%,rgba(249,115,22,0.13),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-cyan-300/30 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-cyan-100">
                Class 12 Physics handwritten notes
              </p>
              <h1 className="max-w-4xl break-words text-4xl font-black leading-[1.04] tracking-normal sm:text-6xl lg:text-7xl">
                ELECTROSTATICS HANDWRITTEN NOTES
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Student ko pehle notes ka card dikhega. Click karne ke baad
                2 minute tak poora PDF scroll karke dekh sakta hai. Uske baad
                Rs 50 payment demand aayegi.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/preview/electrostatics"
                className="rounded-lg bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
                >
                  Open Notes Preview
                </Link>
                <Link
                  href="/login?next=/courses%23electrostatics-handwritten-notes"
                  className="rounded-lg border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white transition hover:bg-white/15"
                >
                  Pay Rs 50
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.08] p-4"
                  >
                    <div className="text-2xl font-black text-cyan-200">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Link
                href="/preview/electrostatics"
                className="group block overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:bg-white/[0.1]"
              >
              <div className="rounded-lg bg-slate-950/70 p-6">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                      12th Physics Notes
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                      Electrostatics Handwritten Notes
                    </h2>
                  </div>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-black text-white">
                    Rs 50
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    ["One-time preview", "Har email login ko preview sirf ek baar milega"],
                    ["Handwritten PDF", "Electrostatics chapter revision material"],
                    ["Unlock full notes", "Preview ke baad payment demand aayegi"],
                  ].map(([title, text], index) => (
                    <div
                      key={title}
                      className="flex gap-4 rounded-lg bg-white/[0.06] p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300 text-sm font-black text-slate-950">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{title}</h3>
                        <p className="mt-1 text-sm text-slate-300">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-white px-5 py-4 text-center text-sm font-black text-slate-950 transition group-hover:bg-cyan-100">
                  Click to preview
                </div>
              </div>
              </Link>

              <Link
                href="/preview/current-electricity"
                className="group flex items-center justify-between gap-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5 transition hover:-translate-y-1 hover:bg-cyan-300/15"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                    New - 12th Physics Notes
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Current Electricity Handwritten Notes
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    One-time email preview, paid PDF download.
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-orange-500 px-4 py-3 font-black text-white">
                  Rs 50
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section id="offers" className="px-5 py-20 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                What You Get
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">
                A focused system for learning, practice and revision.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {offers.map((offer) => (
                <article
                  key={offer.title}
                  className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <h3 className="text-xl font-black text-slate-950">
                    {offer.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-600">{offer.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="courses" className="bg-white px-5 py-20 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
                  Courses
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">
                  Choose your preparation track.
                </h2>
              </div>
              <p className="max-w-xl leading-7 text-slate-600">
                Every course combines classes, notes, DPPs and test practice so
                students can move from concept to exam-level confidence.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.title}
                  className="rounded-lg border border-slate-200 bg-[#f8fafc] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-800">
                    {course.tag}
                  </span>
                  <h3 className="mt-5 text-2xl font-black text-slate-950">
                    {course.title}
                  </h3>
                  <p className="mt-4 min-h-24 leading-7 text-slate-600">
                    {course.detail}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-2xl font-black text-slate-950">
                      {course.price}
                    </p>
                    <Link
                      href="/courses"
                      className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
                    >
                      Enroll
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="notes" className="px-5 py-20 sm:px-8 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                Resources
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">
                Study material arranged for fast revision.
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Notes and practice sets are organized topic-by-topic, helping
                students revise efficiently before classes, tests and exams.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((resource) => (
                <div
                  key={resource}
                  className="rounded-lg border border-slate-200 bg-white p-5 font-bold text-slate-800 shadow-sm"
                >
                  {resource}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="bpsc-tests" className="bg-[#07111f] px-5 py-20 text-white sm:px-8 lg:px-16">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                BPSC TRE 4.0
              </p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-normal">
                BPSC Physics Complete Bilingual Test
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                Attempt all 43 shuffled Hindi-English questions in one test, skip any
                question and get an instant result, explanations and PDF download.
              </p>
            </div>
            <Link
              href="/bpsc-physics-tre-4?tab=tests"
              className="w-full rounded-lg bg-orange-500 px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400 md:w-auto"
            >
              Get 30-day Access - Rs 99
            </Link>
          </div>
        </section>

        <footer className="bg-slate-950 px-5 py-7 text-sm text-slate-400">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <span>MAPHY - Maths and Physics Learning Platform</span>
            <div className="flex items-center gap-5 font-bold">
              <Link href="/help" className="transition hover:text-cyan-200">
                Help Centre
              </Link>
              <Link href="/help#feedback" className="transition hover:text-cyan-200">
                Send Feedback
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
