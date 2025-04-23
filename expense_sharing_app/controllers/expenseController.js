const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Balance = require('../models/Balance');

exports.recordExpense = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { title, amount, payerId, participants } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const share = amount / participants.length;
    const sharePerUser = {};
    participants.forEach(p => sharePerUser[p] = share);

    const expense = new Expense({
      groupId,
      title,
      amount,
      payerId,
      participants,
      sharePerUser
    });

    await expense.save();

    // Update balances
    for (let userId of participants) {
      if (userId === payerId) continue;

      let [user1, user2] = [payerId, userId].sort();
      const balanceDoc = await Balance.findOneAndUpdate(
        { groupId, user1, user2 },
        { $inc: { balance: (user1 === payerId ? share : -share) } },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ message: "Expense recorded", expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
