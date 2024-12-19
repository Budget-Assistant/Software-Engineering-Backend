const express = require('express');
const multer = require('multer');
const transactionController = require('../controllers/TransactionController');
const authMiddleware = require('../middleware/authMiddleware'); // Assume this middleware sets req.userId

const router = express.Router();
const upload = multer();

router.route('/')
    .get(authMiddleware, transactionController.getUserTransaction)
    .post(authMiddleware, upload.single('file'), transactionController.createTransaction); // Add upload middleware

router.route('/:id')
    .get(authMiddleware, transactionController.getTransactionById)
    .put(authMiddleware, upload.single('file'), transactionController.editTransaction)
    .delete(authMiddleware, transactionController.deleteTransaction);

module.exports = router;