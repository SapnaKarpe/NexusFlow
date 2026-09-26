const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    nodes: {
      type: Array,
      default: [],
    },

    edges: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rule", ruleSchema);