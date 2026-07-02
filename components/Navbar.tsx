import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/#courses" },
  { label: "Notes", href: "/#notes" },
  { label: "Tests", href: "/#tests" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  return (
    <nav
      style={{
        background: "rgba(17, 24, 39, 0.96)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "18px clamp(20px, 6vw, 80px)",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
        zIndex: 10,
        boxSizing: "border-box",
        borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#38BDF8",
          fontSize: "26px",
          fontWeight: 800,
          textDecoration: "none",
        }}
      >
        MAPHY
      </Link>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
