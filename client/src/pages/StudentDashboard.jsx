import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import { LogOut, Smile, BookOpen, Trophy, Clock, History, BarChart } from "lucide-react";
import Quiz from "../components/Quiz";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { isLive, activeTopic } = useContext(SocketContext);
  
  // State
  const [showSummary, setShowSummary] = useState(false);
  const [view, setView] = useState("waiting"); // 'waiting', 'quiz', 'history'
  const [pastQuizzes, setPastQuizzes] = useState([]);

  // Load History from Local Storage on Start
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`history_${user.name}`)) || [];
    setPastQuizzes(saved);
  }, [user.name]);

  // Handle Session Changes
  useEffect(() => {
    if (isLive) {
        setView("quiz");
        setShowSummary(false);
    } else if (!isLive && view === "quiz") {
        // Session Just Ended -> Show Summary
        setShowSummary(true);
        setView("waiting");
        saveResultToHistory();
    }
  }, [isLive, activeTopic]);

  // Save Mock Result (In a real app, we'd get this from the server)
  const saveResultToHistory = () => {
    // Creating a history entry
    const newEntry = {
        id: Date.now(),
        topic: activeTopic || "General",
        date: new Date().toLocaleDateString(),
        score: Math.floor(Math.random() * 3) + 7 + "/10", // Mock score for demo (7-10)
        status: "Completed"
    };
    
    // Save to State & LocalStorage
    const updated = [newEntry, ...pastQuizzes];
    setPastQuizzes(updated);
    localStorage.setItem(`history_${user.name}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-gray-700">Student Portal</span>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setView("history")} className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
                <History className="w-4 h-4"/> History
            </button>
            <span className="font-bold text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700"><LogOut className="w-4 h-4"/></button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">

        {/* VIEW 1: LIVE QUIZ */}
        {isLive && (
            <div className="w-full max-w-3xl animate-fade-in">
                <Quiz />
            </div>
        )}

        {/* VIEW 2: WAITING ROOM */}
        {!isLive && !showSummary && view !== "history" && (
            <div className="text-center max-w-md w-full animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-blue-500 animate-pulse-fast" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Waiting for Professor...</h1>
                    <p className="text-gray-500 mb-8">The session hasn't started yet. Review your notes or check your history.</p>
                    
                    <div className="flex gap-2 justify-center">
                        <button onClick={() => setView("history")} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                            View Past Quizzes
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW 3: SESSION SUMMARY (Pop-up after quiz) */}
        {!isLive && showSummary && (
            <div className="w-full max-w-2xl animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    <div className="bg-green-600 p-8 text-center text-white">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                        <h2 className="text-3xl font-bold">Quiz Submitted!</h2>
                        <p className="opacity-90">Great effort, {user.name}.</p>
                    </div>
                    <div className="p-8">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4 mb-6">
                            <Smile className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-green-800">Insight Generated</h3>
                                <p className="text-green-700 text-sm">Your performance in <strong>{activeTopic || "General"}</strong> has been recorded.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowSummary(false)}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW 4: HISTORY (Past Quizzes) */}
        {!isLive && view === "history" && (
            <div className="w-full max-w-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Learning Journey</h2>
                    <button onClick={() => setView("waiting")} className="text-blue-600 font-medium hover:underline">Back</button>
                </div>

                {pastQuizzes.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl text-center shadow-sm">
                        <BarChart className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500">No quizzes taken yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pastQuizzes.map((q) => (
                            <div key={q.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                        {q.topic.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{q.topic} Quiz</h3>
                                        <p className="text-xs text-gray-500">{q.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-800 text-lg">{q.score}</span>
                                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">{q.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default StudentDashboard;