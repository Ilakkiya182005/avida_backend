const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { 
        type: String, 
        required: true, 
        trim: true, 
        minlength: 1, 
        maxlength: 1000 
    },
    timestamp: { 
        type: Date, 
        default: Date.now, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
