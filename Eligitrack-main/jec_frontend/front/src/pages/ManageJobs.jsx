import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchJobs(); }, []);

  const MOCK_JOBS = [
    { _id:"d1", title:"Software Engineer", company:"Google", location:"Hyderabad", jobType:"Full-time", salaryPackage:18, minCGPA:7.5, maxBacklogs:0, allowedBranches:["CSE","IT","DS"], requiredSkills:["Python","React","Node.js","MongoDB","Git"], lastDateToApply: new Date(Date.now()+20*86400000).toISOString(), applicants:[{},{},{},{},{}] },
    { _id:"d2", title:"Data Scientist", company:"Microsoft", location:"Bangalore", jobType:"Full-time", salaryPackage:22, minCGPA:8.0, maxBacklogs:0, allowedBranches:["CSE","DS","AIDS"], requiredSkills:["Python","Machine Learning","NumPy","SQL"], lastDateToApply: new Date(Date.now()+14*86400000).toISOString(), applicants:[{},{},{}] },
    { _id:"d3", title:"Frontend Developer", company:"Swiggy", location:"Pune", jobType:"Full-time", salaryPackage:12, minCGPA:7.0, maxBacklogs:1, allowedBranches:["CSE","IT","ECE"], requiredSkills:["React","JavaScript","HTML","CSS"], lastDateToApply: new Date(Date.now()+10*86400000).toISOString(), applicants:[{},{},{},{},{},{},{}] },
    { _id:"d4", title:"ML Engineer", company:"Amazon", location:"Chennai", jobType:"Full-time", salaryPackage:25, minCGPA:8.5, maxBacklogs:0, allowedBranches:["CSE","DS"], requiredSkills:["Python","TensorFlow","Deep Learning","AWS","Docker"], lastDateToApply: new Date(Date.now()+30*86400000).toISOString(), applicants:[{},{}] },
    { _id:"d5", title:"Backend Intern", company:"Zepto", location:"Mumbai", jobType:"Internship", salaryPackage:3, minCGPA:6.5, maxBacklogs:2, allowedBranches:["CSE","IT","ECE","MECH"], requiredSkills:["Node.js","MongoDB","REST APIs","Git"], lastDateToApply: new Date(Date.now()+7*86400000).toISOString(), applicants:[{},{},{},{},{},{},{},{},{},{}] },
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs/all");
      setJobs(res.data || []);
    } catch (err) {
      console.warn("API offline — demo mode");
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };


  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/delete/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      setConfirmId(null);
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const searchJobs = async () => {
    if (!search.trim()) { fetchJobs(); return; }
    try {
      const res = await API.get("/jobs/search", {
        params: { title: search, company: search, location: search },
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = jobs.filter(j =>
    !search.trim() ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }} />
      <div className="bg-orb bg-orb-2" />
      <AdminNavbar />

      <div className="content-wrapper">

        {/* Header */}
        <div className="animate-fadeInUp" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", margin: "0 0 6px" }}>
              💼 Manage Jobs
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-job")}
            className="btn-primary"
            style={{ padding: "10px 22px" }}
          >
            ➕ Add New Job
          </button>
        </div>

        {/* Search Bar */}
        <div className="animate-fadeInUp delay-100 section-card" style={{ padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
              <input
                type="text"
                placeholder="Search by title, company or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchJobs()}
                className="dark-input"
                style={{ paddingLeft: 40 }}
              />
            </div>
            <button onClick={searchJobs} className="btn-primary" style={{ padding: "10px 22px", whiteSpace: "nowrap" }}>
              Search
            </button>
            {search && (
              <button onClick={() => { setSearch(""); fetchJobs(); }} className="btn-secondary" style={{ padding: "10px 16px" }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Job List */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="section-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 18, width: "40%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 14, width: "25%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: "60%" }} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div className="skeleton" style={{ width: 120, height: 36, borderRadius: 8 }} />
                    <div className="skeleton" style={{ width: 80, height: 36, borderRadius: 8 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="section-card animate-fadeIn" style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>No jobs found</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              {search ? "Try a different search term." : "Add your first job posting to get started."}
            </p>
            <button onClick={() => navigate("/admin/add-job")} className="btn-primary">
              ➕ Post a Job
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((job, idx) => {
              const isExpired = new Date(job.lastDateToApply) < new Date();
              return (
                <div
                  key={job._id}
                  className="section-card animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.06}s`, padding: "20px 24px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    {/* Left: Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <h3 style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9", margin: 0 }}>{job.title}</h3>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999,
                          background: isExpired ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
                          border: `1px solid ${isExpired ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                          color: isExpired ? "#f87171" : "#4ade80",
                        }}>
                          {isExpired ? "Expired" : "Active"}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999,
                          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
                          color: "#fcd34d",
                        }}>
                          {job.jobType || "Full-time"}
                        </span>
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>
                        🏢 {job.company}  &nbsp;·&nbsp;  📍 {job.location}  &nbsp;·&nbsp;  💰 ₹{job.salaryPackage} LPA
                        {job.lastDateToApply && <span>  &nbsp;·&nbsp;  📅 {new Date(job.lastDateToApply).toLocaleDateString()}</span>}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {(job.requiredSkills || []).slice(0, 5).map(s => (
                          <span key={s} style={{
                            background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)",
                            color: "#c084fc", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                          }}>{s}</span>
                        ))}
                        {(job.requiredSkills || []).length > 5 && (
                          <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, padding: "2px 10px" }}>
                            +{job.requiredSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#c084fc" }}>{job.applicants?.length || 0}</div>
                        <div style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>Applicants</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => navigate(`/admin/applicants/${job._id}`)}
                          className="btn-secondary"
                          style={{ padding: "7px 16px", fontSize: 12 }}
                        >
                          👥 View
                        </button>
                        {confirmId === job._id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, color: "#f87171", fontWeight: 700 }}>Sure?</span>
                            <button
                              onClick={() => deleteJob(job._id)}
                              style={{
                                background: "#ef4444", color: "white", border: "none",
                                padding: "6px 12px", borderRadius: 8, fontWeight: 700,
                                fontSize: 12, cursor: "pointer",
                              }}
                            >Yes</button>
                            <button
                              onClick={() => setConfirmId(null)}
                              style={{
                                background: "rgba(30,42,58,0.8)", color: "#94a3b8",
                                border: "1px solid rgba(99,179,237,0.12)",
                                padding: "6px 12px", borderRadius: 8, fontWeight: 700,
                                fontSize: 12, cursor: "pointer",
                              }}
                            >No</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(job._id)}
                            className="btn-danger"
                            style={{ padding: "7px 14px", fontSize: 12 }}
                          >
                            🗑️
                          </button>
                        )}
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