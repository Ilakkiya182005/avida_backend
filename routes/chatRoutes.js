// const express = require("express");
// const { sendMessage, getChatMessages } = require("../controllers/chatController");
// const { userAuth } = require("../middlewares/auth");
// const Message = require("../models/Message");
// const chatRoutes = express.Router();

// chatRoutes.post("/send-message", userAuth, sendMessage);
// chatRoutes.get("/messages/:connectionId", userAuth, getChatMessages);

// chatRoutes.get("/get-messages/:senderId/:receiverId", async (req, res) => {
//     try {
//         const { senderId, receiverId } = req.params;
//         console.log("Fetching messages between:", senderId, receiverId);

//         // Find messages where sender and receiver match
//         const messages = await Message.find({
//             $or: [
//                 { sender: senderId, receiver: receiverId },
//                 { sender: receiverId, receiver: senderId } // Ensures both users see their messages
//             ]
//         }).sort({ createdAt: 1 });

//         console.log("Messages found:", messages);
//         res.status(200).json(messages);
//     } catch (error) {
//         console.error("Error fetching messages:", error); // Log error
//         res.status(500).json({ error: error.message || "Internal Server Error" });
//     }
// });


// module.exports = chatRoutes;

const express = require("express");
const { sendMessage, getChatMessages } = require("../controllers/chatController");
const { userAuth } = require("../middlewares/auth");
const Message = require("../models/Message"); // Import Message model
const chatController=require("../controllers/chatController");
const chatRoutes = express.Router();

// chatRoutes.post("/send-message", userAuth, sendMessage);
chatRoutes.post("/send-message", async (req, res) => {
    try {
      const { connectionId, sender, receiver, content } = req.body;
  
      if (!content || !connectionId || !sender || !receiver) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const newMessage = new Message({
        connectionId,
        sender: sender,
        receiver: receiver,
        content: content, // ✅ Ensure this matches the schema
      });
      console.log(newMessage);
  
      await newMessage.save();
      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message", error });
    }
  });
  
chatRoutes.get("/messages/:connectionId", userAuth, getChatMessages);
chatRoutes.get("/get-messages/:userId/:receiverId", async (req, res) => {
    try {
      const { userId, receiverId } = req.params;
      
      // Find the connectionId for the given users
      const connection = await ConnectionRequest.findOne({
        $or: [
          { disabledUserId: userId, volunteerUserId: receiverId },
          { disabledUserId: receiverId, volunteerUserId: userId }
        ],
      });
  
      if (!connection) {
        return res.status(404).json({ message: "No connection found" });
      }
  
      // Fetch messages
      const messages = await Message.find({ connectionId: connection._id }).sort({ createdAt: 1 });
  
      res.json({ messages, connectionId: connection._id });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
chatRoutes.get("/messages/:userId", chatController.getChatMessages);
module.exports = chatRoutes;
