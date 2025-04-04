const mongoose = require('mongoose');

// const ConnectionRequestSchema = new mongoose.Schema({
//     disabledUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     volunteerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
const ConnectionRequestSchema = new mongoose.Schema({
    disabledUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    volunteerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', required: true },
    chatEnabled: { type: Boolean, default: false } // ✅ Chat is enabled only when accepted
}, { timestamps: true });
 module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
