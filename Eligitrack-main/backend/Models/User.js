const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
      default: "student",
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value.length >= 3 && value.length <= 30;
        },
        message: "Name must be between 3 and 30 characters",
      },
    },
    rollNo: {
      type: String,
      trim: true,
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pincode: { type: String, trim: true },
    cgpa: {
      type: Number,
      validate: {
        validator: function (value) {
          if (value === undefined || value === null) return true;
          return Number(value) >= 0 && Number(value) <= 10;
        },
        message: "CGPA must be between 0 and 10",
      },
    },
    branch: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value.length >= 2 && value.length <= 50;
        },
        message: "Branch must be between 2 and 50 characters",
      },
    },
    // ✅ FIX: Added missing backlogs field
    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    resumeName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);