import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import HandwrittenNotesPreview from "../../../components/HandwrittenNotesPreview";

export default function ElectrostaticsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="text-white" aria-label="MAPHY home">
            <BrandLogo />
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15"
          >
            Back
          </Link>
        </header>

        <section className="py-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
            Electrostatics Preview
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
            ELECTROSTATICS HANDWRITTEN NOTES
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Email login ke baad is chapter ka preview sirf ek baar milega.
            Poora PDF 2 minute tak scroll karein; uske baad account permanently
            lock hoga aur full notes Rs 50 me milenge.
          </p>
        </section>

        <HandwrittenNotesPreview
          courseId="electrostatics-handwritten-notes"
          pageCount={93}
          previewId="electrostatics"
          title="Electrostatics Handwritten Notes"
        />
      </div>
    </main>
  );
}
