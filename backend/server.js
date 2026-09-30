const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const ruleRoutes = require("./routes/ruleRoutes");
const executeRoutes = require("./routes/executeRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const connectDB = require("./db");
const Telemetry = require("./models/Telemetry");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rules", ruleRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "NexusFlow backend is running",
  });
});

// Telemetry API
app.post("/api/telemetry", async (req, res) => {
  try {
    const { sensorId, temperature, pressure } = req.body;

    const telemetry = await Telemetry.create({
      sensorId,
      timestamp: new Date(),
      temperature,
      pressure,
    });

    // Send telemetry to connected frontend clients
    io.emit("telemetry", telemetry);

    res.status(201).json({
      message: "Telemetry data stored successfully",
      data: telemetry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to store telemetry data",
      error: error.message,
    });
  }
});

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Frontend connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Frontend disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`NexusFlow server running on http://localhost:${PORT}`);
  });
};

startServer();