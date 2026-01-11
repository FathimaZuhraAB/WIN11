const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/userController');
const Question = require('../models/questionModel'); // <--- Import this
const { protect } = require('../middleware/authMiddleware'); // We'll create this simple middleware
router.post('/register', registerUser);
router.post('/login', authUser);

module.exports = router;