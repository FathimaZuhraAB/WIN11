AI-Powered Real-Time Classroom Analytics Platform

📌 Overview

Classroom Heartbeat is a real-time quiz and analytics platform built to eliminate the “black box” problem in classrooms. It enables instructors to instantly understand student performance, identify confusing questions, and detect low-effort answering patterns—all in real time, without page refreshes.

The platform leverages live WebSocket communication and AI-inspired pattern detection to transform passive classrooms into data-driven learning environments.


(Replace with an actual dashboard screenshot)

🚀 Core Features
👨‍🏫 Instructor Dashboard (Command Center)

Real-Time Live Analytics Table

Student scores, accuracy, and activity status update instantly using Socket.io.

No manual refresh required.

Demo / Simulation Mode

One-click Magic Simulation instantly generates 5 mock students.

Designed for seamless demos during presentations, evaluations, and judging rounds.

AI-Inspired Pattern Detection

Confusing Question Detector
Flags questions with high attempts but low accuracy (e.g., “Hard Question” alerts).

Lazy Guessing Detector
Identifies students repeatedly selecting the same option (e.g., “AAAA”) and highlights them with warning indicators.

Smart Filtering & Sorting

Instantly filter students by accuracy, score, or activity (e.g., Accuracy < 50%).

Quickly identify struggling learners.

Classroom Metrics & Insights

Class average score

Number of active students

Points per student

Overall engagement health

🧑‍🎓 Student Experience

Minimalist “Zen Mode” Interface

Clean, distraction-free quiz UI focused on learning.

Instant Feedback System

Visual feedback (Green / Red) immediately after each answer.

Persistent Learning History

Quiz progress and results are stored locally to prevent data loss on refresh.

🛠️ Technology Stack

Frontend

React.js

Tailwind CSS

Lucide React (Icons)

Context API (State Management)

Backend

Node.js

Express.js

Real-Time Communication

Socket.io

Database

MongoDB

Mongoose ODM

⚙️ Installation & Local Setup
1️⃣ Prerequisites

Node.js (v16+ recommended)

MongoDB (Local instance or MongoDB Atlas)

2️⃣ Backend Setup
cd server
npm install


Create a .env file inside the server directory:

MONGO_URI=mongodb://localhost:27017/classroom_db
PORT=5000


Seed the database (required for demo & simulation mode):

node seeder.js


Start the backend server:

npm run dev

3️⃣ Frontend Setup
cd client
npm install
npm start


The application will be available at:

http://localhost:3000

🎯 Use Cases

Live classroom quizzes

Coding bootcamps & workshops

Online learning platforms

Hackathons & academic demos

Teaching analytics experiments

🏆 Highlights

Zero-refresh real-time updates

Built-in demo mode for presentations

Intelligent behavior detection

Scalable real-time architecture

Clean, professional UI/UX