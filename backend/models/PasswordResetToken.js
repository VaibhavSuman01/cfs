const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 3600000), // 1 hour from creation
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
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster token lookups
PasswordResetTokenSchema.index({ token: 1 });

// Method to check if token is valid
PasswordResetTokenSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

// Static method to cleanup expired tokens
PasswordResetTokenSchema.statics.cleanupExpired = async function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { used: true }
    ]
  });
};

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);