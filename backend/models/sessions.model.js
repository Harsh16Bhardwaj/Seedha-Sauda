const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '10m' }, // Auto delete after 10 min
    connectedUsers: { type: Number, default: 0 },
});

module.exports = mongoose.model('Session', sessionSchema);
