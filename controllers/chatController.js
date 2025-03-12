// const Message = require('../models/Message');

// exports.chatHandler = (io) => {
//     io.on('connection', (socket) => {
//         socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
//             const newMessage = new Message({ senderId, receiverId, message });
//             await newMessage.save();
//             io.emit('receiveMessage', newMessage);
//         });
//     });
// };