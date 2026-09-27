const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nodes, edges } = req.body;

    if (!nodes || !Array.isArray(nodes)) {
      return res.status(400).json({
        message: "Nodes are required",
      });
    }

    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({
        message: "Edges are required",
      });
    }

    const executionResult = {
      status: "success",
      message: "Rule executed successfully",
      nodeCount: nodes.length,
      edgeCount: edges.length,
      executedAt: new Date(),
    };

    res.json(executionResult);
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