const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
    connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ConnectionRequest', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
