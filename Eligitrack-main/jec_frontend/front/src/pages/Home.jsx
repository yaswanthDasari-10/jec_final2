import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* ── Navbar ── */}
      <nav className="dark-nav">
        <div className="nav-logo">
          <div className="nav-logo-icon animate-glow-v">ET</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#f1f0ff" }}>EligiTrack</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/login")} className="btn-secondary" style={{ padding: "9px 20px" }}>
            🎓 Student
          </button>
          <button onClick={() => navigate("/admin-login")} className="btn-primary" style={{ padding: "9px 20px" }}>
            👨‍💼 Admin
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "90px 24px 60px", position: "relative" }}>
        <div className="animate-scaleIn" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)",
          color: "#c084fc", padding: "8px 20px", borderRadius: 999,
          fontSize: 13, fontWeight: 600, marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Intelligent Campus Placement Platform
        </div>

        <h1 className="animate-fadeInUp delay-100" style={{ fontSize: "clamp(38px,6vw,72px)", fontWeight: 900, lineHeight: 1.1, color: "#f1f0ff", margin: "0 0 24px" }}>
          Track Your Eligibility<br />
          <span className="gradient-text-animated">Land Your Dream Job</span>
        </h1>

        <p className="animate-fadeInUp delay-200" style={{ fontSize: 18, color: "#a09aba", maxWidth: 540, margin: "0 auto 44px", lineHeight: 1.8 }}>
          Smart eligibility matching for campus placements. Students discover opportunities, placement cells find perfect candidates.
        </p>

        <div className="animate-fadeInUp delay-300" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 72 }}>
          <button onClick={() => navigate("/login")} className="btn-primary" style={{ padding: "16px 36px", fontSize: 16 }}>
            🎓 Student Portal →
          </button>
          <button onClick={() => navigate("/admin-login")} className="btn-secondary" style={{ padding: "16px 36px", fontSize: 16 }}>
            👨‍💼 Admin Portal →
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fadeInUp delay-400" style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", maxWidth: 700, margin: "0 auto" }}>
          {[
            { n: "6+", l: "Job Roles", icon: "💼" },
            { n: "30+", l: "Skills Tracked", icon: "⚡" },
            { n: "Instant", l: "Eligibility Check", icon: "🎯" },
            { n: "Smart", l: "Skill Matching", icon: "🧠" },
            { n: "Easy", l: "Resume Upload", icon: "📋" },
          ].map((s, i) => (
            <div key={s.l} className="stat-card animate-fadeInUp" style={{ animationDelay: `${0.45 + i * 0.08}s` }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <div className="gradient-text" style={{ fontSize: 20, fontWeight: 900 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#5f5c7a", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "20px 24px 80px" }}>
        <div className="animate-fadeInUp" style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#f1f0ff", margin: "0 0 12px" }}>How It Works</h2>
          <p style={{ color: "#5f5c7a", fontSize: 16 }}>Four steps to smarter campus placements</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { icon: "📝", step: "01", title: "Create Profile", text: "Register with your academic details, skills and resume." },
            { icon: "🔍", step: "02", title: "Check Eligibility", text: "Instantly see which roles you qualify for and what's missing." },
            { icon: "✅", step: "03", title: "Apply & Track", text: "One-click apply to eligible roles. Track your status live." },
            { icon: "👨‍💼", step: "04", title: "Admin Reviews", text: "Officers review resumes and shortlist candidates." },
          ].map((f, i) => (
            <div key={f.step} className="glass-card animate-fadeInUp" style={{ padding: "28px 22px", animationDelay: `${0.1 + i * 0.12}s` }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#a855f7", marginBottom: 8, background: "rgba(168,85,247,0.1)", display: "inline-block", padding: "2px 10px", borderRadius: 999 }}>
                STEP {f.step}
              </div>
              <div style={{ fontWeight: 800, color: "#f1f0ff", fontSize: 16, marginBottom: 8, marginTop: 10 }}>{f.title}</div>
              <p style={{ color: "#5f5c7a", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="glass-card animate-fadeInUp" style={{
          padding: "40px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
          background: "linear-gradient(135deg, rgba(168,85,247,0.09) 0%, rgba(245,158,11,0.06) 100%)",
          borderColor: "rgba(168,85,247,0.25)",
        }}>
          <div>
            <h3 style={{ fontSize: 26, fontWeight: 900, color: "#f1f0ff", marginBottom: 10 }}>Ready to find your dream role?</h3>
            <p style={{ color: "#a09aba", fontSize: 15 }}>Join thousands of students who've already found their path.</p>
          </div>
          <button onClick={() => navigate("/signup")} className="btn-primary" style={{ padding: "14px 32px", fontSize: 16, whiteSpace: "nowrap" }}>
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(168,85,247,0.08)", padding: "28px 24px", textAlign: "center", background: "rgba(10,11,20,0.6)" }}>
        <div className="nav-logo" style={{ justifyContent: "center", marginBottom: 8 }}>
          <div className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: 11 }}>ET</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#f1f0ff" }}>EligiTrack</span>
        </div>
        <p style={{ color: "#3d3a55", fontSize: 13, margin: 0 }}>Smart Campus Placement Eligibility System</p>
      </footer>
    </div>
  );
}