const cookie = require("cookie-parser");
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
// const socketIo = require('socket.io');
const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'http://10.12.6.130:5173' // Device in the network
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request from the specified origin
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject request
    }
  },
  credentials: true,  // This is important: Allows cookies, HTTP authentication, etc.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};


const authRoutes = require('./routes/auth');
const volunteerRoutes = require('./routes/volunteer');
const disabledRoutes = require('./routes/disabledRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
 const matchRoutes = require('./routes/matchRoutes');
// const chatController = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
// const io = socketIo(server, { cors: { origin: '*' } });
app.use(cookie());
// Middleware
app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow only your frontend domain
//     credentials: true, // Allow credentials (cookies, sessions)
//   })
// );
app.use(cors(corsOptions));
// Database Connection
mongoose.connect("mongodb+srv://ilakkiyabaskaran1807:QL4JYs6W7KICDymy@cluster.7mtd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster").then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error: ", err));

// Routes
app.use('/', authRoutes);
app.use('/', volunteerRoutes);
app.use('/', connectionRoutes);
app.use('/', matchRoutes);
app.use('/',disabledRoutes)

// Chat WebSocket
//chatController.chatHandler(io);

// Server Listening
const PORT =  5001;
server.listen(PORT, '0.0.0.0',() => console.log(`Server running on port ${PORT}`));
