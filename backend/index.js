const express = require("express");
const cors = require("cors");
const sessionRoutes = require("./routes/sessions.routes");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const { Server } = require("socket.io");
const { sessions } = require("./controllers/sessionManager.js");

const app = express();
const http = require("http");
require("dotenv").config();


// Check for Cloudinary environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Cloudinary environment variables are missing!");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins or specify the origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], // Allow headers if needed
    credentials: true,  // Allow credentials (cookies)
  },
});


// Middleware
const corsOptions = {
  origin: '*', // Or specify the actual origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers you might be using
  credentials: true,  // This allows cookies and credentials to be sent, if applicable
};
app.use(cors(corsOptions));

app.use(cors(corsOptions)); // Apply CORS globally
app.use(express.json());
app.use("/api/session", sessionRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


// File upload route
app.post("/upload", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }

  try {
    const uploadedFiles = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file);
      uploadedFiles.push({
        name: file.originalname,
        size: file.size,
        url: result.secure_url,
      });
    }
    setTimeout(async () => {
      for (const file of uploadedFiles) {
        try {
          await cloudinary.uploader.destroy(file.public_id);
          console.log(`🗑️ Deleted file: ${file.public_id}`);
        } catch (error) {
          console.error(`❌ Error deleting file ${file.public_id}:`, error);
        }
      }
    }, 20 * 60 * 1000); // 20 minutes in milliseconds

    console.log("🟢 Emitting receiveFiles ", uploadedFiles); // 🔴 Debug Log
    io.emit("receiveFiles", uploadedFiles); // Emit once

    res.json({ message: "Files uploaded successfully!", files: uploadedFiles });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "File upload failed." });
  }
});



// Upload file to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        { upload_preset: "p2p-upload" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("joinSession", (sessionId) => handleJoinSession(socket, sessionId));
  socket.on("sendFile", (sessionId, fileData) => handleSendFile(socket, sessionId, fileData));

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Handle session joining
const handleJoinSession = (socket, sessionId) => {
  if (sessions[sessionId]) {
    socket.join(sessionId);
    sessions[sessionId].connectedUsers += 1;
    socket.emit("sessionJoined", { message: "Session started, you're connected!" });
  } else {
    socket.emit("sessionError", { message: "Session not found" });
  }
};

// Handle file sending in a session
const handleSendFile = (socket, sessionId, fileData) => {
  if (sessions[sessionId]) {
    socket.to(sessionId).emit("receiveFile", fileData);
  } else {
    socket.emit("sessionError", { message: "Session not found" });
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
