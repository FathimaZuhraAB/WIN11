require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 1. MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- 2. DATABASE MODELS ---

// A. Question Model
const questionSchema = new mongoose.Schema({
    text: String,
    options: [{ id: String, text: String }],
    correctAnswer: String,
    topic: String,
    difficulty: { type: String, default: "Moderate" },
    attempts: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 }
});
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

// B. User Model (THIS WAS MISSING!)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' } // 'student' or 'professor'
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- 3. ROUTES ---

// AUTH: Register
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Simple check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Create User
        const user = await User.create({ name, email, password, role });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: "mock-token-for-demo" // Mock token to satisfy frontend
            });
        }
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// AUTH: Login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // In a real app, use bcrypt.compare here. For demo, direct compare:
        if (user && user.password === password) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: "mock-token-for-demo"
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// QUESTIONS: Get All
app.get('/api/questions', async (req, res) => {
    try {
        const topic = req.query.topic;
        let query = {};
        if (topic && topic !== "All") query.topic = topic;
        const questions = await Question.find(query);
        res.json(questions);
    } catch (err) { res.json([]); }
});

// --- 4. SOCKET.IO LOGIC ---
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let isSessionLive = false;
let currentTopic = "All";
let liveStudentData = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Initial State
    try {
        socket.emit('session-status', { isLive: isSessionLive, topic: currentTopic });
        if (isSessionLive) socket.emit('live-data-update', Object.values(liveStudentData));
    } catch (e) {}

    // Professor Controls
    socket.on('start-session', (topic) => {
        isSessionLive = true;
        currentTopic = topic || "All";
        liveStudentData = {};
        io.emit('session-status', { isLive: true, topic: currentTopic });
        io.emit('live-data-update', []);
    });

    socket.on('end-session', () => {
        isSessionLive = false;
        io.emit('session-status', { isLive: false, topic: null });
    });

    // Simulation
    socket.on('simulate-data', () => {
        const mockStudents = [
            { id: "m1", name: "Priya", correct: 10, total: 10, accuracy: 100, status: "Excellent", history: [] },
            { id: "m2", name: "Amit", correct: 2, total: 10, accuracy: 20, status: "⚠️ Lazy Guessing (All A)", history: ["A","A","A","A","A"] },
            { id: "m3", name: "Rahul", correct: 3, total: 10, accuracy: 30, status: "⚠️ Lazy Guessing (All C)", history: ["C","C","C","C","C"] },
            { id: "m4", name: "Sandeep", correct: 6, total: 10, accuracy: 60, status: "Good", history: [] },
            { id: "m5", name: "Nitin", correct: 4, total: 10, accuracy: 40, status: "Needs Attention", history: [] }
        ];
        mockStudents.forEach(s => liveStudentData[s.name] = s);
        io.emit('live-data-update', Object.values(liveStudentData));
    });

    // Student Submission
    socket.on('submit-answer', async ({ studentName, questionId, isCorrect, selectedOption }) => {
        if (!isSessionLive || !studentName) return;

        try {
            if (!liveStudentData[studentName]) {
                liveStudentData[studentName] = { 
                    id: socket.id, name: studentName, correct: 0, total: 0, accuracy: 0, status: 'Good', history: [] 
                };
            }
            let s = liveStudentData[studentName];
            
            s.total += 1;
            if (isCorrect) s.correct += 1;
            s.accuracy = Math.round((s.correct / s.total) * 100);

            if (selectedOption) {
                if (!Array.isArray(s.history)) s.history = [];
                s.history.push(selectedOption);
                if (s.history.length > 5) s.history.shift();
            }

            const isSpamming = s.history.length >= 4 && s.history.every(val => val === s.history[0]);

            if (isSpamming) s.status = `⚠️ Lazy Guessing (All ${s.history[0]})`;
            else {
                if (s.accuracy < 50) s.status = "Needs Attention";
                else if (s.accuracy >= 90) s.status = "Excellent";
                else s.status = "Good";
            }

            io.emit('live-data-update', Object.values(liveStudentData));
        } catch (e) { console.error(e); }
    });
});

// 5. START SERVER
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.log('❌ DB Error:', err.message);
        server.listen(PORT, () => console.log(`🚀 Server running (OFFLINE MODE)`));
    });