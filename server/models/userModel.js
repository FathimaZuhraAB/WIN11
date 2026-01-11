const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'professor'], // Strictly limits roles
        default: 'student',
        required: true
    },
    // For Feature 7 (Gamification) & 3 (Performance Table)
    badges: [{ type: String }], 
    totalPoints: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 } 
}, {
    timestamps: true
});

// Middleware: Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method: Match user entered password to hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;