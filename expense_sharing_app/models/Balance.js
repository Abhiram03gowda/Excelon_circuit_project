const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    balance: { type: Number }
});

module.exports = mongoose.model('Balance', balanceSchema);
