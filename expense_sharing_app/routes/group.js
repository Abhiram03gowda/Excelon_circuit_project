const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const groupController = require('../controllers/groupController');

// Create group
router.post('/', authMiddleware, groupController.createGroup);

// Invite user via email (returns join token)
router.post('/:groupId/invite', authMiddleware, groupController.inviteUser);

// Join group using token in query
router.post('/:groupId/join', groupController.joinGroup);

// List groups for a user
router.get('/user/:userId/groups', authMiddleware, groupController.getUserGroups);

module.exports = router;
