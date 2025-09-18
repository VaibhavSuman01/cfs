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
    const adminEmail = process.env.ADMIN_EMAIL || "admin@comfinserv.co";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Admin User";
    
    // Find admin user
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log("Admin user not found. Creating new admin user...");
      
      const newAdmin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin"
      });

      await newAdmin.save();
      console.log("New admin user created successfully");
    } else {
      console.log("Admin user found. Resetting password...");
      
      // Update password - this will trigger the pre-save middleware to hash it
      admin.password = adminPassword;
      await admin.save();
      
      console.log("Admin password reset successfully");
    }

    console.log("Admin credentials:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("IMPORTANT: Change these credentials in production!");

    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin password:", error);
    process.exit(1);
  }
}