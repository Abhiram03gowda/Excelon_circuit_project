const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const Expense = require('../models/Expense');

const router = express.Router();

// Create Expense
router.post('/:groupId/expenses', authMiddleware, async (req, res) => {
    const { title, amount, payerId, participants } = req.body;
    const share = amount / participants.length;
    const sharePerUser = {};
    participants.forEach(p => { sharePerUser[p] = share; });

    const expense = new Expense({
        groupId: req.params.groupId,
        title,
        amount,
        payerId,
        participants,
        sharePerUser
    });
    await expense.save();
    res.json(expense);
});

// List Expenses
router.get('/:groupId/expenses', authMiddleware, async (req, res) => {
    const expenses = await Expense.find({ groupId: req.params.groupId });
    res.json(expenses);
});

module.exports = router;
