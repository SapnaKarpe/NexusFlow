const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const Telemetry = require("./models/Telemetry");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "NexusFlow backend is running"
  });
});

app.post("/api/telemetry", async (req, res) => {
  try {
    const { sensorId, temperature, pressure } = req.body;

    const telemetry = await Telemetry.create({
      sensorId,
      timestamp: new Date(),
      temperature,
      pressure
    });

    res.status(201).json({
      message: "Telemetry data stored successfully",
      data: telemetry
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to store telemetry data",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`NexusFlow server running on http://localhost:${PORT}`);
  });
};

startServer();