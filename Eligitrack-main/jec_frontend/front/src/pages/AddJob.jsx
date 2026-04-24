import { useState } from "react";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

const BRANCHES_LIST  = ["CSE","IT","ECE","EEE","MECH","CIVIL","DS","AIDS","AI","AIML","BCA","MCA","CSD","CSM","CSC"];
const ROUNDS_LIST    = ["Aptitude","Technical","HR","Group Discussion","Coding round","System design","Online test"];
const JOB_TYPES      = ["Full-time","Part-time","Internship","Contract"];
const DRIVE_TYPES    = ["On-campus","Off-campus","Pool campus"];
const ALL_SKILLS     = [
  "Python","Java","JavaScript","C++","SQL","HTML","CSS","React","Node.js",
  "Machine Learning","TensorFlow","MongoDB","Docker","Kubernetes","AWS","Git",
  "Linux","REST APIs","Spring Boot","TypeScript","Figma","Tableau","Power BI",
  "Excel","CI/CD","Django","Flask","Deep Learning","AI","GitHub","MySQL",
  "Bootstrap","Tailwind","Angular","Vue","Statistics","Firebase","NumPy","Pandas",
];

const PillGroup = ({ items, selected, onToggle, accent = "teal" }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map(item => {
      const active = selected.includes(item);
      return (
        <button
          key={item} type="button"
          onClick={() => onToggle(item)}
          className={`skill-badge ${active ? "selected" : "unselected"}`}
          style={active && accent === "violet" ? {
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            boxShadow: "0 2px 10px rgba(245,158,11,0.3)",
          } : {}}
        >
          {active ? "✓ " : ""}{item}
        </button>
      );
    })}
  </div>
);

const FormCard = ({ title, children, delay = 0 }) => (
  <div className={`section-card animate-fadeInUp`} style={{ animationDelay: `${delay}s` }}>
    <h3 style={{ fontWeight: 800, color: "#f1f5f9", marginBottom: 18, fontSize: 15 }}>{title}</h3>
    {children}
  </div>
);

