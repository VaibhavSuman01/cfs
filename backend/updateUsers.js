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
    updateUsers();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Update existing users with missing fields
async function updateUsers() {
  try {
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    let updatedCount = 0;

    // Update each user
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Check for missing fields and set default values if needed
      if (!user.pan) {
        updates.pan = "";
        needsUpdate = true;
      }

      if (!user.dob) {
        updates.dob = null;
        needsUpdate = true;
      }

      if (!user.mobile) {
        updates.mobile = "";
        needsUpdate = true;
      }

      if (!user.aadhaar) {
        updates.aadhaar = "";
        needsUpdate = true;
      }

      // Update user if needed
      if (needsUpdate) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        updatedCount++;
        console.log(`Updated user: ${user.email}`);
      }
    }

    console.log(`Updated ${updatedCount} users with missing fields`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
}