import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SKILL_LINKS = {
  "Python": { url: "https://www.geeksforgeeks.org/python-programming-language/", platform: "GeeksforGeeks" },
  "Java": { url: "https://www.geeksforgeeks.org/java/", platform: "GeeksforGeeks" },
  "JavaScript": { url: "https://www.geeksforgeeks.org/javascript/", platform: "GeeksforGeeks" },
  "SQL": { url: "https://www.geeksforgeeks.org/sql-tutorial/", platform: "GeeksforGeeks" },
  "HTML": { url: "https://www.geeksforgeeks.org/html-tutorial/", platform: "GeeksforGeeks" },
  "CSS": { url: "https://www.geeksforgeeks.org/css-tutorial/", platform: "GeeksforGeeks" },
  "React": { url: "https://www.geeksforgeeks.org/reactjs/", platform: "GeeksforGeeks" },
  "Node.js": { url: "https://www.geeksforgeeks.org/nodejs/", platform: "GeeksforGeeks" },
  "Machine Learning": { url: "https://nptel.ac.in/courses/106106139", platform: "NPTEL" },
  "TensorFlow": { url: "https://www.tensorflow.org/tutorials", platform: "TensorFlow Docs" },
  "PyTorch": { url: "https://pytorch.org/tutorials/", platform: "PyTorch Docs" },
  "NumPy": { url: "https://www.geeksforgeeks.org/numpy-tutorial/", platform: "GeeksforGeeks" },
  "MongoDB": { url: "https://learn.mongodb.com/", platform: "MongoDB University" },
  "Docker": { url: "https://www.geeksforgeeks.org/docker-tutorial/", platform: "GeeksforGeeks" },
  "Kubernetes": { url: "https://www.geeksforgeeks.org/kubernetes-tutorial/", platform: "GeeksforGeeks" },
  "AWS": { url: "https://explore.skillbuilder.aws/learn", platform: "AWS Skill Builder" },
  "Git": { url: "https://www.geeksforgeeks.org/git-tutorial/", platform: "GeeksforGeeks" },
  "Linux": { url: "https://www.geeksforgeeks.org/linux-tutorial/", platform: "GeeksforGeeks" },
  "REST APIs": { url: "https://www.geeksforgeeks.org/rest-api-introduction/", platform: "GeeksforGeeks" },
  "Spring Boot": { url: "https://www.geeksforgeeks.org/spring-boot/", platform: "GeeksforGeeks" },
  "TypeScript": { url: "https://www.typescriptlang.org/docs/", platform: "TypeScript Docs" },
  "Tableau": { url: "https://www.tableau.com/learn/training", platform: "Tableau Training" },
  "Power BI": { url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", platform: "Microsoft Learn" },
  "Excel": { url: "https://www.geeksforgeeks.org/microsoft-excel/", platform: "GeeksforGeeks" },
  "Statistics": { url: "https://nptel.ac.in/courses/110105041", platform: "NPTEL" },
  "Figma": { url: "https://www.youtube.com/c/figma", platform: "Figma YouTube" },
  "C++": { url: "https://www.geeksforgeeks.org/c-plus-plus/", platform: "GeeksforGeeks" },
  "Pandas": { url: "https://www.geeksforgeeks.org/pandas-tutorial/", platform: "GeeksforGeeks" },
  "Firebase": { url: "https://firebase.google.com/docs", platform: "Firebase Docs" },
  "CI/CD": { url: "https://www.geeksforgeeks.org/ci-cd-pipeline/", platform: "GeeksforGeeks" },
  "Django": { url: "https://www.geeksforgeeks.org/django-tutorial/", platform: "GeeksforGeeks" },
  "Flask": { url: "https://www.geeksforgeeks.org/flask-tutorial/", platform: "GeeksforGeeks" },
  "Deep Learning": { url: "https://nptel.ac.in/courses/106106184", platform: "NPTEL" },
  "AI": { url: "https://www.geeksforgeeks.org/artificial-intelligence/", platform: "GeeksforGeeks" },
  "GitHub": { url: "https://www.geeksforgeeks.org/git-tutorial/", platform: "GeeksforGeeks" },
  "MySQL": { url: "https://www.geeksforgeeks.org/mysql-tutorial/", platform: "GeeksforGeeks" },
  "Bootstrap": { url: "https://www.geeksforgeeks.org/bootstrap/", platform: "GeeksforGeeks" },
  "Tailwind": { url: "https://www.geeksforgeeks.org/tailwind-css/", platform: "GeeksforGeeks" },
  "Angular": { url: "https://www.geeksforgeeks.org/angularjs-tutorial/", platform: "GeeksforGeeks" },
  "Vue": { url: "https://www.geeksforgeeks.org/vue-js/", platform: "GeeksforGeeks" },
};

const ALL_SKILLS = [
  "Python","Java","JavaScript","C++","SQL","HTML","CSS","React","Node.js",
  "Machine Learning","TensorFlow","PyTorch","NumPy","Pandas","MongoDB",
  "Docker","Kubernetes","AWS","Git","Linux","REST APIs","Spring Boot",
  "TypeScript","Figma","Tableau","Power BI","Excel","CI/CD","Django",
  "Flask","Deep Learning","AI","GitHub","MySQL","Bootstrap","Tailwind",
  "Angular","Vue","Statistics","Firebase"
];

const STATUS_CONFIG = {
  eligible: {
    label: "Eligible ✅",
    badgeClass: "badge-eligible",
    barClass: "green",
    cardClass: "eligible",
  },
  partial: {
    label: "Partial ⚡",
    badgeClass: "badge-partial",
    barClass: "amber",
    cardClass: "partial",
  },
  not_eligible: {
    label: "Not Eligible",
    badgeClass: "badge-ineligible",
    barClass: "gray",
    cardClass: "ineligible",
  },
};

export default function Jobs() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(user?.branch || "");
  const [cgpa, setCgpa] = useState(user?.cgpa || "");
  const [backlogs, setBacklogs] = useState(user?.backlogs ?? 0);
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [customSkill, setCustomSkill] = useState("");
  const [results, setResults] = useState(null);
  const [applying, setApplying] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [checkingId, setCheckingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchJobs(); }, []);

  const MOCK_JOBS = [
    {
      _id: "demo1", title: "Software Engineer", company: "Google", location: "Hyderabad",
      jobType: "Full-time", salaryPackage: 18, minCGPA: 7.5, maxBacklogs: 0,
      allowedBranches: ["CSE", "IT", "AIDS", "AIML", "DS"],
      requiredSkills: ["Python", "React", "Node.js", "MongoDB", "Git"],
      lastDateToApply: new Date(Date.now() + 20 * 86400000).toISOString(),
      driveType: "On-campus", selectionRounds: ["Aptitude", "Technical", "HR"],
      description: "Join Google's Hyderabad office as a full-stack software engineer.",
      applicants: [{}, {}, {}, {}, {}],
    },
    {
      _id: "demo2", title: "Data Scientist", company: "Microsoft", location: "Bangalore",
      jobType: "Full-time", salaryPackage: 22, minCGPA: 8.0, maxBacklogs: 0,
      allowedBranches: ["CSE", "DS", "AIDS", "AI"],
      requiredSkills: ["Python", "Machine Learning", "NumPy", "Pandas", "SQL"],
      lastDateToApply: new Date(Date.now() + 14 * 86400000).toISOString(),
      driveType: "On-campus", selectionRounds: ["Online test", "Technical", "HR"],
      description: "Work on data-driven AI models powering Microsoft's cloud services.",
      applicants: [{}, {}, {}],
    },
    {
      _id: "demo3", title: "Frontend Developer", company: "Swiggy", location: "Pune",
      jobType: "Full-time", salaryPackage: 12, minCGPA: 7.0, maxBacklogs: 1,
      allowedBranches: ["CSE", "IT", "ECE", "AIML"],
      requiredSkills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
      lastDateToApply: new Date(Date.now() + 10 * 86400000).toISOString(),
      driveType: "Off-campus", selectionRounds: ["Coding round", "Technical", "HR"],
      description: "Build the next-gen web ordering experience for millions of users.",
      applicants: [{}, {}, {}, {}, {}, {}, {}],
    },
    {
      _id: "demo4", title: "ML Engineer", company: "Amazon", location: "Chennai",
      jobType: "Full-time", salaryPackage: 25, minCGPA: 8.5, maxBacklogs: 0,
      allowedBranches: ["CSE", "DS", "AIDS"],
      requiredSkills: ["Python", "TensorFlow", "Deep Learning", "AWS", "Docker"],
      lastDateToApply: new Date(Date.now() + 30 * 86400000).toISOString(),
      driveType: "On-campus", selectionRounds: ["Aptitude", "Coding round", "Technical", "HR"],
      description: "Design and deploy ML models for Amazon's recommendation systems.",
      applicants: [{}, {}],
    },
    {
      _id: "demo5", title: "Backend Intern", company: "Zepto", location: "Mumbai",
      jobType: "Internship", salaryPackage: 3, minCGPA: 6.5, maxBacklogs: 2,
      allowedBranches: ["CSE", "IT", "ECE", "MECH", "CIVIL", "DS"],
      requiredSkills: ["Node.js", "MongoDB", "REST APIs", "Git"],
      lastDateToApply: new Date(Date.now() + 7 * 86400000).toISOString(),
      driveType: "Off-campus", selectionRounds: ["Technical", "HR"],
      description: "6-month backend internship with potential pre-placement offer.",
      applicants: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    },
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs/all");
      setJobs(res.data || []);
    } catch (err) {
      console.warn("API unavailable — using demo data.");
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };


  const toggleSkill = async (skill) => {
    const newSkills = selectedSkills.includes(skill) ? selectedSkills.filter(s => s !== skill) : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
    const updatedUser = { ...user, skills: newSkills };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    try { await API.put("/jobs/update-profile", { skills: newSkills }); } catch (e) {}
  };

  const addCustomSkill = async () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      const newSkills = [...selectedSkills, customSkill.trim()];
      setSelectedSkills(newSkills);
      setCustomSkill("");
      const updatedUser = { ...user, skills: newSkills };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      try { await API.put("/jobs/update-profile", { skills: newSkills }); } catch (e) {}
    }
  };

  const checkEligibility = async () => {
    if (!branch) { alert("Please enter your branch first."); return; }
    if (!cgpa) { alert("Please enter your CGPA first."); return; }

    const updatedUser = { ...user, branch, cgpa, backlogs, skills: selectedSkills };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    try { await API.put("/jobs/update-profile", { branch, cgpa, backlogs, skills: selectedSkills }); } catch (e) {}
    const cgpaVal = parseFloat(cgpa);
    const backlogVal = parseInt(backlogs) || 0;

    const res = jobs.map(job => {
      const reasons = [];

      const allowedBranches = (job.allowedBranches || []).map(b => b.toLowerCase().trim());
      const userBranch = branch.toLowerCase().trim();
      const branchOk = allowedBranches.length === 0 || allowedBranches.includes(userBranch);
      if (!branchOk) {
        reasons.push(`Branch "${branch}" not eligible (needs: ${(job.allowedBranches || []).join(", ")})`);
      }

      const minCGPA = parseFloat(job.minCGPA || 0);
      const cgpaOk = cgpaVal >= minCGPA;
      if (!cgpaOk) {
        reasons.push(`CGPA ${cgpaVal} below required ${minCGPA}`);
      }

      const maxBacklogs = parseInt(job.maxBacklogs ?? 0);
      const backlogOk = backlogVal <= maxBacklogs;
      if (!backlogOk) {
        reasons.push(`${backlogVal} backlog(s) — job requires max ${maxBacklogs}`);
      }

      const requiredSkills = job.requiredSkills || [];
      const missingSkills = requiredSkills.filter(
        s => !selectedSkills.map(sk => sk.toLowerCase().trim()).includes(s.toLowerCase().trim())
      );
      const haveSkills = requiredSkills.filter(
        s => selectedSkills.map(sk => sk.toLowerCase().trim()).includes(s.toLowerCase().trim())
      );
      if (missingSkills.length > 0) reasons.push("Missing required skills");

      const pct = requiredSkills.length > 0 ? Math.round((haveSkills.length / requiredSkills.length) * 100) : 100;

      let status = "not_eligible";
      if (branchOk && cgpaOk && backlogOk) {
        if (missingSkills.length === 0) {
          status = "eligible";
        } else if (pct >= 50 && missingSkills.length <= 2) {
          status = "partial";
        }
      }

      return { ...job, status, reasons, pct, missingSkills };
    });

    res.sort((a, b) => {
      const order = { eligible: 0, partial: 1, not_eligible: 2 };
      return order[a.status] - order[b.status];
    });

    setResults(res);
    setTimeout(() => {
      document.getElementById("eligibility-results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const applyToJob = async (job) => {
    setApplying(job._id);

    try {
      const res = await API.post(`/jobs/apply/${job._id}`);
      setAppliedJobs(prev => new Set([...prev, job._id]));
      alert(`Applied successfully! Match: ${res.data.matchPercentage}% 🎉`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply. Try again.");
    } finally {
      setApplying(null);
    }
  };

  const checkSingleEligibility = (job) => {
    alert(
      `Eligibility Result:\n` +
      `✅ Eligible: ${job.status === "eligible" ? "Yes" : "No"}\n` +
      `📊 Match: ${job.pct}%\n` +
      `🎓 CGPA OK: ${parseFloat(cgpa) >= parseFloat(job.minCGPA || 0) ? "✅" : "❌"}\n` +
      `🏫 Branch OK: ${(job.allowedBranches || []).length === 0 || (job.allowedBranches || []).map(b => b.toLowerCase().trim()).includes((branch || "").toLowerCase().trim()) ? "✅" : "❌"}\n` +
      `📋 Backlogs OK: ${(parseInt(backlogs) || 0) <= (job.maxBacklogs ?? 0) ? "✅" : "❌"}\n` +
      (job.missingSkills?.length ? `❗ Missing Skills: ${job.missingSkills.join(", ")}` : "")
    );
  };

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-3" />
      <Navbar />

      <div className="content-wrapper">

        {/* ── Page Header ── */}
        <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", margin: "0 0 6px" }}>
            Welcome back, {user?.name} 👋
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Check your eligibility for placement roles below.
          </p>
        </div>

        {/* ── Profile Card ── */}
        <div className="section-card animate-fadeInUp delay-100">
          <h3 style={{ fontWeight: 800, color: "#f1f5f9", marginBottom: 16, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📋</span> Your Profile
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="dark-label">Branch</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="dark-input"
                style={{ cursor: "pointer" }}
              >
                <option value="" disabled>Select your branch</option>
                {["CSE","IT","ECE","EEE","MECH","CIVIL","DS","AIDS","AI","AIML","BCA","MCA","CSD","CSM","CSC"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="dark-label">CGPA</label>
              <input
                type="number" value={cgpa}
                onChange={e => setCgpa(e.target.value)}
                placeholder="e.g. 8.5" step="0.1" min="0" max="10"
                className="dark-input"
              />
            </div>
          </div>
          <div>
            <label className="dark-label">Active Backlogs</label>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
              <button type="button" onClick={() => setBacklogs(Math.max(0, backlogs - 1))} className="stepper-btn">−</button>
              <span style={{
                fontSize: 20, fontWeight: 800,
                color: backlogs > 0 ? "#f87171" : "#f1f5f9",
                minWidth: 28, textAlign: "center", transition: "color 0.25s",
              }}>{backlogs}</span>
              <button type="button" onClick={() => setBacklogs(backlogs + 1)} className="stepper-btn">+</button>
            </div>
          </div>
        </div>

        {/* ── Skills Selector ── */}
        <div className="section-card animate-fadeInUp delay-200">
          <h3 style={{ fontWeight: 800, color: "#f1f5f9", marginBottom: 4, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🧠</span> Your Skills
          </h3>
          <p style={{ color: "#475569", fontSize: 12, marginBottom: 16 }}>
            Select all skills you know. {selectedSkills.length > 0 && (
              <span style={{ color: "#c084fc", fontWeight: 700 }}>{selectedSkills.length} selected</span>
            )}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {[...new Set([...ALL_SKILLS, ...selectedSkills])].map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`skill-badge ${selectedSkills.includes(skill) ? "selected" : "unselected"}`}
              >
                {selectedSkills.includes(skill) ? "✓ " : ""}{skill}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
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

        {/* ── Check Eligibility Button ── */}
        <button
          onClick={checkEligibility}
          disabled={loading}
          className="btn-primary animate-fadeInUp delay-400"
          style={{
            width: "100%", padding: "16px", fontSize: 16,
            borderRadius: 14, marginBottom: 32,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            animation: "glow 3s ease-in-out infinite",
          }}
        >
          {loading ? (
            <><span className="animate-spin" style={{ display: "inline-block", marginRight: 10 }}>⟳</span> Loading jobs...</>
          ) : "🔍 Check My Eligibility"}
        </button>

        {/* ── Results ── */}
        {results !== null && (
          <div id="eligibility-results" className="animate-fadeIn">
            {/* Summary row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { label: "Eligible", count: results.filter(r => r.status === "eligible").length, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
                { label: "Partial", count: results.filter(r => r.status === "partial").length, color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
                { label: "Not Eligible", count: results.filter(r => r.status === "not_eligible").length, color: "#64748b", bg: "rgba(30,42,58,0.8)" },
              ].map(s => (
                <div key={s.label} style={{
                  background: s.bg, border: `1px solid ${s.color}30`,
                  borderRadius: 12, padding: "10px 20px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontWeight: 900, fontSize: 18, color: "#f1f5f9", marginBottom: 16 }}>
              Eligibility Results
            </h3>

            {results.length === 0 && (
              <div className="section-card" style={{ textAlign: "center", padding: "48px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ color: "#64748b" }}>No jobs available right now.</p>
              </div>
            )}

            {results.map((job, idx) => {
              const cfg = STATUS_CONFIG[job.status];
              const alreadyApplied = appliedJobs.has(job._id);
              return (
                <div
                  key={job._id}
                  className={`job-card ${cfg.cardClass}`}
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>{job.title}</div>
                      <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>@ {job.company} · {job.location}</div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                        {job.jobType} · ₹{job.salaryPackage} LPA · {job.driveType}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={cfg.badgeClass}>{cfg.label}</span>
                      <span style={{ fontWeight: 900, fontSize: 20, color: "#f1f5f9" }}>{job.pct}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-track" style={{ marginBottom: 12 }}>
                    <div
                      className={`progress-fill ${cfg.barClass}`}
                      style={{ width: `${job.pct}%`, animationDelay: `${idx * 0.07 + 0.3}s` }}
                    />
                  </div>

                  {/* Criteria */}
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                    Min CGPA: <strong style={{ color: "#94a3b8" }}>{job.minCGPA ?? "N/A"}</strong>
                    {" · "}Max Backlogs: <strong style={{ color: "#94a3b8" }}>{job.maxBacklogs ?? 0}</strong>
                    {" · "}Branches: <strong style={{ color: "#94a3b8" }}>{(job.allowedBranches || []).join(", ") || "All"}</strong>
                  </div>

                  {/* Missing Skills */}
                  {job.missingSkills?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Missing Skills — click to learn:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {job.missingSkills.map(skill => (
                          <button
                            key={skill}
                            onClick={() => window.open(SKILL_LINKS[skill]?.url || "https://www.geeksforgeeks.org/", "_blank", "noopener,noreferrer")}
                            className="missing-skill-chip"
                          >
                            📚 {skill} → {SKILL_LINKS[skill]?.platform || "Learn"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reasons */}
                  {job.reasons.length > 0 && job.status !== "eligible" && (
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>
                      {job.reasons.filter(r => !r.toLowerCase().includes("skill")).map((r, i) => (
                        <span key={i} style={{ display: "block" }}>• {r}</span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                    <button
                      onClick={() => applyToJob(job)}
                      disabled={applying === job._id || alreadyApplied}
                      className="btn-primary"
                      style={{
                        padding: "9px 22px", fontSize: 13,
                        background: alreadyApplied
                          ? "rgba(168,85,247,0.12)"
                          : applying === job._id
                            ? "rgba(168,85,247,0.2)"
                            : job.status === "eligible"
                              ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                              : "linear-gradient(135deg, #f59e0b, #d97706)",
                        color: alreadyApplied ? "#c084fc" : "white",
                        border: alreadyApplied ? "1px solid rgba(168,85,247,0.3)" : "none",
                        cursor: alreadyApplied ? "default" : "pointer",
                      }}
                    >
                      {alreadyApplied ? "✅ Applied" : applying === job._id ? "Applying..." : job.status === "eligible" ? "Apply Now →" : "⚡ Apply Anyway →"}
                    </button>

                    <button
                      onClick={() => checkSingleEligibility(job)}
                      disabled={checkingId === job._id}
                      className="btn-secondary"
                      style={{ padding: "9px 18px", fontSize: 13 }}
                    >
                      {checkingId === job._id ? "Checking..." : "🎯 Verify Eligibility"}
                    </button>
                  </div>

                  {job.status === "partial" && !alreadyApplied && (
                    <p style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600, marginTop: 10 }}>
                      ⚠ Partial match — you may not meet all criteria.
                    </p>
                  )}
                  {job.status === "not_eligible" && !alreadyApplied && (
                    <p style={{ fontSize: 12, color: "#f87171", fontWeight: 600, marginTop: 10 }}>
                      ⚠ You don't meet the eligibility criteria for this role.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
