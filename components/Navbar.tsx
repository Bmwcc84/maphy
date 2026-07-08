import Link from "next/link";

const links = [
  { label: "Courses", href: "/#courses" },
  { label: "Notes", href: "/#notes" },
  { label: "Tests", href: "/#tests" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#07111f]/95 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300 text-lg font-black text-slate-950">
            M
          </span>
          <span className="text-xl font-black tracking-normal">MAPHY</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-bold text-slate-200 transition hover:text-cyan-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
