const Job = require("../Models/Job");
const User = require("../Models/User");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: "Failed to fetch jobs" }); }
};

const addJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ message: "Job added successfully", job });
  } catch (err) { res.status(500).json({ message: "Failed to add job" }); }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated", job });
  } catch (err) { res.status(500).json({ message: "Failed to update job" }); }
};

const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) { res.status(500).json({ message: "Failed to delete job" }); }
};

const searchJobs = async (req, res) => {
  try {
    const { q } = req.query;
    const jobs = await Job.find({ $or: [{ title: { $regex: q, $options: "i" } }, { company: { $regex: q, $options: "i" } }] });
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: "Search failed" }); }
};

const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const userId = req.user.id;
    const alreadyApplied = job.applicants.some(a => a.userId?.toString() === userId);
    if (alreadyApplied) return res.status(400).json({ message: "Already applied" });
    const user = await User.findById(userId);
    const userSkills = (user?.skills||[]).map(s=>s.toLowerCase().trim());
    const required = (job.requiredSkills||[]).map(s=>s.toLowerCase().trim());
    const matched = required.filter(s=>userSkills.includes(s));
    const matchPercentage = required.length>0 ? Math.round(matched.length/required.length*100) : 100;
    job.applicants.push({ userId, matchPercentage, status: "applied" });
    await job.save();
    res.json({ message: "Applied successfully", matchPercentage });
  } catch (err) { res.status(500).json({ message: "Failed to apply" }); }
};

const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ "applicants.userId": userId });
    const applications = jobs.map(job => {
      const app = job.applicants.find(a => a.userId?.toString() === userId);
      return { jobId: job._id, title: job.title, company: job.company, location: job.location, salaryPackage: job.salaryPackage, matchPercentage: app?.matchPercentage||0, status: app?.status||"applied" };
    });
    res.json({ applications });
  } catch (err) { res.status(500).json({ message: "Failed to fetch applications" }); }
};

const checkEligibilityForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const user = await User.findById(req.user.id);
    const userSkills = (user?.skills||[]).map(s=>s.toLowerCase().trim());
    const required = (job.requiredSkills||[]).map(s=>s.toLowerCase().trim());
    const missing = (job.requiredSkills||[]).filter(s=>!userSkills.includes(s.toLowerCase().trim()));
    const matched = required.filter(s=>userSkills.includes(s));
    const matchPercentage = required.length>0 ? Math.round(matched.length/required.length*100) : 100;
    const branchOk = !job.allowedBranches?.length || job.allowedBranches.map(b=>b.toUpperCase().trim()).includes((user?.branch||"").toUpperCase().trim());
    const cgpaOk = !job.minCGPA || parseFloat(user?.cgpa)>=parseFloat(job.minCGPA);
    const backlogOk = job.maxBacklogs===undefined || parseInt(user?.backlogs||0)<=(job.maxBacklogs||0);
    const eligible = branchOk && cgpaOk && backlogOk && missing.length===0;
    res.json({ eligible, matchPercentage, missing, branchOk, cgpaOk, backlogOk });
  } catch (err) { res.status(500).json({ message: "Eligibility check failed" }); }
};

const updateProfile = async (req, res) => {
  try {
    const { name, rollNo, branch, cgpa, backlogs, skills, phone, address, city, state, country, pincode } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (rollNo !== undefined) updateData.rollNo = rollNo;
    if (branch !== undefined) updateData.branch = branch;
    if (cgpa !== undefined) updateData.cgpa = parseFloat(cgpa);
    if (backlogs !== undefined) updateData.backlogs = parseInt(backlogs) || 0;
    if (skills !== undefined) updateData.skills = skills || [];
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (pincode !== undefined) updateData.pincode = pincode;

    const updated = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    const userData = { _id: updated._id, name: updated.name, email: updated.email, rollNo: updated.rollNo, branch: updated.branch, cgpa: updated.cgpa, backlogs: updated.backlogs, skills: updated.skills, role: updated.role, phone: updated.phone, address: updated.address, city: updated.city, state: updated.state, country: updated.country, pincode: updated.pincode };
    res.json({ message: "Profile updated successfully", user: userData });
  } catch (err) { res.status(500).json({ message: "Failed to update profile" }); }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants.userId", "name email rollNo branch cgpa backlogs skills resumeUrl resumeName");
    if (!job) return res.status(404).json({ message: "Job not found" });
    const applicants = job.applicants.map(a => ({ userId: a.userId?._id, name: a.userId?.name, email: a.userId?.email, rollNo: a.userId?.rollNo, branch: a.userId?.branch, cgpa: a.userId?.cgpa, backlogs: a.userId?.backlogs, skills: a.userId?.skills, resumeUrl: a.userId?.resumeUrl, resumeName: a.userId?.resumeName, matchPercentage: a.matchPercentage, status: a.status }));
    res.json({ applicants });
  } catch (err) { res.status(500).json({ message: "Failed to fetch applicants" }); }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const { status } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const applicant = job.applicants.find(a => a.userId?.toString() === userId);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });
    applicant.status = status;
    await job.save();
    res.json({ message: `Status updated to ${status}` });
  } catch (err) { res.status(500).json({ message: "Failed to update status" }); }
};

module.exports = { addJob, getAllJobs, checkEligibilityForJob, updateJob, deleteJob, getMyApplications, updateProfile, searchJobs, applyJob, updateApplicationStatus, getApplicantsForJob };
