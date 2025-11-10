const mongoose = require("mongoose");

const SupportChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supportTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTeam",
      required: true,
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "support"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ["open", "resolved", "closed"],
      default: "open",
    },
    subject: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastMessageAt when a new message is added
SupportChatSchema.pre("save", function (next) {
  if (this.isModified("messages") && this.messages.length > 0) {
    this.lastMessageAt = new Date();
  }
  next();
});

module.exports = mongoose.model("SupportChat", SupportChatSchema);

