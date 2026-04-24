import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

const STATUS_CONFIG = {
  Shortlisted:    { bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.3)",  text:"#4ade80",  label:"Shortlisted ✅" },
  Rejected:       { bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.3)",  text:"#f87171",  label:"Rejected ✗"    },
  "Under Review": { bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.25)",text:"#fbbf24",  label:"Under Review ⏳" },
  selected:       { bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.3)",  text:"#4ade80",  label:"Selected ✅"   },
  rejected:       { bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.3)",  text:"#f87171",  label:"Rejected ✗"    },
};

const MOCK_APPLICANTS = [
  { userId:"u1", name:"Arjun Mehta",  email:"arjun@abc.com",  rollNo:"24131A0501", branch:"CSE",  cgpa:8.7, backlogs:0, matchPercentage:92, status:"Shortlisted",  skills:["Python","React","Node.js","MongoDB","Git"],     resumeUrl: null },
  { userId:"u2", name:"Priya Sharma", email:"priya@abc.com",  rollNo:"24131A0502", branch:"IT",   cgpa:7.9, backlogs:0, matchPercentage:74, status:"Under Review", skills:["JavaScript","HTML","CSS","Git"],                resumeUrl: null },
  { userId:"u3", name:"Rahul Verma",  email:"rahul@abc.com",  rollNo:"24131A0503", branch:"CSE",  cgpa:6.8, backlogs:1, matchPercentage:58, status:"Rejected",     skills:["Python","Machine Learning"],                   resumeUrl: null },
  { userId:"u4", name:"Sneha Reddy",  email:"sneha@abc.com",  rollNo:"24131A0504", branch:"DS",   cgpa:9.1, backlogs:0, matchPercentage:96, status:"Shortlisted",  skills:["Python","TensorFlow","NumPy","Pandas","AWS"],   resumeUrl: null },
  { userId:"u5", name:"Kiran Babu",   email:"kiran@abc.com",  rollNo:"24131A0505", branch:"AIDS", cgpa:7.3, backlogs:0, matchPercentage:67, status:"Under Review", skills:["React","Node.js","MongoDB","Docker"],           resumeUrl: null },
  { userId:"u6", name:"Divya Sai",    email:"divya@abc.com",  rollNo:"24131A0506", branch:"ECE",  cgpa:8.2, backlogs:0, matchPercentage:80, status:"Under Review", skills:["Python","SQL","Tableau","Power BI"],            resumeUrl: null },
];

