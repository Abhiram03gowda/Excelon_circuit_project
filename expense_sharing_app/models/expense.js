const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.post('/:groupId/expenses', authMiddleware, expenseController.recordExpense);
router.get('/:groupId/expenses', authMiddleware, expenseController.getExpenses);

module.exports = router;
