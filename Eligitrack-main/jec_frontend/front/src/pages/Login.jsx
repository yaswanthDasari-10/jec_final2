import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all mandatory fields.");
      return;
    }
    setLoading(true);
    try {
      const { default: API } = await import("../services/api");
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      const role = (res.data.user?.role || res.data.role || "").toLowerCase();
      if (role === "admin") navigate("/admin");
      else navigate("/jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" />

      <div className="glass-card animate-scaleIn" style={{ width: "100%", maxWidth: 420, padding: "44px 40px", position: "relative", zIndex: 1 }}>
        <div className="animate-fadeInUp" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, #a855f7, #7c3aed)", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 8px 30px rgba(168,85,247,0.45)", animation: "glow-v 2.5s ease-in-out infinite" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 22 }}>ET</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#f1f0ff" }}>Student Portal</h1>
          <p style={{ margin: "6px 0 0", color: "#5f5c7a", fontSize: 13 }}>Campus Placement Login</p>
        </div>

        <div className="animate-fadeInUp delay-100 tab-bar">
          <button className="tab-btn active">Sign In</button>
          <button onClick={() => navigate("/signup")} className="tab-btn">Register</button>
        </div>

        <form onSubmit={handleLogin} className="animate-fadeInUp delay-200">
          <div style={{ marginBottom: 16 }}>
            <label className="dark-label">Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="dark-input" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="dark-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="dark-input" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0 }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
            {loading ? <><span className="animate-spin" style={{ display: "inline-block", marginRight: 8 }}>⟳</span>Signing in...</> : "Sign In →"}
          </button>
        </form>

        <p className="animate-fadeInUp delay-300" style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#5f5c7a" }}>
          No account? <span onClick={() => navigate("/signup")} style={{ color: "#c084fc", fontWeight: 700, cursor: "pointer" }}>Register here</span>
        </p>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 13 }}>
          <span onClick={() => navigate("/")} style={{ color: "#3d3a55", cursor: "pointer" }}>← Back to home</span>
        </p>
      </div>
    </div>
  );
}