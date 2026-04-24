const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, rollNo, branch, cgpa, backlogs, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, rollNo, branch, cgpa: cgpa ? parseFloat(cgpa) : undefined, backlogs: parseInt(backlogs)||0, email, password: hashed, role: "student" });
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error during signup: " + (err.message || err.toString()) });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "eligitrack_secret", { expiresIn: "7d" });
    const userData = { _id: user._id, name: user.name, email: user.email, rollNo: user.rollNo, branch: user.branch, cgpa: user.cgpa, backlogs: user.backlogs, skills: user.skills||[], role: user.role };
    res.json({ token, user: userData, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login: " + (err.message || err.toString()) });
  }
};

module.exports = { signup, login };
