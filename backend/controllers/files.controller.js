const path = require("path");
const fs = require("fs");

// Temporary in-memory storage for files (for demo purposes)
const files = {};

// Handle file upload
exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Store file info temporarily (this would normally be in a database)
  const fileId = file.filename;
  files[fileId] = {
    filename: file.originalname,
    path: file.path,
  };

  res.status(200).json({
    message: "File uploaded successfully",
    fileId: fileId,
  });
};

// Get file by ID
exports.getFile = (req, res) => {
  const { id } = req.params;
  const file = files[id];

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  res.sendFile(path.resolve(file.path));
};
