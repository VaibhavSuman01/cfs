const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SupportTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    roles: {
      type: [String],
      enum: [
        "company_information_support",
        "taxation_support",
        "roc_returns_support",
        "other_registration_support",
        "advisory_support",
        "reports_support",
        "live_support",
      ],
      default: ["live_support"],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: "At least one role must be assigned"
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Migration: Convert old single role to roles array and remove old role field
SupportTeamSchema.pre("save", async function (next) {
  // If document has old 'role' field but no 'roles' array, migrate it
  if (this.role && (!this.roles || this.roles.length === 0)) {
    const validRoles = [
      "company_information_support",
      "taxation_support",
      "roc_returns_support",
      "other_registration_support",
      "advisory_support",
      "reports_support",
      "live_support",
    ];
    
    // Only migrate if the old role is valid
    if (validRoles.includes(this.role)) {
      this.roles = [this.role];
    } else {
      // If invalid role, default to live_support
      this.roles = ["live_support"];
    }
  }
  
  // Remove old role field to prevent validation errors
  if (this.role !== undefined) {
    this.set('role', undefined, { strict: false });
  }
  
  next();
});

// Hash password before saving
SupportTeamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
SupportTeamSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("SupportTeam", SupportTeamSchema);

