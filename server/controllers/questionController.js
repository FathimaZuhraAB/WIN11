const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Question = require('../models/questionModel');
const { getQuestions } = require('../controllers/questionController');

const upload = multer({ dest: 'uploads/' });

// GET questions
router.get('/', getQuestions);

// POST Upload CSV
router.post('/upload', upload.single('file'), (req, res) => {
    // ... (keep your existing upload logic here) ...
});

// ✅ PASTE YOUR NEW MOCK STATS ROUTE HERE
router.get('/stats/:studentName', async (req, res) => {
    try {
        // Mock data is acceptable for the "Student History" feature demo
        const stats = {
            accuracy: 78, 
            points: 150,
            badges: ["Fast Thinker", "Accuracy Star"],
            weakTopics: ["Recursion", "State Management"],
            strongTopics: ["Loops", "Variables"]
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});

module.exports = router;