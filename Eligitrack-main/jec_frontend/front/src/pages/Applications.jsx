import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const STATUS_COLORS = {
  Applied:      { bg: "rgba(168,85,247,0.1)",   border: "rgba(168,85,247,0.3)",   text: "#c084fc", label: "Applied" },
  Shortlisted:  { bg: "rgba(34,197,94,0.1)",    border: "rgba(34,197,94,0.3)",    text: "#4ade80", label: "Shortlisted ✅" },
  Rejected:     { bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.3)",    text: "#f87171", label: "Rejected ✗" },
  "Under Review":{ bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",   text: "#fbbf24", label: "Under Review ⏳" },
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApplications(); }, []);

  const MOCK_APPS = [
    { jobId: "d1", title: "Software Engineer", company: "Google",       matchPercentage: 92, status: "Shortlisted"   },
    { jobId: "d2", title: "Data Scientist",    company: "Microsoft",    matchPercentage: 74, status: "Under Review"  },
    { jobId: "d3", title: "Frontend Developer",company: "Swiggy",       matchPercentage: 85, status: "Under Review"  },
    { jobId: "d4", title: "Backend Intern",    company: "Zepto",        matchPercentage: 60, status: "Rejected"      },
  ];

  const fetchApplications = async () => {
    try {
      const res = await API.get("/jobs/my-applications");
      setApps(res.data.applications?.length ? res.data.applications : MOCK_APPS);
    } catch (err) {
      console.warn("API unavailable — using demo data.");
      setApps(MOCK_APPS);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page-wrapper" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <Navbar />

      <div className="content-wrapper">
        {/* Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", margin: "0 0 6px" }}>
            📄 My Applications
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Track the status of all your job applications here.
          </p>
        </div>

        {/* Skeleton Loading */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="section-card" style={{ padding: 24 }}>
                <div className="skeleton" style={{ height: 18, width: "70%", marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 14, width: "50%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "35%", marginBottom: 20 }} />
                <div className="skeleton" style={{ height: 32, borderRadius: 999, width: 100 }} />
              </div>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="section-card animate-fadeIn" style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
              No applications yet
            </h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Head over to the Jobs page and check your eligibility to start applying!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {apps.map((app, idx) => {
              const statusKey = app.status || "Under Review";
              const sc = STATUS_COLORS[statusKey] || STATUS_COLORS["Under Review"];
              const matchColor = app.matchPercentage >= 80 ? "#4ade80"
                              : app.matchPercentage >= 50 ? "#fbbf24"
                              : "#f87171";

              return (
                <div
                  key={app.jobId || idx}
                  className="glass-card animate-fadeInUp"
                  style={{ padding: 24, animationDelay: `${idx * 0.08}s` }}
                >
                  {/* Company Icon & Title */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, color: "white", fontWeight: 800,
                    }}>
                      {(app.company || "J").charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9", lineHeight: 1.3 }}>
                        {app.title || "Job Title"}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>
                        {app.company || "Company"}
                      </div>
                    </div>
                  </div>

                  {/* Match Percentage */}
                  {app.matchPercentage !== undefined && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>Match Score</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: matchColor }}>{app.matchPercentage}%</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${app.matchPercentage}%`,
                            background: `linear-gradient(90deg, ${matchColor}88, ${matchColor})`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: sc.bg, border: `1px solid ${sc.border}`,
                    color: sc.text, padding: "6px 14px", borderRadius: 999,
                    fontSize: 12, fontWeight: 700,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.text, flexShrink: 0 }} />
                    {sc.label}
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