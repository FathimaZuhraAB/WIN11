const express = require('express');
const router = express.Router();
const Question = require('../models/questionModel');

// @desc    Get questions
// @route   GET /api/questions
router.get('/', async (req, res) => {
    try {
        const topic = req.query.topic;
        let query = {};
        if (topic && topic !== "All") {
            query.topic = topic;
        }
        const questions = await Question.find(query);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc    Get Student Stats (Mock)
// @route   GET /api/questions/stats/:studentName
router.get('/stats/:studentName', (req, res) => {
    res.json({
        accuracy: 80,
        weakTopics: ["Arrays"],
        strongTopics: ["Loops"]
    });
});

module.exports = router;