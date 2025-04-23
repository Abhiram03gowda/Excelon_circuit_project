const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const Balance = require('../models/Balance');

const router = express.Router();

// View Balances
router.get('/:groupId/balances', authMiddleware, async (req, res) => {
    const balances = await Balance.find({ groupId: req.params.groupId });
    res.json(balances);
});

module.exports = router;
