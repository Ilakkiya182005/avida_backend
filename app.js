const cookie = require("cookie-parser");
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
// const socketIo = require('socket.io');


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
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGOURL).then(() => console.log("MongoDB Connected"))
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
const PORT =  5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
