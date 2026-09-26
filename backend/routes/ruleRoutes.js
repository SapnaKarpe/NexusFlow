const express = require("express");
const Rule = require("../models/Rule");

const router = express.Router();

// Save a new rule
router.post("/", async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    const rule = await Rule.create({
      name,
      nodes,
      edges,
    });

    res.status(201).json({
      message: "Rule saved successfully",
      rule,
    });
  } catch (error) {
    console.error("Error saving rule:", error);
    res.status(500).json({
      message: "Failed to save rule",
      error: error.message,
    });
  }
});

// Get all rules
router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find().sort({ createdAt: -1 });

    res.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.status(500).json({
      message: "Failed to fetch rules",
      error: error.message,
    });
  }
});

module.exports = router;