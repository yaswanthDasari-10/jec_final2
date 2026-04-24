import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState(""); const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState(""); const [cgpa, setCgpa] = useState("");
  const [backlogs, setBacklogs] = useState(0); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !rollNo || !branch || !cgpa || !email || !password) {
      alert("Please fill in all mandatory fields.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/signup", { name, rollNo, branch, cgpa, backlogs, email, password });
      alert("Signup successful 🎉"); navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "24px" }}>
      <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" />

      <div className="glass-card animate-scaleIn" style={{ width: "100%", maxWidth: 500, padding: "40px 44px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div className="animate-fadeInUp" style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #a855f7, #7c3aed)", borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: "0 8px 30px rgba(168,85,247,0.45)", animation: "glow-v 2.5s ease-in-out infinite" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 20 }}>ET</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#f1f0ff" }}>Create Your Account</h1>
          <p style={{ margin: "6px 0 0", color: "#5f5c7a", fontSize: 13 }}>Campus Placement Registration</p>
        </div>

        {/* Tabs */}
        <div className="animate-fadeInUp delay-100 tab-bar">
          <button onClick={() => navigate("/login")} className="tab-btn">Sign In</button>
          <button className="tab-btn active">Register</button>
        </div>

        <form onSubmit={handleSignup} className="animate-fadeInUp delay-200">
          <div style={{ marginBottom: 14 }}>
            <label className="dark-label">Full Name</label>
            <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required className="dark-input" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="dark-label">Roll Number</label>
            <input type="text" placeholder="e.g. 24131A0501" value={rollNo} onChange={e => setRollNo(e.target.value)} required className="dark-input" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label className="dark-label">Branch</label>
              <select value={branch} onChange={e => setBranch(e.target.value)} required className="dark-input" style={{ cursor: "pointer" }}>
                <option value="" disabled>Select Branch</option>
                {["CSE","IT","ECE","EEE","MECH","CIVIL","DS","AIDS","AI","AIML","BCA","MCA","CSD","CSM","CSC"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="dark-label">CGPA</label>
              <input type="number" placeholder="e.g. 8.5" step="0.1" min="0" max="10" value={cgpa} onChange={e => setCgpa(e.target.value)} required className="dark-input" />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="dark-label">Active Backlogs</label>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
              <button type="button" onClick={() => setBacklogs(Math.max(0, backlogs - 1))} className="stepper-btn">−</button>
              <span style={{ fontSize: 20, fontWeight: 800, color: backlogs > 0 ? "#f87171" : "#f1f0ff", minWidth: 28, textAlign: "center", transition: "color 0.25s" }}>{backlogs}</span>
              <button type="button" onClick={() => setBacklogs(backlogs + 1)} className="stepper-btn">+</button>
              {backlogs > 0 && (
                <button type="button" onClick={() => setBacklogs(0)} style={{ fontSize: 12, color: "#c084fc", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}>✓ Clear</button>
              )}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="dark-label">Email Address</label>
            <input type="email" placeholder="yourname@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required className="dark-input" />
          </div>
          <div style={{ marginBottom: 26 }}>
            <label className="dark-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="dark-input" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0 }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p className="animate-fadeInUp delay-300" style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#5f5c7a" }}>
          Have an account? <span onClick={() => navigate("/login")} style={{ color: "#c084fc", fontWeight: 700, cursor: "pointer" }}>Sign in</span>
        </p>
        <p className="animate-fadeInUp delay-400" style={{ textAlign: "center", marginTop: 8, fontSize: 13 }}>
          <span onClick={() => navigate("/")} style={{ color: "#3d3a55", cursor: "pointer" }}>← Back to home</span>
        </p>
      </div>
    </div>
  );
}