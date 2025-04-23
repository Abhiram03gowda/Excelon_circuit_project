const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const settlementController = require('../controllers/settlementController');

const router = express.Router();

router.post('/:groupId/settlements', authMiddleware, settlementController.createSettlement);
router.get('/user/:userId/settlements', authMiddleware, settlementController.getUserSettlements);

module.exports = router;
