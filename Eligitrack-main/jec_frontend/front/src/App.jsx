import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import AdminDashboard from "./pages/AdminDashboard";
import ManageJobs from "./pages/ManageJobs";
import AddJob from "./pages/AddJob";
import Applicants from "./pages/Applicants";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/applications" element={<Applications />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-job" element={<AddJob />} />
        <Route path="/admin/jobs" element={<ManageJobs/>}/>
        <Route path="/admin/applicants/:jobId" element={<Applicants />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;