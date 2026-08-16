import Link from "next/link";
import BrandLogo from "./BrandLogo";

const links = [
  { label: "Courses", href: "/#courses" },
  { label: "Notes", href: "/#notes" },
  { label: "Tests", href: "/#board-2027-tests" },
  { label: "Help", href: "/help" },
];

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#07111f]/95 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-8 lg:px-16">
        <Link href="/" className="text-white" aria-label="MAPHY home">
          <BrandLogo size="sm" priority />
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

        <div className="flex items-center gap-2">
          <Link
            href="/help"
            className="px-2 py-2 text-sm font-bold text-slate-200 transition hover:text-cyan-200 md:hidden"
          >
            Help
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-white px-3 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100 sm:px-4"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
