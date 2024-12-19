const express = require('express');
const customizedKindController = require('../controllers/customizedKindController');
const authMiddleware = require('../middleware/authMiddleware'); // Assume this middleware sets req.userId

const router = express.Router();

router.route('/')
    .get(authMiddleware, customizedKindController.getUserCustomizedKind)
    .post(authMiddleware, customizedKindController.createCustomizedKind);

router.route('/:id')
    .delete(authMiddleware, customizedKindController.deleteCustomizedKind);

module.exports = router;