require('dotenv').config();
const mongoose = require('mongoose');

// Schema Definition
const questionSchema = new mongoose.Schema({
    text: String,
    options: [{ id: String, text: String }],
    correctAnswer: String,
    topic: String,
    difficulty: { type: String, default: "Moderate" },
    attempts: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 }
});
const Question = mongoose.model('Question', questionSchema);

const questions = [
  // --- NODE.JS QUESTIONS ---
  { 
    text: "Which core module in Node.js is used for file system operations?", 
    options: [
        {id:"A", text:"files"}, 
        {id:"B", text:"fs"}, 
        {id:"C", text:"os"}, 
        {id:"D", text:"path"}
    ], 
    correctAnswer: "B", 
    topic: "Node.js" 
  },
  { 
    text: "What is the default scope of a module in Node.js?", 
    options: [
        {id:"A", text:"Global"}, 
        {id:"B", text:"Local to the module"}, 
        {id:"C", text:"Shared with other modules"}, 
        {id:"D", text:"Public"}
    ], 
    correctAnswer: "B", 
    topic: "Node.js" 
  },
  { 
    text: "Which event is emitted when an unhandled error occurs in a stream?", 
    options: [
        {id:"A", text:"stop"}, 
        {id:"B", text:"end"}, 
        {id:"C", text:"error"}, 
        {id:"D", text:"close"}
    ], 
    correctAnswer: "C", 
    topic: "Node.js" 
  },
  { 
    text: "What does the package.json file handle?", 
    options: [
        {id:"A", text:"Database connection"}, 
        {id:"B", text:"Project metadata and dependencies"}, 
        {id:"C", text:"User authentication"}, 
        {id:"D", text:"Server configuration"}
    ], 
    correctAnswer: "B", 
    topic: "Node.js" 
  },
  { 
    text: "How do you install a package globally in Node.js?", 
    options: [
        {id:"A", text:"npm install package"}, 
        {id:"B", text:"npm install -g package"}, 
        {id:"C", text:"npm global package"}, 
        {id:"D", text:"node install package"}
    ], 
    correctAnswer: "B", 
    topic: "Node.js" 
  },

  // --- REACT QUESTIONS ---
  { 
    text: "Which hook is used to manage state in a functional component?", 
    options: [
        {id:"A", text:"useEffect"}, 
        {id:"B", text:"useReducer"}, 
        {id:"C", text:"useState"}, 
        {id:"D", text:"useMemo"}
    ], 
    correctAnswer: "C", 
    topic: "React" 
  },
  { 
    text: "What is the purpose of useEffect?", 
    options: [
        {id:"A", text:"To handle side effects"}, 
        {id:"B", text:"To create components"}, 
        {id:"C", text:"To style elements"}, 
        {id:"D", text:"To routing pages"}
    ], 
    correctAnswer: "A", 
    topic: "React" 
  },
  { 
    text: "How do you pass data from parent to child?", 
    options: [
        {id:"A", text:"State"}, 
        {id:"B", text:"Props"}, 
        {id:"C", text:"Redux"}, 
        {id:"D", text:"Context"}
    ], 
    correctAnswer: "B", 
    topic: "React" 
  },
  { 
    text: "Which method is required in a Class Component?", 
    options: [
        {id:"A", text:"return()"}, 
        {id:"B", text:"render()"}, 
        {id:"C", text:"constructor()"}, 
        {id:"D", text:"componentDidMount()"}
    ], 
    correctAnswer: "B", 
    topic: "React" 
  },
  { 
    text: "What is the Virtual DOM?", 
    options: [
        {id:"A", text:"A direct copy of the browser DOM"}, 
        {id:"B", text:"A lightweight JavaScript representation of the DOM"}, 
        {id:"C", text:"A database for React"}, 
        {id:"D", text:"A styling library"}
    ], 
    correctAnswer: "B", 
    topic: "React" 
  },

  // --- JAVASCRIPT QUESTIONS ---
  { 
    text: "What is the output of 2 + '2'?", 
    options: [
        {id:"A", text:"4"}, 
        {id:"B", text:"22"}, 
        {id:"C", text:"NaN"}, 
        {id:"D", text:"Error"}
    ], 
    correctAnswer: "B", 
    topic: "JavaScript" 
  },
  { 
    text: "Which keyword is used to declare a constant?", 
    options: [
        {id:"A", text:"var"}, 
        {id:"B", text:"let"}, 
        {id:"C", text:"const"}, 
        {id:"D", text:"static"}
    ], 
    correctAnswer: "C", 
    topic: "JavaScript" 
  },
  { 
    text: "How do you convert a string to an integer?", 
    options: [
        {id:"A", text:"Integer.parse()"}, 
        {id:"B", text:"parseInt()"}, 
        {id:"C", text:"Math.int()"}, 
        {id:"D", text:"castInt()"}
    ], 
    correctAnswer: "B", 
    topic: "JavaScript" 
  },
  { 
    text: "Which of these is NOT a valid data type in JS?", 
    options: [
        {id:"A", text:"Number"}, 
        {id:"B", text:"String"}, 
        {id:"C", text:"Boolean"}, 
        {id:"D", text:"Float"}
    ], 
    correctAnswer: "D", 
    topic: "JavaScript" 
  },
  { 
    text: "What does 'this' refer to in an arrow function?", 
    options: [
        {id:"A", text:"The function itself"}, 
        {id:"B", text:"The global object"}, 
        {id:"C", text:"The context where it was defined (lexical scoping)"}, 
        {id:"D", text:"Undefined"}
    ], 
    correctAnswer: "C", 
    topic: "JavaScript" 
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear old data
    await Question.deleteMany();
    
    // Insert new 4-option questions
    await Question.insertMany(questions);
    
    console.log('✅ 15 Questions (Multiple Choice) Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();