const { v4: uuidv4 } = require('uuid');
const sessions = {};

const createSession = () => {
  const sessionId = uuidv4();

  sessions[sessionId] = {
    createdAt: new Date(),
    connectedUsers: 0,
  };

  // Automatically deletes the session after 10 minutes
  setTimeout(() => {
    delete sessions[sessionId];
    console.log(`Session with ID ${sessionId} has been deleted after 10 minutes.`);
  }, 10 * 60 * 1000);

  return sessionId;
};

const getTime = (sessionId) => {
  if (!sessions[sessionId]) { // Check if session exists first
    return null; // Return null if the session does not exist
  }
  const time = sessions[sessionId].createdAt; // Now safe to access
  return time;
};

module.exports = { createSession, sessions, getTime };
