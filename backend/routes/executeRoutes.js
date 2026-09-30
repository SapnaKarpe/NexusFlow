const express = require("express");
const { executeRule } = require("../services/ruleEngine");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nodes, edges, telemetry } = req.body;

    if (!Array.isArray(nodes)) {
      return res.status(400).json({
        status: "error",
        message: "Nodes must be an array",
      });
    }

    if (nodes.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Rule must contain at least one node",
      });
    }

    if (!Array.isArray(edges)) {
      return res.status(400).json({
        status: "error",
        message: "Edges must be an array",
      });
    }

    for (const edge of edges) {
      if (!edge.source || !edge.target) {
        return res.status(400).json({
          status: "error",
          message: "Every edge must have a source and target",
        });
      }

      const sourceExists = nodes.some(
        (node) => node.id === edge.source
      );

      const targetExists = nodes.some(
        (node) => node.id === edge.target
      );

      if (!sourceExists || !targetExists) {
        return res.status(400).json({
          status: "error",
          message: "Edge references a node that does not exist",
        });
      }
    }

    const currentTelemetry = telemetry || {
      sensorId: "TURBINE-01",
      temperature: 0,
      pressure: 0,
    };

    executeRule(nodes, edges, currentTelemetry).subscribe({
      next: (executionResult) => {
        res.json(executionResult);
      },

      error: (error) => {
        console.error("RxJS rule execution error:", error);

        res.status(500).json({
          status: "error",
          message: "Rule execution failed",
          error: error.message,
        });
      },
    });
  } catch (error) {
    console.error("Rule execution error:", error);

    res.status(500).json({
      status: "error",
      message: "Rule execution failed",
      error: error.message,
    });
  }
});

module.exports = router;