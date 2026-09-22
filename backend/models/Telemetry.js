const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    pressure: {
      type: Number,
      required: true
    }
  },
  {
    collection: "telemetry"
  }
);

module.exports = mongoose.model("Telemetry", telemetrySchema);