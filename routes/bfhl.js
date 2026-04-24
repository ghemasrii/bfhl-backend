const express = require("express");
const router = express.Router();

const { processHierarchy } = require("../controllers/bfhlController");

router.post("/", processHierarchy);

module.exports = router;