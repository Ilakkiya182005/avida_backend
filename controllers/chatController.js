const ChatMessage = require("../models/ChatMessage");
const ConnectionRequest = require("../models/ConnectionRequest");
const Message = require("../models/Message");
// Send a chat message
exports.sendMessage = async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        // Validate request data
        if (!sender || !receiver || !content) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // 🚨 Check if a valid connection exists
        const connection = await ConnectionRequest.findOne({
            $or: [
                { disabledUserId: sender, volunteerUserId: receiver },
                { disabledUserId: receiver, volunteerUserId: sender }
            ],
            status: "accepted"
        });

        if (!connection) {
            return res.status(403).json({ error: "Chat not allowed without an accepted connection" });
        }

        // Save message in database
        const newMessage = new Message({ sender, receiver, content });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getChatMessages = async (req, res) => {
    try {
        const { connectionId } = req.params;

        if (!connectionId) {
            return res.status(400).json({ error: "Connection ID is required" });
        }

        console.log("Fetching messages for Connection ID:", connectionId); // Debugging

        // ✅ Fetch messages correctly
        const messages = await Message.find({ connectionId })
            .sort({ createdAt: 1 }) // Sort from oldest to newest
            .populate("sender", "firstName lastName") // Fetch sender details
            .populate("receiver", "firstName lastName"); // Fetch receiver details

        if (messages.length === 0) {
            return res.status(200).json({ message: "No messages yet.", messages: [] });
        }

        console.log("Fetched Messages:", messages); // Debugging

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error); // 🔴 Log exact error
        res.status(500).json({ error: "Internal Server Error" });
    }
};



