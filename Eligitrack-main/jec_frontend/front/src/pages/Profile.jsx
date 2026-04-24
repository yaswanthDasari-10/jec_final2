import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const SKILLS_LIST = [
  "Java","Python","React","Node.js","MongoDB","C","C++","Angular","Vue",
  "HTML","CSS","JavaScript","Bootstrap","Tailwind","SpringBoot","Django",
  "Flask","MySQL","Git","GitHub","AWS","CI/CD","Docker","Kubernetes",
  "Machine Learning","Deep Learning","Artificial Intelligence","NumPy","Pandas",
  "TensorFlow","PyTorch","SQL","TypeScript","REST APIs","Linux","Spring Boot",
];

export default function Profile() {
  // ── Pre-fill from localStorage user ──
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name:    storedUser.name    || "",
    phone:   storedUser.phone   || "",
    address: storedUser.address || "",
    city:    storedUser.city    || "",
    state:   storedUser.state   || "",
    country: storedUser.country || "",
    pincode: storedUser.pincode || "",
    cgpa:    storedUser.cgpa    || "",
    branch:  storedUser.branch  || "",
  });
  const [selectedSkills, setSelectedSkills] = useState(storedUser.skills || []);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  // Try to fetch fresh data from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        const u = res.data.user || res.data;
        setForm({
          name:    u.name    || storedUser.name    || "",
          phone:   u.phone   || storedUser.phone   || "",
          address: u.address || storedUser.address || "",
          city:    u.city    || storedUser.city    || "",
          state:   u.state   || storedUser.state   || "",
          country: u.country || storedUser.country || "",
          pincode: u.pincode || storedUser.pincode || "",
          cgpa:    u.cgpa    || storedUser.cgpa    || "",
          branch:  u.branch  || storedUser.branch  || "",
        });
        if (u.skills?.length) setSelectedSkills(u.skills);
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify({ ...storedUser, ...u }));
      } catch {
        // Silently fallback to localStorage data (already pre-filled)
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleSkill = (skill) =>
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await API.put("/jobs/update-profile", { ...form, skills: selectedSkills });
      // Update localStorage with new values
      const updatedUser = { ...storedUser, ...form, skills: selectedSkills };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "name",    placeholder: "Full Name",           span: 1 },
    { name: "phone",   placeholder: "Phone Number",        span: 1 },
    { name: "branch",  placeholder: "Branch (e.g. CSE)",   span: 1 },
    { name: "cgpa",    placeholder: "CGPA (e.g. 8.5)",     span: 1, type: "number" },
    { name: "address", placeholder: "Address",             span: 2 },
    { name: "city",    placeholder: "City",                span: 1 },
    { name: "state",   placeholder: "State",               span: 1 },
    { name: "country", placeholder: "Country",             span: 1 },
    { name: "pincode", placeholder: "Pincode",             span: 1 },
  ];

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" />
      <Navbar />

      <div className="content-wrapper" style={{ maxWidth: 700 }}>
        {/* Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f0ff", margin: "0 0 6px" }}>🧑‍💼 My Profile</h2>
          <p style={{ color: "#5f5c7a", fontSize: 14 }}>
            {fetching ? "Loading your details..." : `Logged in as ${storedUser.email || "student"} · Roll: ${storedUser.rollNo || "—"}`}
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="animate-scaleIn" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, color: "#4ade80", fontWeight: 700, fontSize: 14 }}>
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Student Info Bar */}
        {(storedUser.rollNo || storedUser.branch) && (
          <div className="section-card animate-fadeInUp delay-100" style={{ padding: "16px 20px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 20 }}>
            {[
              { label: "Roll No",    value: storedUser.rollNo  },
              { label: "Branch",     value: form.branch || storedUser.branch  },
              { label: "CGPA",       value: form.cgpa   || storedUser.cgpa   },
              { label: "Backlogs",   value: storedUser.backlogs ?? "0"       },
              { label: "Email",      value: storedUser.email                 },
            ].filter(f => f.value).map(f => (
              <div key={f.label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#c084fc", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontWeight: 700, color: "#f1f0ff", fontSize: 14 }}>{f.value}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="section-card animate-fadeInUp delay-100">
            <h3 style={{ fontWeight: 800, color: "#f1f0ff", marginBottom: 20, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              👤 Personal Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {inputFields.map(f => (
                <div key={f.name} style={{ gridColumn: f.span === 2 ? "1 / -1" : undefined }}>
                  <label className="dark-label">{f.placeholder}</label>
                  {f.name === "branch" ? (
                    <select
                      name={f.name}
                      onChange={handleChange} value={form[f.name]}
                      className="dark-input"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="" disabled>Select your branch</option>
                      {["CSE","IT","ECE","EEE","MECH","CIVIL","DS","AIDS","AI","AIML","BCA","MCA","CSD","CSM","CSC"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={f.name} placeholder={f.placeholder}
                      onChange={handleChange} value={form[f.name]}
                      className="dark-input" type={f.type || "text"}
                      step={f.name === "cgpa" ? "0.1" : undefined}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="section-card animate-fadeInUp delay-200">
            <h3 style={{ fontWeight: 800, color: "#f1f0ff", marginBottom: 6, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              🧠 My Skills
            </h3>
            <p style={{ color: "#5f5c7a", fontSize: 12, marginBottom: 16 }}>
              {selectedSkills.length > 0
                ? <span style={{ color: "#c084fc", fontWeight: 700 }}>{selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""} selected</span>
                : "Click to select your skills"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {[...new Set([...SKILLS_LIST, ...selectedSkills])].map(skill => (
                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                  className={`skill-badge ${selectedSkills.includes(skill) ? "selected" : "unselected"}`}>
                  {selectedSkills.includes(skill) ? "✓ " : ""}{skill}
                </button>
              ))}
            </div>
            {/* Custom Skill Input */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <input
                type="text"
                className="dark-input"
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
              />
              <button type="button" onClick={addCustomSkill} className="btn-secondary" style={{ padding: "10px 18px", whiteSpace: "nowrap" }}>
                + Add
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary animate-fadeInUp delay-300"
            style={{ width: "100%", padding: "15px", fontSize: 16, borderRadius: 14, marginTop: 4, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? <><span className="animate-spin" style={{ display: "inline-block", marginRight: 10 }}>⟳</span>Updating...</> : "Update Profile 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}