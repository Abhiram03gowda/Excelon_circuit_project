const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settlement', settlementSchema);
