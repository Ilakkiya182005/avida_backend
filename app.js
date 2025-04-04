const cookie = require("cookie-parser");
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://67f058c5938c4d0e008d9419--clinquant-puppy-12d600.netlify.app/'  
];
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:5173","https://67f058c5938c4d0e008d9419--clinquant-puppy-12d600.netlify.app/"], // Update this to your frontend URL
        methods: ["GET", "POST"]
    }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Store the user when they connect
    socket.on("user-joined", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on('connect', () => {
      console.log('Connected to chat server');
      socket.emit('joinChat', { userId: loggedInUserId });
    });
    // Handle chat messages
    socket.on("send-message", ({ connectionId, senderId, receiverId, message }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive-message", { connectionId, senderId, message });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
    });
});




const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  
    } else {
      callback(new Error('Not allowed by CORS'));  
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

const authRoutes = require('./routes/auth');
const volunteerRoutes = require('./routes/volunteer');
const disabledRoutes = require('./routes/disabledRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const matchRoutes = require('./routes/matchRoutes');

const chatRoutes=require('./routes/chatRoutes');


app.use(cookie());
app.use(express.json());
app.use(cors(corsOptions));

// Database Connection
mongoose.connect("mongodb+srv://ilakkiyabaskaran1807:QL4JYs6W7KICDymy@cluster.7mtd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster").then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error: ", err));

// Routes
app.use('/', authRoutes);
app.use('/', volunteerRoutes);
app.use('/', connectionRoutes);
app.use('/', matchRoutes);
app.use('/', disabledRoutes);
app.use('/',chatRoutes);
app.get('/api/accepted-requests', async (req, res) => {
  try {
      const userId = req.user.id;  // Extract userId from token
      const requests = await ConnectionRequest.find({
          $or: [{ volunteerUserId: userId }, { disabledUserId: userId }],
          status: 'accepted'
      }).populate('volunteerUserId disabledUserId', 'firstName lastName email');
      
      res.json(requests);
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});




// Server Listening
const PORT = 5001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));



