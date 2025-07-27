const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensure email is always stored in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // OTP fields removed
    pan: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
    },
    dob: {
      type: Date,
    },
    mobile: {
      type: String,
      trim: true,
    },
    aadhaar: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Track if user has submitted a tax form
    hasTaxFormSubmission: {
      type: Boolean,
      default: false,
    },
    // Track document edit counts for each tax form submission
    documentEditCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it exists and has been modified
  if (this.password && this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // If password is undefined or null, return false
  if (!this.password) {
    return false;
  }
  
  // If candidate password is undefined or null, return false
  if (!candidatePassword) {
    return false;
  }
  
  return await bcrypt.compare(candidatePassword, this.password);
};

// OTP-related methods removed

module.exports = mongoose.model("User", UserSchema);
