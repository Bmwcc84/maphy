import Link from "next/link";
import ElectrostaticsPreview from "../../../components/ElectrostaticsPreview";

export default function ElectrostaticsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-8 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300 text-lg font-black text-slate-950">
              M
            </span>
            <span className="text-xl font-black">MAPHY</span>
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
            1 minute free preview
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Timer yahin start hota hai. 1 minute ke baad preview lock hoga aur
            full handwritten notes ke liye Rs 50 payment demand aayegi.
          </p>
        </section>

        <ElectrostaticsPreview />
      </div>
    </main>
  );
}
