const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user.id;

    const group = new Group({ name, ownerId });
    await group.save();

    await new GroupMember({ groupId: group._id, userId: ownerId }).save();

    res.status(201).json({ message: "Group created", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all groups a user belongs to
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.params.userId;
    const memberships = await GroupMember.find({ userId }).populate('groupId');
    const groups = memberships.map(m => m.groupId);
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Invite user to a group (returns tokenized join link)
exports.inviteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const groupId = req.params.groupId;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ email, groupId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const joinLink = `http://localhost:3000/api/groups/${groupId}/join?token=${token}`;
    res.status(200).json({ message: "Invite link generated", joinLink });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Join a group using token
exports.joinGroup = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, groupId } = decoded;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyMember = await GroupMember.findOne({ userId: user._id, groupId });
    if (alreadyMember) return res.status(400).json({ message: "User already in group" });

    await new GroupMember({ groupId, userId: user._id }).save();

    res.status(200).json({ message: "User joined the group successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};
