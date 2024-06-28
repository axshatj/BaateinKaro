const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    conversationID: {
        type: String,
    },
    senderID: {
        type: String,
    },
    message: {
        type: String,
    }
})

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;