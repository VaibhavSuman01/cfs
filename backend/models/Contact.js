const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  service: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  replied: {
    type: Boolean,
    default: false,
  },
  repliedAt: {
    type: Date,
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  replyMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