export default function Applicants() {
  const { jobId } = useParams();
  const navigate   = useNavigate();

  const [applicants, setApplicants]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(null);

  // ── Filters ──
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [minMatch, setMinMatch]         = useState(0);
  const [minCGPA, setMinCGPA]           = useState(0);
  const [maxBacklogs, setMaxBacklogs]   = useState(10);
  const [sortBy, setSortBy]             = useState("match_desc");
  const [showFilters, setShowFilters]   = useState(false);

  useEffect(() => { fetchApplicants(); }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/jobs/applicants/${jobId}`);
      const data = res.data.applicants || res.data || [];
      setApplicants(data.length ? data : MOCK_APPLICANTS);
    } catch {
      setApplicants(MOCK_APPLICANTS);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId, status) => {
    setUpdating(userId + status);
    try {
      await API.put(`/jobs/application-status/${jobId}/${userId}`, { status });
      setApplicants(prev => prev.map(a => (a.userId === userId || a._id === userId) ? { ...a, status } : a));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  // Unique branches for dropdown
  const branches = ["All", ...new Set(applicants.map(a => a.branch).filter(Boolean))];

  // ── Filter + Sort ──
  const filtered = applicants
    .filter(a => {
      const name = (a.name || a.studentName || "").toLowerCase();
      const status = a.status || "Under Review";
      const matchOk   = (a.matchPercentage || 0) >= minMatch;
      const cgpaOk    = (a.cgpa || 0) >= minCGPA;
      const backlogOk = (a.backlogs ?? 0) <= maxBacklogs;
      const statusOk  = filterStatus === "All" || status === filterStatus;
      const branchOk  = filterBranch === "All" || (a.branch || "") === filterBranch;
      const searchOk  = name.includes(search.toLowerCase()) || (a.rollNo || "").toLowerCase().includes(search.toLowerCase());
      return matchOk && cgpaOk && backlogOk && statusOk && branchOk && searchOk;
    })
    .sort((a, b) => {
      if (sortBy === "match_desc")  return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      if (sortBy === "match_asc")   return (a.matchPercentage || 0) - (b.matchPercentage || 0);
      if (sortBy === "cgpa_desc")   return (b.cgpa || 0) - (a.cgpa || 0);
      if (sortBy === "cgpa_asc")    return (a.cgpa || 0) - (b.cgpa || 0);
      if (sortBy === "name_asc")    return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "backlogs_asc") return (a.backlogs || 0) - (b.backlogs || 0);
      return 0;
    });

  const stats = {
    total:       applicants.length,
    shortlisted: applicants.filter(a => a.status === "Shortlisted" || a.status === "selected").length,
    rejected:    applicants.filter(a => a.status === "Rejected"    || a.status === "rejected").length,
    avgMatch:    applicants.length ? Math.round(applicants.reduce((s, a) => s + (a.matchPercentage || 0), 0) / applicants.length) : 0,
  };

  const filterCount = [
    filterStatus !== "All", filterBranch !== "All",
    minMatch > 0, minCGPA > 0, maxBacklogs < 10,
  ].filter(Boolean).length;

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
      <div className="bg-orb bg-orb-2" />
      <AdminNavbar />

      {/* ── Resume Modal ── */}

      <div className="content-wrapper" style={{ maxWidth: 1100 }}>
        {/* Back + Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: 24 }}>
          <button onClick={() => navigate("/admin/jobs")} style={{ background: "none", border: "none", color: "#5f5c7a", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#c084fc"} onMouseLeave={e => e.target.style.color = "#5f5c7a"}>
            ← Back to Manage Jobs
          </button>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f0ff", margin: "0 0 4px" }}>👥 Applicants</h2>
          <p style={{ color: "#5f5c7a", fontSize: 14 }}>
            Job ID: <span style={{ color: "#c084fc" }}>{jobId}</span> &nbsp;·&nbsp; {applicants.length} total applicant{applicants.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Stats Row */}
        <div className="animate-fadeInUp delay-100" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label:"Total",       value: stats.total,       color:"#c084fc", bg:"rgba(168,85,247,0.1)",  border:"rgba(168,85,247,0.25)" },
            { label:"Shortlisted", value: stats.shortlisted, color:"#4ade80", bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.25)"  },
            { label:"Rejected",    value: stats.rejected,    color:"#f87171", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.25)"  },
            { label:"Avg Match",   value:`${stats.avgMatch}%`,color:"#fbbf24",bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.25)" },
            { label:"Showing",     value: filtered.length,   color:"#c084fc", bg:"rgba(168,85,247,0.08)", border:"rgba(168,85,247,0.15)" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "12px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flex: 1, minWidth: 90 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 12, color: "#5f5c7a" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="section-card animate-fadeInUp delay-200" style={{ padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: showFilters ? 20 : 0 }}>
            {/* Search */}
            <div style={{ flex: 2, minWidth: 200, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
              <input className="dark-input" style={{ paddingLeft: 40 }} placeholder="Search by name or roll no..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {/* Sort */}
            <div style={{ flex: 1, minWidth: 170 }}>
              <select className="dark-input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="match_desc">↓ Match % (High → Low)</option>
                <option value="match_asc" >↑ Match % (Low → High)</option>
                <option value="cgpa_desc" >↓ CGPA    (High → Low)</option>
                <option value="cgpa_asc"  >↑ CGPA    (Low → High)</option>
                <option value="name_asc"  >A → Z by Name</option>
                <option value="backlogs_asc">Backlogs (Low → High)</option>
              </select>
            </div>
            {/* Toggle filters */}
            <button onClick={() => setShowFilters(!showFilters)} style={{
              padding: "10px 18px", border: `1.5px solid ${filterCount > 0 ? "#a855f7" : "rgba(168,85,247,0.25)"}`,
              background: filterCount > 0 ? "rgba(168,85,247,0.12)" : "transparent",
              color: filterCount > 0 ? "#c084fc" : "#a09aba",
              borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
            }}>
              ⚙️ Filters {filterCount > 0 && <span style={{ background: "#a855f7", color: "white", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{filterCount}</span>}
            </button>
            {filterCount > 0 && (
              <button onClick={() => { setFilterStatus("All"); setFilterBranch("All"); setMinMatch(0); setMinCGPA(0); setMaxBacklogs(10); }}
                className="btn-danger" style={{ padding: "10px 14px", fontSize: 12 }}>✕ Clear</button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div style={{ borderTop: "1px solid rgba(168,85,247,0.1)", paddingTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <div>
                <label className="dark-label">Status</label>
                <select className="dark-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ cursor: "pointer" }}>
                  <option value="All">All Status</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="dark-label">Branch</label>
                <select className="dark-input" value={filterBranch} onChange={e => setFilterBranch(e.target.value)} style={{ cursor: "pointer" }}>
                  {branches.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="dark-label">Min Match % — <span style={{ color: "#c084fc", fontWeight: 900 }}>{minMatch}%</span></label>
                <input type="range" min={0} max={100} step={5} value={minMatch} onChange={e => setMinMatch(+e.target.value)} style={{ width: "100%", marginTop: 8 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5f5c7a" }}><span>0%</span><span>100%</span></div>
              </div>
              <div>
                <label className="dark-label">Min CGPA — <span style={{ color: "#c084fc", fontWeight: 900 }}>{minCGPA}</span></label>
                <input type="range" min={0} max={10} step={0.5} value={minCGPA} onChange={e => setMinCGPA(+e.target.value)} style={{ width: "100%", marginTop: 8 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5f5c7a" }}><span>0</span><span>10</span></div>
              </div>
              <div>
                <label className="dark-label">Max Backlogs — <span style={{ color: "#c084fc", fontWeight: 900 }}>{maxBacklogs === 10 ? "Any" : maxBacklogs}</span></label>
                <input type="range" min={0} max={10} step={1} value={maxBacklogs} onChange={e => setMaxBacklogs(+e.target.value)} style={{ width: "100%", marginTop: 8 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5f5c7a" }}><span>0</span><span>Any</span></div>
              </div>
            </div>
          )}
        </div>

        {/* ── Applicant List ── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="section-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: "60%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="section-card animate-fadeIn" style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f0ff", marginBottom: 8 }}>No applicants match your filters</h3>
            <p style={{ color: "#5f5c7a" }}>Try adjusting the filters or clearing them.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((a, idx) => {
              const uid       = a.userId || a._id;
              const statusKey = a.status || "Under Review";
              const sc        = STATUS_CONFIG[statusKey] || STATUS_CONFIG["Under Review"];
              const matchColor= (a.matchPercentage || 0) >= 80 ? "#4ade80" : (a.matchPercentage || 0) >= 50 ? "#fbbf24" : "#f87171";

              return (
                <div key={uid || idx} className="section-card animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s`, padding: "20px 24px", borderLeft: `3px solid ${sc.text}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>

                    {/* Left: Student Info */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 18, flexShrink: 0, boxShadow: "0 0 0 2px rgba(168,85,247,0.3)" }}>
                        {(a.name || a.studentName || "S").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f0ff", marginBottom: 3 }}>{a.name || a.studentName || "Student"}</div>
                        <div style={{ fontSize: 12, color: "#5f5c7a", marginBottom: 3 }}>
                          📧 {a.email || "—"} &nbsp;·&nbsp; Roll: <strong style={{ color: "#a09aba" }}>{a.rollNo || "—"}</strong> &nbsp;·&nbsp; {a.branch || "—"}
                        </div>
                        <div style={{ fontSize: 12, color: "#5f5c7a", marginBottom: 6 }}>
                          CGPA: <strong style={{ color: (a.cgpa >= 8) ? "#4ade80" : "#f1f0ff" }}>{a.cgpa || "—"}</strong>
                          &nbsp;·&nbsp; Backlogs: <strong style={{ color: a.backlogs > 0 ? "#f87171" : "#4ade80" }}>{a.backlogs ?? "—"}</strong>
                        </div>
                        {/* Skills */}
                        {a.skills?.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {a.skills.slice(0, 5).map(s => (
                              <span key={s} style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc", padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{s}</span>
                            ))}
                            {a.skills.length > 5 && <span style={{ color: "#5f5c7a", fontSize: 11 }}>+{a.skills.length - 5} more</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Match + Status + Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0, flexWrap: "wrap" }}>
                      {/* Match % + bar */}
                      {a.matchPercentage !== undefined && (
                        <div style={{ textAlign: "center", minWidth: 72 }}>
                          <div style={{ fontSize: 22, fontWeight: 900, color: matchColor }}>{a.matchPercentage}%</div>
                          <div style={{ fontSize: 10, color: "#5f5c7a", marginBottom: 4 }}>Match</div>
                          <div className="progress-track" style={{ width: 68 }}>
                            <div className="progress-fill" style={{ width: `${a.matchPercentage}%`, background: `linear-gradient(90deg, ${matchColor}88, ${matchColor})` }} />
                          </div>
                        </div>
                      )}

                      {/* Status badge */}
                      <span style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text, padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {sc.label}
                      </span>



                      {/* Shortlist / Reject */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => updateStatus(uid, "Shortlisted")}
                          disabled={statusKey === "Shortlisted" || statusKey === "selected" || updating === uid + "Shortlisted"}
                          className="btn-secondary" style={{ padding: "7px 14px", fontSize: 12, whiteSpace: "nowrap", opacity: (statusKey === "Shortlisted" || statusKey === "selected") ? 0.5 : 1, cursor: (statusKey === "Shortlisted" || statusKey === "selected") ? "default" : "pointer" }}>
                          ✓ Shortlist
                        </button>
                        <button
                          onClick={() => updateStatus(uid, "Rejected")}
                          disabled={statusKey === "Rejected" || statusKey === "rejected" || updating === uid + "Rejected"}
                          className="btn-danger" style={{ padding: "7px 14px", fontSize: 12, whiteSpace: "nowrap", opacity: (statusKey === "Rejected" || statusKey === "rejected") ? 0.5 : 1, cursor: (statusKey === "Rejected" || statusKey === "rejected") ? "default" : "pointer" }}>
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}