export default function AddJob() {
  const [form, setForm] = useState({
    title: "", company: "", location: "",
    jobType: "Full-time", salaryPackage: "",
    minCGPA: 7.0, maxBacklogs: 0,
    lastDateToApply: "", driveType: "On-campus",
    description: "",
  });
  const [selBranches, setSelBranches]     = useState([]);
  const [selSkills, setSelSkills]         = useState([]);
  const [customSkill, setCustomSkill]     = useState("");
  const [customBranch, setCustomBranch]   = useState("");
  const [selRounds, setSelRounds]         = useState([]);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [error, setError]                 = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggle = (arr, setArr, val) =>
    setArr(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  const addCustomSkill = () => {
    if (customSkill.trim() && !selSkills.includes(customSkill.trim())) {
      setSelSkills(p => [...p, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const addCustomBranch = () => {
    if (customBranch.trim() && !selBranches.includes(customBranch.trim().toUpperCase())) {
      setSelBranches(p => [...p, customBranch.trim().toUpperCase()]);
      setCustomBranch("");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.company || !form.title || !form.location || !form.salaryPackage || !form.lastDateToApply) {
      setError("Please fill all required fields."); return;
    }
    if (selSkills.length === 0) { setError("Add at least one required skill."); return; }
    if (selBranches.length === 0) { setError("Select at least one allowed branch."); return; }

    setLoading(true);
    try {
      await API.post("/jobs/add", {
        title: form.title,
        company: form.company,
        location: form.location,
        jobType: form.jobType,
        salaryPackage: parseFloat(form.salaryPackage),
        requiredSkills: selSkills,
        minCGPA: parseFloat(form.minCGPA),
        allowedBranches: selBranches,
        lastDateToApply: form.lastDateToApply,
        driveType: form.driveType,
        selectionRounds: selRounds,
        description: form.description,
        maxBacklogs: parseInt(form.maxBacklogs),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      alert("Job posted successfully! 🚀");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // reset
      setForm({ title:"", company:"", location:"", jobType:"Full-time", salaryPackage:"", minCGPA:7.0, maxBacklogs:0, lastDateToApply:"", driveType:"On-campus", description:"" });
      setSelBranches([]); setSelSkills([]); setSelRounds([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />
      <div className="bg-orb bg-orb-2" />
      <AdminNavbar />

      <div className="content-wrapper" style={{ maxWidth: 780 }}>

        {/* Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", margin: "0 0 6px" }}>
            ➕ Post New Job
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Create a job posting for students to discover and apply.
          </p>
        </div>

        {/* Banners */}
        {success && (
          <div className="animate-scaleIn" style={{
            background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 12, padding: "14px 20px", marginBottom: 20,
            color: "#4ade80", fontWeight: 700, fontSize: 14,
          }}>
            ✅ Job posted successfully! Students can now see and apply.
          </div>
        )}
        {error && (
          <div className="animate-scaleIn" style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "14px 20px", marginBottom: 20,
            color: "#f87171", fontWeight: 700, fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <FormCard title="📋 Basic Information" delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="dark-label">Company Name *</label>
                <input name="company" placeholder="e.g. Google" value={form.company} onChange={handleChange} className="dark-input" />
              </div>
              <div>
                <label className="dark-label">Job Title *</label>
                <input name="title" placeholder="e.g. SDE-1" value={form.title} onChange={handleChange} className="dark-input" />
              </div>
              <div>
                <label className="dark-label">Location *</label>
                <input name="location" placeholder="e.g. Hyderabad" value={form.location} onChange={handleChange} className="dark-input" />
              </div>
              <div>
                <label className="dark-label">Salary (LPA) *</label>
                <input name="salaryPackage" type="number" placeholder="e.g. 6.5" step="0.1" value={form.salaryPackage} onChange={handleChange} className="dark-input" />
              </div>
              <div>
                <label className="dark-label">Job Type</label>
                <select name="jobType" value={form.jobType} onChange={handleChange} className="dark-input" style={{ cursor: "pointer" }}>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="dark-label">Drive Type</label>
                <select name="driveType" value={form.driveType} onChange={handleChange} className="dark-input" style={{ cursor: "pointer" }}>
                  {DRIVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dark-label">Last Date to Apply *</label>
                <input name="lastDateToApply" type="date" value={form.lastDateToApply} onChange={handleChange} className="dark-input" />
              </div>
            </div>
          </FormCard>

          {/* Eligibility */}
          <FormCard title="🎓 Eligibility Criteria" delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div>
                <label className="dark-label">
                  Min CGPA — <span style={{ color: "#c084fc", fontWeight: 900 }}>{form.minCGPA}</span>
                </label>
                <input
                  type="range" name="minCGPA" min="0" max="10" step="0.1"
                  value={form.minCGPA} onChange={handleChange}
                  style={{ width: "100%", accentColor: "#a855f7", marginTop: 8 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginTop: 4 }}>
                  <span>0</span><span>10</span>
                </div>
              </div>
              <div>
                <label className="dark-label">Max Backlogs</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <button type="button" onClick={() => setForm(f => ({ ...f, maxBacklogs: Math.max(0, f.maxBacklogs - 1) }))} className="stepper-btn">−</button>
                  <span style={{ fontSize: 22, fontWeight: 800, color: form.maxBacklogs > 0 ? "#f87171" : "#f1f5f9", minWidth: 28, textAlign: "center" }}>
                    {form.maxBacklogs}
                  </span>
                  <button type="button" onClick={() => setForm(f => ({ ...f, maxBacklogs: f.maxBacklogs + 1 }))} className="stepper-btn">+</button>
                </div>
              </div>
            </div>

            <label className="dark-label" style={{ marginBottom: 10, display: "block" }}>Allowed Branches *</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setSelBranches(selBranches.length >= BRANCHES_LIST.length ? [] : [...BRANCHES_LIST])}
                className={`skill-badge ${selBranches.length >= BRANCHES_LIST.length ? "selected" : "unselected"}`}
              >
                {selBranches.length >= BRANCHES_LIST.length ? "✓ All Branches" : "All Branches"}
              </button>
              {[...new Set([...BRANCHES_LIST, ...selBranches])].map(b => (
                <button
                  key={b} type="button"
                  onClick={() => toggle(selBranches, setSelBranches, b)}
                  className={`skill-badge ${selBranches.includes(b) ? "selected" : "unselected"}`}
                >
                  {selBranches.includes(b) ? "✓ " : ""}{b}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="dark-input"
                placeholder="Add custom branch..."
                value={customBranch}
                onChange={e => setCustomBranch(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomBranch())}
              />
              <button type="button" onClick={addCustomBranch} className="btn-secondary" style={{ padding: "10px 18px", whiteSpace: "nowrap" }}>
                + Add
              </button>
            </div>
          </FormCard>

          {/* Skills */}
          <FormCard title="🧠 Required Skills *" delay={0.3}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {ALL_SKILLS.map(s => (
                <button
                  key={s} type="button"
                  onClick={() => toggle(selSkills, setSelSkills, s)}
                  className={`skill-badge ${selSkills.includes(s) ? "selected" : "unselected"}`}
                >
                  {selSkills.includes(s) ? "✓ " : ""}{s}
                </button>
              ))}
            </div>
            {/* Custom skill */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input
                className="dark-input"
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
              />
              <button type="button" onClick={addCustomSkill} className="btn-secondary" style={{ padding: "10px 18px", whiteSpace: "nowrap" }}>
                + Add
              </button>
            </div>
            {selSkills.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "#c084fc", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {selSkills.length} selected:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selSkills.map(s => (
                    <span key={s} style={{
                      background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
                      color: "#c084fc", padding: "4px 12px", borderRadius: 999,
                      fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {s}
                      <button
                        type="button"
                        onClick={() => setSelSkills(p => p.filter(x => x !== s))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, padding: 0, lineHeight: 1 }}
                      >×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </FormCard>

          {/* Selection Rounds */}
          <FormCard title="⚡ Selection Rounds" delay={0.4}>
            <PillGroup items={ROUNDS_LIST} selected={selRounds} onToggle={val => toggle(selRounds, setSelRounds, val)} accent="violet" />
          </FormCard>

          {/* Description */}
          <FormCard title="📝 Job Description" delay={0.5}>
            <textarea
              name="description"
              placeholder="Role description, responsibilities, perks, etc."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="dark-input"
              style={{ resize: "vertical", minHeight: 100 }}
            />
          </FormCard>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary animate-fadeInUp"
            style={{
              width: "100%", padding: "16px", fontSize: 16,
              borderRadius: 14, animationDelay: "0.55s",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <><span className="animate-spin" style={{ display: "inline-block", marginRight: 10 }}>⟳</span> Posting Job...</>
            ) : "🚀 Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}