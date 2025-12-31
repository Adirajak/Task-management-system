const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAllUsers);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;