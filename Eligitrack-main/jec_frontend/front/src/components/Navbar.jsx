import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { label: "Jobs", path: "/jobs", icon: "💼" },
    { label: "Applications", path: "/applications", icon: "📋" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <nav className="dark-nav">
      <div className="nav-logo" onClick={() => navigate("/jobs")}>
        <div className="nav-logo-icon">ET</div>
        <span style={{ fontWeight: 800, fontSize: 17, color: "#f1f0ff" }}>EligiTrack</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navItems.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)} className={`nav-link${location.pathname === item.path ? " active" : ""}`}>
            <span style={{ marginRight: 4 }}>{item.icon}</span>{item.label}
          </button>
        ))}
        {user?.role === "admin" && (
          <button onClick={() => navigate("/admin")} className="nav-link">⚙️ Admin</button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div>
              <div style={{ color: "#f1f0ff", fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{user?.name || "User"}</div>
              <div style={{ fontSize: 10, color: "#c084fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Student</div>
            </div>
          </div>
        )}
        <button onClick={logout} className="btn-danger">🚪 Logout</button>
      </div>
    </nav>
  );
}