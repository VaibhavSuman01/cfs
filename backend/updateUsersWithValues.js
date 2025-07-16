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

// Update existing users with actual values for missing fields
async function updateUsers() {
  try {
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    let updatedCount = 0;

    // Update each user
    for (const user of users) {
      // Set actual values for fields
      const updates = {
        pan: "ABCDE1234F",  // Example PAN format
        dob: new Date("1990-01-01"),  // Example DOB
        mobile: "9876543210",  // Example mobile number
        aadhaar: "123456789012"  // Example Aadhaar number
      };

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: updates },
        { new: true }
      );

      updatedCount++;
      console.log(`Updated user: ${user.email}`);
      console.log(`Updated fields:`, updates);
      console.log(`New user object:`, JSON.stringify(updatedUser));
    }

    console.log(`Updated ${updatedCount} users with actual values for fields`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
}