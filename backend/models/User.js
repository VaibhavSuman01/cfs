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
    },
    password: {
      type: String,
      required: function () {
        // Password is required only if not using OTP
        return !this.useOTP;
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    useOTP: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    pan: {
      type: String,
      trim: true,
      uppercase: true,
    },
    mobile: {
      type: String,
      trim: true,
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
    console.log('Password comparison failed: User has no password set');
    return false;
  }
  
  // If candidate password is undefined or null, return false
  if (!candidatePassword) {
    console.log('Password comparison failed: No candidate password provided');
    return false;
  }
  
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user can authenticate with password
UserSchema.methods.canUsePasswordAuth = function () {
  return !this.useOTP && !!this.password;
};

// Method to check if user can authenticate with OTP
UserSchema.methods.canUseOTPAuth = function () {
  return this.useOTP === true;
};

// Method to safely enable OTP authentication
UserSchema.methods.enableOTPAuth = function () {
  this.useOTP = true;
  this.password = undefined;
  return this;
};

// Method to safely disable OTP authentication and set password
UserSchema.methods.disableOTPAuth = function (newPassword) {
  if (!newPassword) {
    throw new Error('Password is required when disabling OTP authentication');
  }
  this.useOTP = false;
  this.password = newPassword;
  return this;
};

// Method to validate authentication configuration consistency
UserSchema.methods.validateAuthConfig = function () {
  // Case 1: OTP enabled but password exists
  if (this.useOTP && this.password) {
    throw new Error('Inconsistent auth config: OTP enabled but password exists');
  }
  
  // Case 2: OTP disabled but no password
  if (!this.useOTP && !this.password) {
    throw new Error('Inconsistent auth config: Password authentication enabled but no password set');
  }
  
  return true;
};

// Add a pre-save hook to validate auth config
UserSchema.pre('save', function(next) {
  try {
    // Skip validation for new users (they're configured in the registration process)
    if (this.isNew) {
      return next();
    }
    
    this.validateAuthConfig();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
