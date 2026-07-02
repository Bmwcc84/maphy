import Navbar from "../components/Navbar";

const offers = [
  {
    title: "Live Classes",
    text: "Interactive Physics and Maths classes with doubt discussion.",
  },
  {
    title: "Premium Notes",
    text: "Chapter-wise notes, formula sheets and quick revision PDFs.",
  },
  {
    title: "Test Series",
    text: "JEE and NEET mock tests with analysis and practice strategy.",
  },
];

const courses = [
  {
    title: "NEET Physics",
    detail: "Complete NEET Physics course with concepts, DPPs and PYQs.",
    price: "Rs 1999",
  },
  {
    title: "JEE Physics",
    detail: "JEE Main + Advanced preparation with problem-solving sessions.",
    price: "Rs 2499",
  },
  {
    title: "Class 12 Board",
    detail: "CBSE and Bihar Board Physics with exam-focused revision.",
    price: "Rs 1499",
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
      <Navbar />

      <main
        style={{
          background: "#081120",
          color: "white",
          minHeight: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <section
          style={{
            padding: "118px 24px 90px",
            textAlign: "center",
            background:
              "linear-gradient(135deg, #081120 0%, #0F172A 55%, #164E63 100%)",
          }}
        >
          <p style={{ color: "#67E8F9", fontSize: "18px", marginBottom: "14px" }}>
            Physics + Mathematics for JEE Main, JEE Advanced and NEET
          </p>

          <h1
            style={{
              fontSize: "clamp(48px, 10vw, 82px)",
              color: "#38BDF8",
              margin: "0 0 18px",
              letterSpacing: "0",
            }}
          >
            MAPHY
          </h1>

          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              maxWidth: "900px",
              margin: "0 auto 16px",
              lineHeight: "1.25",
            }}
          >
            Master Maths and Physics with clear concepts, practice and tests
          </h2>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto 34px",
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#D7E0EA",
            }}
          >
            Learn from structured lessons, chapter-wise notes, DPPs, PYQ
            solutions and test series designed for serious exam preparation.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#courses"
              style={{
                background: "#F97316",
                color: "white",
                border: "none",
                padding: "16px 34px",
                borderRadius: "8px",
                fontSize: "20px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Start Learning
            </a>
            <a
              href="/login"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                padding: "16px 30px",
                borderRadius: "8px",
                fontSize: "20px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Student Login
            </a>
          </div>
        </section>

        <section id="offers" style={{ padding: "70px 24px", background: "#0F172A" }}>
          <h2 style={{ textAlign: "center", fontSize: "42px", marginBottom: "40px" }}>
            What MAPHY Offers
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {offers.map((offer) => (
              <div
                key={offer.title}
                style={{
                  width: "300px",
                  background: "#1E293B",
                  padding: "28px",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                }}
              >
                <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>
                  {offer.title}
                </h3>
                <p style={{ color: "#CBD5E1", lineHeight: "1.6" }}>{offer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="courses" style={{ padding: "70px 24px" }}>
          <h2 style={{ textAlign: "center", fontSize: "42px", marginBottom: "40px" }}>
            Our Top Courses
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {courses.map((course) => (
              <div
                key={course.title}
                style={{
                  width: "300px",
                  background: "#1E293B",
                  padding: "28px",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                }}
              >
                <h3 style={{ fontSize: "24px" }}>{course.title}</h3>
                <p style={{ color: "#CBD5E1", lineHeight: "1.55" }}>
                  {course.detail}
                </p>
                <p style={{ color: "#38BDF8", fontSize: "22px", fontWeight: "bold" }}>
                  {course.price}
                </p>
                <button
                  style={{
                    background: "#F97316",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="notes" style={{ padding: "70px 24px", background: "#0B1528" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "42px", marginBottom: "16px" }}>
              Study Resources
            </h2>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "18px",
                lineHeight: "1.7",
                margin: "0 auto 34px",
                maxWidth: "720px",
                textAlign: "center",
              }}
            >
              Everything is arranged topic-by-topic so you can learn, revise and
              test without wasting time.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
              }}
            >
              {resources.map((resource) => (
                <div
                  key={resource}
                  style={{
                    background: "#12213A",
                    border: "1px solid rgba(56, 189, 248, 0.22)",
                    borderRadius: "8px",
                    color: "#E2E8F0",
                    fontSize: "18px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  {resource}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tests" style={{ padding: "70px 24px" }}>
          <div
            style={{
              maxWidth: "920px",
              margin: "0 auto",
              textAlign: "center",
              background: "#1E293B",
              borderRadius: "8px",
              padding: "42px 28px",
              border: "1px solid rgba(148, 163, 184, 0.18)",
            }}
          >
            <h2 style={{ fontSize: "38px", margin: "0 0 14px" }}>
              Ready for focused preparation?
            </h2>
            <p
              style={{
                color: "#CBD5E1",
                fontSize: "18px",
                lineHeight: "1.7",
                margin: "0 auto 28px",
                maxWidth: "680px",
              }}
            >
              Join MAPHY to get live learning, planned revision, test practice and
              exam-ready notes in one place.
            </p>
            <a
              href="/login"
              style={{
                background: "#38BDF8",
                color: "#07111F",
                display: "inline-block",
                fontSize: "18px",
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Join MAPHY
            </a>
          </div>
        </section>

        <footer
          style={{
            padding: "28px",
            textAlign: "center",
            background: "#020617",
            color: "#94A3B8",
          }}
        >
          MAPHY - Maths and Physics Learning Platform
        </footer>
      </main>
    </>
  );
}
