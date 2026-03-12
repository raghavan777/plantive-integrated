const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
    .get(authorizeRoles('admin'), getUsers)
    .post(authorizeRoles('admin'), createUser);

router.route('/:id')
    .put(authorizeRoles('admin'), updateUser)
    .delete(authorizeRoles('admin'), deleteUser);

module.exports = router;