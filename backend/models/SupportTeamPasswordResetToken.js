const mongoose = require("mongoose");

const SupportTeamPasswordResetTokenSchema = new mongoose.Schema(
  {
    supportTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTeam",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from creation
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic cleanup of expired tokens
SupportTeamPasswordResetTokenSchema.index({ expiresAt: 1 }, {
  expireAfterSeconds: 0,
});

// Index for faster OTP lookups
SupportTeamPasswordResetTokenSchema.index({ supportTeamId: 1, otp: 1 });

// Method to check if OTP is valid
SupportTeamPasswordResetTokenSchema.methods.isValid = function () {
  return !this.used && this.expiresAt > new Date();
};

// Static method to cleanup expired tokens
SupportTeamPasswordResetTokenSchema.statics.cleanupExpired = async function () {
  return this.deleteMany({
    $or: [{ expiresAt: { $lt: new Date() } }, { used: true }],
  });
};

module.exports = mongoose.model(
  "SupportTeamPasswordResetToken",
  SupportTeamPasswordResetTokenSchema
);

