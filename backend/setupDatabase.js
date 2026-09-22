require("dotenv").config();

const mongoose = require("mongoose");

const setupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collections = await mongoose.connection.db
      .listCollections({ name: "telemetry" })
      .toArray();

    if (collections.length > 0) {
      console.log("Telemetry collection already exists.");
    } else {
      await mongoose.connection.db.createCollection("telemetry", {
        timeseries: {
          timeField: "timestamp",
          metaField: "sensorId",
          granularity: "seconds"
        }
      });

      console.log("Telemetry time-series collection created.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  }
};

setupDatabase();