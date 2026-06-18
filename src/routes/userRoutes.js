const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id/role')
    .put(protect, admin, updateUserRole);

router.route('/:id')
    .delete(protect, admin, deleteUser);

module.exports = router;
