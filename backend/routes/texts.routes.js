const express = require("express");
const { uploadText, getText } = require("../controllers/texts.controller");
const router = express.Router();

// Routes for text upload and retrieval
router.post("/upload", uploadText); // Upload text to session
router.get("/:id", getText); // Get text by session ID

module.exports = router;
