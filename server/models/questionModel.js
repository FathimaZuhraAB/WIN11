const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    text: { type: String, required: true },
    options: [{ 
        id: { type: String, required: true }, // e.g., "A", "B"
        text: { type: String, required: true } 
    }],
    correctAnswer: { type: String, required: true }, // "A", "B", etc.
    topic: { type: String, required: true }, // e.g., "Loops", "Arrays"
    
    // ANALYTICS FIELDS (The "WIN11" Requirement)
    difficulty: { type: String, default: "Moderate" }, // Auto-updated later
    attempts: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;