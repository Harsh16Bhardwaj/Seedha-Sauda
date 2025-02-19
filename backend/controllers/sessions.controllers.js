const { createSession } = require("./sessionManager.js");
async function startSession(req, res) {
  try {
    const sessionId = createSession();
    res.status(200).json({ url: `http://localhost:5173/session/${sessionId}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to start session" });
  }
}

module.exports = { startSession };
