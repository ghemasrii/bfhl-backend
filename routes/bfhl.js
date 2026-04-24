const express = require("express");
const router = express.Router();

const { processHierarchy } = require("../controllers/bfhlController");

router.get("/", (req, res) => {
  res.json({
    message: "BFHL API is live. Use POST /bfhl to test."
  });
});

router.post("/", processHierarchy);

module.exports = router;