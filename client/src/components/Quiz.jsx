import { useState, useContext, useEffect } from "react";
import SocketContext from "../context/SocketContext";
import AuthContext from "../context/AuthContext";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

const Quiz = () => {
  const { socket, activeTopic } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Tracks "A", "B", etc.
  const [isCorrect, setIsCorrect] = useState(null);
  const [finished, setFinished] = useState(false);

  // 1. Load Questions from Server (or Mock for Demo)
  useEffect(() => {
    // In a real app, we fetch from API. For this demo, we use the props or a quick fetch.
    // We will listen for the questions via socket or just fetch them.
    const fetchQ = async () => {
        const response = await fetch(`http://localhost:5000/api/questions?topic=${activeTopic || "All"}`);
        const data = await response.json();
        setQuestions(data);
    };
    fetchQ();
  }, [activeTopic]);

  const handleOptionClick = (optionId) => {
    if (selectedOption) return; // Prevent double clicking

    const currentQuestion = questions[currentIndex];
    const correct = optionId === currentQuestion.correctAnswer;
    
    setSelectedOption(optionId);
    setIsCorrect(correct);

    // 🔥 CRITICAL FIX: SEND THE OPTION ID ("A", "B") TO SERVER 🔥
    socket.emit("submit-answer", {
      studentName: user.name,
      questionId: currentQuestion._id,
      isCorrect: correct,
      selectedOption: optionId // <--- This tells the server "I picked B"
    });
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0) return <div className="p-10 text-center">Loading Quiz...</div>;
  if (finished) return <div className="p-10 text-center text-xl font-bold">Quiz Completed! check the dashboard.</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
        <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Header */}
      <div className="mb-6">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length}
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">{currentQ.text}</h2>
      </div>

      {/* Options Grid */}
      <div className="grid gap-4">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleOptionClick(opt.id)}
            disabled={!!selectedOption}
            className={`p-4 text-left rounded-xl border-2 transition-all font-medium flex justify-between items-center
              ${selectedOption === opt.id 
                ? (isCorrect ? "border-green-500 bg-green-50 text-green-800" : "border-red-500 bg-red-50 text-red-800") 
                : "border-gray-100 hover:border-blue-200 hover:bg-blue-50 text-gray-700"}
            `}
          >
            <span><span className="font-bold mr-2">{opt.id}.</span> {opt.text}</span>
            
            {/* Instant Feedback Icons */}
            {selectedOption === opt.id && (
                isCorrect ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      {selectedOption && (
        <div className="mt-8 flex justify-end animate-fade-in">
            <button 
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
            >
                Next Question <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      )}

    </div>
  );
};

export default Quiz;