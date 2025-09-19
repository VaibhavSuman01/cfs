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
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty PAN
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: 'PAN must be in format AAAAA0000A'
      },
      set: function(v) {
        if (!v) return v;
        // Remove any non-alphanumeric characters and convert to uppercase
        return v.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      }
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
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty Aadhaar
          return /^\d{12}$/.test(v);
        },
        message: 'Aadhaar must be exactly 12 digits'
      },
      set: function(v) {
        if (!v) return v;
        // Remove any non-numeric characters
        return v.replace(/\D/g, '');
      }
    },
    fatherName: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
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
    // Block/unblock functionality
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedAt: {
      type: Date,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    blockReason: {
      type: String,
      trim: true,
    },
    unblockedAt: {
      type: Date,
    },
    unblockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
