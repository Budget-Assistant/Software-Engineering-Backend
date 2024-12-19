const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: String,
    amount: Number,
    description: String,
    type: String,
    kind: String,
    file: {
        data: Buffer,
        contentType: String
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
