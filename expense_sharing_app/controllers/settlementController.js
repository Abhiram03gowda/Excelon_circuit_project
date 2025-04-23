const Settlement = require('../models/Settlement');
const Balance = require('../models/Balance');

exports.createSettlement = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { payerId, payeeId, amount } = req.body;

    const settlement = new Settlement({ groupId, payerId, payeeId, amount });
    await settlement.save();

    let [user1, user2] = [payerId, payeeId].sort();
    const delta = user1 === payerId ? -amount : amount;

    await Balance.findOneAndUpdate(
      { groupId, user1, user2 },
      { $inc: { balance: delta } },
      { upsert: true }
    );

    res.status(201).json({ message: "Settlement recorded", settlement });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserSettlements = async (req, res) => {
  try {
    const userId = req.params.userId;
    const settlements = await Settlement.find({
      $or: [{ payerId: userId }, { payeeId: userId }]
    });

    res.status(200).json(settlements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
