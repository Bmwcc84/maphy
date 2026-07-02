import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #081120 0%, #0F172A 100%)",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
          boxSizing: "border-box",
          border: "1px solid rgba(148, 163, 184, 0.18)",
        }}
      >
        <h1 style={{ color: "#38BDF8", marginTop: 0 }}>MAPHY Login</h1>
        <p style={{ color: "#CBD5E1", marginBottom: "24px" }}>
          Continue your Maths and Physics preparation.
        </p>

        <input
          type="email"
          placeholder="Email"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "0",
            borderRadius: "8px",
            border: "none",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#F97316",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Login
        </button>

        <Link
          href="/"
          style={{
            color: "#38BDF8",
            display: "inline-block",
            marginTop: "20px",
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
