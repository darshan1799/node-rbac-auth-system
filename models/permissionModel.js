const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
