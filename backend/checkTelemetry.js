require("dotenv").config();

const mongoose = require("mongoose");

const checkTelemetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const data = await mongoose.connection.db
      .collection("telemetry")
      .find({})
      .toArray();

    console.log("Telemetry records:");
    console.log(data);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to read telemetry:", error.message);
  }
};

checkTelemetry();