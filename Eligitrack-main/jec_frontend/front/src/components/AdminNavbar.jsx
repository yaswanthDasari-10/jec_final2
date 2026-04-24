import { NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="dark-nav" style={{ borderBottomColor: "rgba(245,158,11,0.12)" }}>
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate("/admin")}>
        <div className="nav-logo-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 15px rgba(245,158,11,0.4)" }}>ET</div>
        <div>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#f1f0ff" }}>EligiTrack</span>
          <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24", padding: "2px 8px", borderRadius: 999 }}>ADMIN</span>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 4 }}>
        {[
          { to: "/admin",         label: "📊 Dashboard" },
          { to: "/admin/add-job", label: "➕ Add Job"   },
          { to: "/admin/jobs",    label: "💼 Manage Jobs" },
        ].map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === "/admin"} style={({ isActive }) => ({
            padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none", transition: "all 0.25s",
            color: isActive ? "#fbbf24" : "#a09aba",
            background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
          })}>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user?.name && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0a0b14", fontWeight: 900, fontSize: 13,
              boxShadow: "0 0 0 2px rgba(245,158,11,0.3)",
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: "#f1f0ff", fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Admin</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="btn-danger">🚪 Logout</button>
      </div>
    </nav>
  );
}