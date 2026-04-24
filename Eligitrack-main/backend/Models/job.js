const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: {
    type: String,
    enum: ["Full-time", "Internship", "Part-time"],
    required: true,
  },
  salaryPackage: { type: Number, required: true },
  requiredSkills: { type: [String], required: true },
  minCGPA: { type: Number, required: true },

  // ✅ FIX: allowedBranches as flat [String] array (was nested incorrectly)
  allowedBranches: { type: [String], default: [] },

  // ✅ FIX: Added maxBacklogs so eligibility check works
  maxBacklogs: { type: Number, default: 0 },

  experienceRequired: { type: Number, default: 0 },
  lastDateToApply: { type: Date, required: true },
  driveType: { type: String, enum: ["On-campus", "Off-campus"] },
  selectionRounds: { type: [String], default: [] },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  applicantsCount: { type: Number, default: 0 },
  description: { type: String },

  applicants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      matchPercentage: Number,
      status: { type: String, default: "applied" },
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);