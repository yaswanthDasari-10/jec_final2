import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const ALL_SKILLS = [
  "Python","Java","JavaScript","C++","SQL","HTML","CSS","React","Node.js",
  "Machine Learning","TensorFlow","PyTorch","NumPy","Pandas","MongoDB","Docker",
  "Kubernetes","AWS","Git","Linux","REST APIs","Spring Boot","TypeScript","Figma",
  "Tableau","Power BI","Excel","CI/CD","Django","Flask","Deep Learning","AI",
  "GitHub","MySQL","Bootstrap","Tailwind","Angular","Vue","Statistics","Firebase"
];
const BRANCHES = [
  "CSE","IT","ECE","EEE","MECH","CIVIL","DS","AIDS","AI","AIML",
  "BCA","MCA","MBA","CSD","CSM","CSC","AI & ML","AI & DS"
];
const ROUNDS    = ["Aptitude","Technical","HR","Group Discussion","Coding round","System design","Online test"];
const JOB_TYPES = ["Full-time","Part-time","Internship","Contract"];
const DRIVE_TYPES = ["On-campus","Off-campus","Pool campus"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeTab, setActiveTab]     = useState("overview");
  const [jobs, setJobs]               = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants]   = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Add Job form state
  const [company, setCompany]         = useState("");
  const [title, setTitle]             = useState("");
  const [location, setLocation]       = useState("");
  const [jobType, setJobType]         = useState("Full-time");
  const [salary, setSalary]           = useState("");
  const [lastDate, setLastDate]       = useState("");
  const [driveType, setDriveType]     = useState("On-campus");
  const [minCGPA, setMinCGPA]         = useState(7.0);
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [selBranches, setSelBranches] = useState([]);
  const [mandSkills, setMandSkills]   = useState([]);
  const [customMand, setCustomMand]   = useState("");
  const [selRounds, setSelRounds]     = useState([]);
  const [description, setDescription] = useState("");
  const [addLoading, setAddLoading]   = useState(false);
  const [addSuccess, setAddSuccess]   = useState(false);
  const [addError, setAddError]       = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const MOCK_JOBS = [
    { _id:"d1", title:"Software Engineer", company:"Google", location:"Hyderabad", jobType:"Full-time", salaryPackage:18, minCGPA:7.5, maxBacklogs:0, allowedBranches:["CSE","IT","DS"], requiredSkills:["Python","React","Node.js","MongoDB","Git"], lastDateToApply: new Date(Date.now()+20*86400000).toISOString(), applicants:[{},{},{},{},{}] },
    { _id:"d2", title:"Data Scientist", company:"Microsoft", location:"Bangalore", jobType:"Full-time", salaryPackage:22, minCGPA:8.0, maxBacklogs:0, allowedBranches:["CSE","DS","AIDS"], requiredSkills:["Python","Machine Learning","NumPy","SQL"], lastDateToApply: new Date(Date.now()+14*86400000).toISOString(), applicants:[{},{},{}] },
    { _id:"d3", title:"Frontend Developer", company:"Swiggy", location:"Pune", jobType:"Full-time", salaryPackage:12, minCGPA:7.0, maxBacklogs:1, allowedBranches:["CSE","IT","ECE"], requiredSkills:["React","JavaScript","HTML","CSS"], lastDateToApply: new Date(Date.now()+10*86400000).toISOString(), applicants:[{},{},{},{},{},{},{}] },
    { _id:"d4", title:"ML Engineer", company:"Amazon", location:"Chennai", jobType:"Full-time", salaryPackage:25, minCGPA:8.5, maxBacklogs:0, allowedBranches:["CSE","DS"], requiredSkills:["Python","TensorFlow","Deep Learning","AWS"], lastDateToApply: new Date(Date.now()+30*86400000).toISOString(), applicants:[{},{}] },
    { _id:"d5", title:"Backend Intern", company:"Zepto", location:"Mumbai", jobType:"Internship", salaryPackage:3, minCGPA:6.5, maxBacklogs:2, allowedBranches:["CSE","IT","ECE","MECH"], requiredSkills:["Node.js","MongoDB","REST APIs"], lastDateToApply: new Date(Date.now()+7*86400000).toISOString(), applicants:[{},{},{},{},{},{},{},{},{},{}] },
  ];
  const MOCK_APPLICANTS = [
    { userId:"u1", name:"Arjun Mehta",  email:"arjun@abc.com",  rollNo:"24131A0501", branch:"CSE", cgpa:8.7, backlogs:0, matchPercentage:92, status:"Shortlisted" },
    { userId:"u2", name:"Priya Sharma", email:"priya@abc.com",  rollNo:"24131A0502", branch:"IT",  cgpa:7.9, backlogs:0, matchPercentage:74, status:"Under Review" },
    { userId:"u3", name:"Rahul Verma",  email:"rahul@abc.com",  rollNo:"24131A0503", branch:"CSE", cgpa:6.8, backlogs:1, matchPercentage:58, status:"Rejected" },
    { userId:"u4", name:"Sneha Reddy",  email:"sneha@abc.com",  rollNo:"24131A0504", branch:"DS",  cgpa:9.1, backlogs:0, matchPercentage:96, status:"Shortlisted" },
    { userId:"u5", name:"Kiran Babu",   email:"kiran@abc.com",  rollNo:"24131A0505", branch:"AIDS",cgpa:7.3, backlogs:0, matchPercentage:67, status:"Under Review" },
  ];

  const fetchJobs = async () => {
    try { setJobsLoading(true); const res = await API.get("/jobs/all"); setJobs(res.data || []); }
    catch { console.warn("API offline — demo mode"); setJobs(MOCK_JOBS); }
    finally { setJobsLoading(false); }
  };

  const fetchApplicants = async (job) => {
    setSelectedJob(job); setActiveTab("applicants"); setAppsLoading(true);
    try {
      const res = await API.get(`/jobs/applicants/${job._id}`);
      setApplicants(res.data.applicants || []);
    }
    catch { console.warn("API offline — demo applicants"); setApplicants(MOCK_APPLICANTS); }
    finally { setAppsLoading(false); }
  };

  const updateStatus = async (jobId, userId, status) => {
    try {
      await API.put(`/jobs/application-status/${jobId}/${userId}`, { status });
      setApplicants(prev => prev.map(a => (a.userId === userId || a._id === userId) ? { ...a, status } : a));
    } catch { alert("Failed to update status"); }
  };

  const deleteJob = async (jobId) => {
    try { await API.delete(`/jobs/delete/${jobId}`); setJobs(prev => prev.filter(j => j._id !== jobId)); setConfirmRemoveId(null); }
    catch { alert("Failed to delete job"); }
  };

  const addJob = async () => {
    setAddError("");
    if (!company || !title || !location || !salary || !lastDate) { setAddError("Please fill all required fields."); return; }
    if (mandSkills.length === 0) { setAddError("Add at least one required skill."); return; }
    if (selBranches.length === 0) { setAddError("Select at least one branch."); return; }
    setAddLoading(true);
    try {
      await API.post("/jobs/add", {
        title, company, location, jobType,
        salaryPackage: parseFloat(salary), requiredSkills: mandSkills,
        minCGPA: parseFloat(minCGPA), allowedBranches: selBranches,
        lastDateToApply: lastDate, driveType, selectionRounds: selRounds,
        description, maxBacklogs: parseInt(maxBacklogs),
      });
      setAddSuccess(true); setTimeout(() => setAddSuccess(false), 3000);
      setCompany(""); setTitle(""); setLocation(""); setSalary(""); setLastDate("");
      setMandSkills([]); setSelBranches([]); setSelRounds([]); setDescription("");
      setMinCGPA(7.0); setMaxBacklogs(0); fetchJobs(); setActiveTab("overview");
    } catch (err) { setAddError(err.response?.data?.message || "Failed to add job"); }
    finally { setAddLoading(false); }
  };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };

  const toggleArr = (arr, setArr, val) =>
    setArr(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  const filteredApps = applicants.filter(a => {
    const name = (a.name || a.studentName || "").toLowerCase();
    return name.includes(search.toLowerCase()) &&
      (filterStatus === "All" || (a.status || "").toLowerCase() === filterStatus.toLowerCase());
  });

  const TABS = [
    { key: "overview", label: "📊 Overview" },
    ...(activeTab === "applicants" && selectedJob ? [{ key: "applicants", label: "👥 Applicants" }] : []),
  ];

  const SkillPill = ({ label, active, onClick }) => (
    <button onClick={onClick} type="button"
      className={`skill-badge ${active ? "selected" : "unselected"}`}>
      {active ? "✓ " : ""}{label}
    </button>
  );

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />
      <div className="bg-orb bg-orb-2" />
      <AdminNavbar />

      {/* ── Stats Banner ── */}
      <div style={{
        background: "rgba(13,20,38,0.8)", borderBottom: "1px solid rgba(99,179,237,0.08)",
        padding: "16px 32px",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div className="animate-fadeInUp">
            <h2 style={{ fontWeight: 900, fontSize: 20, color: "#f1f5f9", margin: 0 }}>Admin Dashboard 👨‍💼</h2>
            <p style={{ color: "#475569", fontSize: 13, margin: "2px 0 0" }}>Placement Cell — EligiTrack</p>
          </div>
          <div className="animate-fadeInUp delay-100" style={{ display: "flex", gap: 12 }}>
            {[
              { n: jobs.length, l: "Total Jobs", c: "#c084fc" },
              { n: jobs.reduce((s, j) => s + (j.applicants?.length || 0), 0), l: "Applications", c: "#fcd34d" },
              { n: jobs.filter(j => new Date(j.lastDateToApply) >= new Date()).length, l: "Active", c: "#4ade80" },
            ].map(s => (
              <div key={s.l} className="stat-card" style={{ minWidth: 80, padding: "10px 18px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 24px 60px" }}>

        {/* ── Tab Bar ── */}
        <div className="animate-fadeInUp" style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                padding: "9px 20px", border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                transition: "all 0.25s",
                background: activeTab === t.key
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "rgba(17,24,39,0.8)",
                color: activeTab === t.key ? "white" : "#64748b",
                boxShadow: activeTab === t.key ? "0 4px 15px rgba(245,158,11,0.3)" : "none",
                border: activeTab !== t.key ? "1px solid rgba(99,179,237,0.1)" : "none",
              }}
            >{t.label}</button>
          ))}
          <button onClick={logout} className="btn-danger" style={{ marginLeft: "auto", padding: "9px 18px", fontSize: 13 }}>
            🚪 Logout
          </button>
        </div>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <div className="animate-fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h3 style={{ fontWeight: 900, fontSize: 18, color: "#f1f5f9", margin: 0 }}>All Job Listings</h3>
              <button onClick={() => navigate("/admin/add-job")} className="btn-primary" style={{ padding: "9px 22px", fontSize: 13 }}>
                ➕ Add New Job
              </button>
            </div>

            {jobsLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[1,2,3].map(i => (
                  <div key={i} className="section-card" style={{ padding: 24 }}>
                    <div className="skeleton" style={{ height: 18, width: "40%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: "60%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 13, width: "35%" }} />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="section-card" style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>No jobs yet</h3>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Add your first job posting to get started.</p>
                <button onClick={() => navigate("/admin/add-job")} className="btn-primary">➕ Add Job →</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {jobs.map((job, idx) => {
                  const isExpired = new Date(job.lastDateToApply) < new Date();
                  return (
                    <div key={job._id} className="section-card animate-fadeInUp" style={{ animationDelay: `${idx * 0.06}s`, padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9", margin: 0 }}>{job.title}</h3>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999,
                              background: isExpired ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
                              border: `1px solid ${isExpired ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                              color: isExpired ? "#f87171" : "#4ade80",
                            }}>{isExpired ? "Expired" : "Active"}</span>
                          </div>
                          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 10 }}>
                            🏢 {job.company} &nbsp;·&nbsp; 📍 {job.location} &nbsp;·&nbsp; 💰 ₹{job.salaryPackage} LPA
                            {job.lastDateToApply && <span> &nbsp;·&nbsp; 📅 {new Date(job.lastDateToApply).toLocaleDateString()}</span>}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                            {(job.requiredSkills || []).slice(0, 6).map(s => (
                              <span key={s} style={{
                                background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)",
                                color: "#c084fc", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                              }}>{s}</span>
                            ))}
                            {(job.requiredSkills || []).length > 6 && (
                              <span style={{ color: "#475569", fontSize: 11 }}>+{job.requiredSkills.length - 6} more</span>
                            )}
                          </div>
                          <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
                            Min CGPA: {job.minCGPA} &nbsp;·&nbsp; Max Backlogs: {job.maxBacklogs ?? 0} &nbsp;·&nbsp;
                            Branches: {(job.allowedBranches || []).join(", ") || "All"}
                          </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 24, fontWeight: 900, color: "#c084fc" }}>{job.applicants?.length || 0}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>Applied</div>
                          </div>
                          <button onClick={() => fetchApplicants(job)} className="btn-primary" style={{ padding: "8px 18px", fontSize: 12 }}>
                            👥 View Applicants
                          </button>
                          {confirmRemoveId === job._id ? (
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: "#f87171", fontWeight: 700 }}>Sure?</span>
                              <button onClick={() => deleteJob(job._id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "5px 12px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Yes</button>
                              <button onClick={() => setConfirmRemoveId(null)} style={{ background: "rgba(30,42,58,0.8)", color: "#94a3b8", border: "1px solid rgba(99,179,237,0.12)", padding: "5px 12px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>No</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmRemoveId(job._id)} className="btn-danger" style={{ padding: "7px 14px", fontSize: 12 }}>🗑️ Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}



        {/* ══ APPLICANTS ══ */}
        {activeTab === "applicants" && selectedJob && (
          <div className="animate-fadeIn">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <button onClick={() => setActiveTab("overview")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 8, padding: 0 }}>← Back to Jobs</button>
                <h3 style={{ fontWeight: 900, fontSize: 18, color: "#f1f5f9", margin: 0 }}>{selectedJob.title} — {selectedJob.company}</h3>
                <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>{applicants.length} applicant{applicants.length !== 1 ? "s" : ""}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input className="dark-input" style={{ width: 200 }} placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="dark-input" style={{ width: 160, cursor: "pointer" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option>All</option><option>Under Review</option><option>Shortlisted</option><option>Rejected</option>
                </select>
              </div>
            </div>

            {appsLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3].map(i => <div key={i} className="section-card" style={{ padding: 20 }}><div className="skeleton" style={{ height: 60 }} /></div>)}
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="section-card" style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>👥</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>No applicants found</h3>
                <p style={{ color: "#64748b" }}>{search || filterStatus !== "All" ? "Try adjusting filters." : "No one has applied yet."}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredApps.map((app, i) => {
                  const uid = app.userId || app._id;
                  const statusKey = app.status || "Under Review";
                  const statusColor = statusKey === "Shortlisted" ? "#4ade80" : statusKey === "Rejected" ? "#f87171" : "#fbbf24";
                  return (
                    <div key={uid || i} className="section-card animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, padding: "18px 24px", borderLeft: `3px solid ${statusColor}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, flexShrink: 0 }}>
                            {(app.name || app.studentName || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9" }}>{app.name || app.studentName || "Student"}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{app.email || "—"} · Roll: {app.rollNo || "—"} · {app.branch || "—"}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>CGPA: <strong style={{ color: "#f1f5f9" }}>{app.cgpa || "—"}</strong> · Backlogs: <strong style={{ color: "#f1f5f9" }}>{app.backlogs ?? "—"}</strong></div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          {app.matchPercentage !== undefined && (
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 20, fontWeight: 900, color: app.matchPercentage >= 80 ? "#4ade80" : app.matchPercentage >= 50 ? "#fbbf24" : "#f87171" }}>{app.matchPercentage}%</div>
                              <div style={{ fontSize: 11, color: "#64748b" }}>Match</div>
                            </div>
                          )}
                          <span style={{ background: statusKey === "Shortlisted" ? "rgba(34,197,94,0.12)" : statusKey === "Rejected" ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)", border: `1px solid ${statusColor}44`, color: statusColor, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                            {statusKey}
                          </span>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => updateStatus(selectedJob._id, uid, "Shortlisted")} disabled={statusKey === "Shortlisted"} className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12, opacity: statusKey === "Shortlisted" ? 0.5 : 1 }}>✓ Shortlist</button>
                            <button onClick={() => updateStatus(selectedJob._id, uid, "Rejected")} disabled={statusKey === "Rejected"} className="btn-danger" style={{ padding: "6px 14px", fontSize: 12, opacity: statusKey === "Rejected" ? 0.5 : 1 }}>✗ Reject</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}