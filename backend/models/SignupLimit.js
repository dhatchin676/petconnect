const mongoose = require("mongoose");

const SignupLimitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("SignupLimit", SignupLimitSchema);