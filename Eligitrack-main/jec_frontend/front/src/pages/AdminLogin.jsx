import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { default: API } = await import("../services/api");
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const user = res.data.user || {};
      localStorage.setItem("user", JSON.stringify(user));
      const role = (user.role || res.data.role || "").toLowerCase();
      if (role === "admin") navigate("/admin");
      else alert("Access denied! This account is not an admin.");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)", top: -160, left: -160, position: "absolute", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none" }} />
      <div className="bg-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", bottom: -120, right: -120, position: "absolute", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none" }} />

      <div className="glass-card animate-scaleIn" style={{ width: "100%", maxWidth: 420, padding: "44px 40px", position: "relative", zIndex: 1, borderColor: "rgba(245,158,11,0.2)" }}>
        <div className="animate-fadeInUp" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 8px 30px rgba(245,158,11,0.45)", fontSize: 28, animation: "glow-a 2.5s ease-in-out infinite" }}>👨‍💼</div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#f1f0ff" }}>Admin Portal</h1>
          <p style={{ margin: "6px 0 0", color: "#5f5c7a", fontSize: 13 }}>Placement Cell Access</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24", padding: "4px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>🔒 Restricted Access</div>
        </div>

        <form onSubmit={handleLogin} className="animate-fadeInUp delay-100">
          <div style={{ marginBottom: 16 }}>
            <label className="dark-label-amber">Admin Email</label>
            <input type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="dark-input" style={{ borderColor: "rgba(245,158,11,0.2)" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="dark-label-amber">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="dark-input" style={{ paddingRight: 44, borderColor: "rgba(245,158,11,0.2)" }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0 }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-amber" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          <span onClick={() => navigate("/")} style={{ color: "#3d3a55", cursor: "pointer" }}>← Back to home</span>
        </p>
      </div>
    </div>
  );
}