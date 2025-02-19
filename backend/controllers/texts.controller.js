const texts = {}; // Temporary in-memory storage for text

// Handle text upload
exports.uploadText = (req, res) => {
  const { text, sessionId } = req.body; // Assuming text is passed in the body

  if (!text || !sessionId) {
    return res.status(400).json({ message: "Text or session ID missing" });
  }

  // Store text temporarily (this would normally be in a database)
  texts[sessionId] = texts[sessionId] || [];
  texts[sessionId].push(text);

  res.status(200).json({
    message: "Text uploaded successfully",
    sessionId: sessionId,
  });
};

// Get text by session ID
exports.getText = (req, res) => {
  const { id } = req.params;
  const sessionText = texts[id];

  if (!sessionText) {
    return res.status(404).json({ message: "Text not found for this session" });
  }

  res.status(200).json({ text: sessionText });
};
