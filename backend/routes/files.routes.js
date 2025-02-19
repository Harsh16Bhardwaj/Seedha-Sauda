const express = require("express");
const multer = require("multer");
const { uploadFile, getFile } = require("../controllers/files.controller");
const {uploadFiles} = require("../config/cloudinaryConfig");
const router = express.Router();

// Setup Multer Storage (temporary storage for demo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Routes for file upload and retrieval
router.post("/upload", upload.single("file"), uploadFile); // Upload a single file
router.get("/:id", getFile); // Get file by ID (could be based on session ID or filename)
// router.post("/uploado", uploadFiles);

module.exports = router;
