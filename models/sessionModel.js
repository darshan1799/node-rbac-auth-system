const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    valid: {
      type: Boolean,
      required: true,
      default: true,
    },
    user_agent: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const sessionModel = mongoose.model("session", sessionSchema);

module.exports = sessionModel;
