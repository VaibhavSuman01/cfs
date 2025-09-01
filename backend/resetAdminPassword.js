const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    resetAdminPassword();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Reset admin password
async function resetAdminPassword() {
  try {
    // Find admin user
    const admin = await User.findOne({ email: "admin@comfinserv.co" });

    if (!admin) {
      console.log("Admin user not found. Creating new admin user...");
      
      const newAdmin = new User({
        name: "Admin User",
        email: "admin@comfinserv.co",
        password: "admin123",
        role: "admin",
        pan: "ADMIN1234A",
        dob: new Date("1990-01-01"),
        mobile: "9999999999",
        aadhaar: "999999999999"
      });

      await newAdmin.save();
      console.log("New admin user created successfully");
    } else {
      console.log("Admin user found. Resetting password...");
      
      // Update password - this will trigger the pre-save middleware to hash it
      admin.password = "admin123";
      await admin.save();
      
      console.log("Admin password reset successfully");
    }

    console.log("Admin credentials:");
    console.log("Email: admin@comfinserv.co");
    console.log("Password: admin123");
    console.log("IMPORTANT: Change these credentials in production!");

    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin password:", error);
    process.exit(1);
  }
}