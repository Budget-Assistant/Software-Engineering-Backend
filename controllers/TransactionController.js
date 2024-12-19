const Transaction = require('../models/TransactionModel');

exports.createTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    //console.log('Creating transaction for user:', userId);
    //console.log('Request body:', req.body);
    //console.log('Uploaded file:', req.file); 
    const transactionData = {
      ...req.body,
      user: userId,
    };

    if (req.file) {
        transactionData.file = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();
    res.status(201).send(transaction); // 201 Created
    } catch (error) {
        res.status(400).send(`Error creating transaction: ${error.message}`); // 400 Bad Request
    }
};

exports.getUserTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.userId });
        res.send(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send(`Error fetching transactions: ${error.message}`); // 500 Internal Server Error
    }
};

exports.getTransactionById = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        res.send(transaction);
    } catch (error) {
        res.status(500).send(`Error fetching transaction: ${error.message}`);
    }
};

exports.editTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount, description, type, kind, date } = req.body;
    let updateData = { amount, description, type, kind, date };

    // Check if a file is uploaded
    if (req.file) {
        updateData.file = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    try {
        await Transaction.findByIdAndUpdate(id, updateData);
        res.status(200).send(`Transaction with id ${id} updated successfully.`);
    } catch (error) {
        res.status(500).send(`Error updating transaction: ${error.message}`);
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await Transaction.findByIdAndDelete(id);
        res.status(200).send(`Transaction with id ${id} deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Error deleting transaction: ${error.message}`);
    }
};