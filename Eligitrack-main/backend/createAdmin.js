require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    
    const email = "admin@eligitrack.com";
    const existing = await User.findOne({ email });
    
    if (existing) {
      console.log("Admin user already exists");
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const adminUser = new User({
      name: "Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
      branch: "Admin"
    });
    
    await adminUser.save();
    console.log("Admin user created successfully: " + email);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
