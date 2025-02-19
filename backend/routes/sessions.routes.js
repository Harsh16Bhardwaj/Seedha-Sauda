const express = require("express");
const router = express.Router();
const { startSession } = require("../controllers/sessions.controllers.js");
const { getTime } = require("../controllers/sessionManager.js");

router.post("/start", startSession);

router.get("/time/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  const time = getTime(sessionId);
  
  if (!time) {
    return res.status(404).json({ message: "Session not found." });
  }

  return res.json({ sessionId, createdAt: time });
});

module.exports = router;
