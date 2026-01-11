import { useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import { 
  LogOut, Play, Square, Users, Search, AlertTriangle, CheckCircle, 
  Filter, Zap, BarChart2, BrainCircuit, Trophy, ArrowUpDown 
} from "lucide-react";

const ProfessorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { socket, isLive } = useContext(SocketContext); 

  // --- STATE ---
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  
  // New: Filtering & Sorting
  const [filterStatus, setFilterStatus] = useState("All"); // 'All', 'Needs Attention', 'Excellent'
  const [sortConfig, setSortConfig] = useState({ key: 'accuracy', direction: 'desc' });

  // 1. Fetch Questions (Static Data)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/questions");
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions.");
      }
    };
    fetchQuestions();
  }, []);

  // 2. Real-Time Listeners
  useEffect(() => {
    if (!socket) return;
    socket.on("live-data-update", (data) => setStudents(data));
    socket.on("question-update", (updatedQ) => {
      setQuestions((prev) => prev.map((q) => (q._id === updatedQ._id ? updatedQ : q)));
    });
    return () => { socket.off("live-data-update"); socket.off("question-update"); };
  }, [socket]);

  // 3. Toggle Session
  const toggleSession = () => {
    if (isLive) socket.emit("end-session");
    else socket.emit("start-session", selectedTopic); 
  };

  // --- LOGIC: FILTERING, SORTING, & ANALYTICS ---

  // A. Filter & Sort Students
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Search
    if (searchTerm) {
      result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by Status
    if (filterStatus !== "All") {
      result = result.filter(s => {
        if (filterStatus === "Needs Attention") return s.status.includes("Needs Attention") || s.status.includes("Guessing");
        return s.status === filterStatus;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, filterStatus, sortConfig]);

  // B. Handle Sort Click
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // C. Analytics Metrics
  const hardQuestions = questions.filter(q => q.difficulty === "High");
  const classAccuracy = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.accuracy, 0) / students.length) 
    : 0;

  // D. Badge Distribution (Calculated from Live Data)
  const badges = {
    fastestFinger: students.filter(s => s.accuracy === 100).length,
    consistent: students.filter(s => s.accuracy >= 80 && s.accuracy < 100).length,
    needsHelp: students.filter(s => s.accuracy < 50).length
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6" /> Prof. Iyengar
          </h1>
          <p className="text-xs text-gray-500 mt-1">Real-Time Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center w-full p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <Users className="w-5 h-5 mr-3" /> Student View
          </button>
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="flex items-center text-red-600 hover:bg-red-50 w-full p-3 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        
        {/* HEADER */}
        <header className="bg-white p-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Classroom Overview</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className={`w-3 h-3 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}></span>
               <p className="text-sm text-gray-500 font-medium">{isLive ? "SESSION LIVE" : "SESSION COMPLETED"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Topic Selector */}
            {!isLive && (
                <div className="relative">
                    <Filter className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                    <select 
                        className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none font-medium cursor-pointer focus:ring-2 focus:ring-blue-500"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        {["All", ...new Set(questions.map(q => q.topic))].map(t => 
                            <option key={t} value={t}>{t || "General"} Quiz</option>
                        )}
                    </select>
                </div>
            )}

            {/* SIMULATE BUTTON (The Zap) */}
            {isLive && (
                <button 
                    onClick={() => socket.emit('simulate-data')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200 transition"
                >
                    <Zap className="w-4 h-4" /> Simulate Data
                </button>
            )}

            <button 
              onClick={toggleSession} 
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-bold transition-all shadow-md ${isLive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isLive ? <><Square className="w-4 h-4"/> End Session</> : <><Play className="w-4 h-4"/> Go Live</>}
            </button>
          </div>
        </header>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: STUDENT LIST (Sortable & Filterable) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SCOREKEEPER CARDS */}
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
                     <div>
                         <p className="text-gray-500 text-sm font-medium">Class Average</p>
                         <p className="text-2xl font-bold text-gray-800">{classAccuracy}%</p>
                     </div>
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                         <BarChart2 className="w-5 h-5" />
                     </div>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
                     <div>
                         <p className="text-gray-500 text-sm font-medium">Active Students</p>
                         <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                     </div>
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                         <Users className="w-5 h-5" />
                     </div>
                 </div>
            </div>

            {/* 2. STUDENT TABLE CONTROLS */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-700">Student Performance</h3>
              <div className="flex gap-2">
                {/* Status Filter */}
                <select 
                    className="px-3 py-2 bg-white border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Needs Attention">Struggling / Guessing</option>
                </select>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input 
                    type="text" placeholder="Find Sandeep..." 
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-48"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              </div>
            </div>

            {/* 3. THE TABLE */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th 
                        className="p-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('name')}
                    >
                        <div className="flex items-center gap-1">Student <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                    <th 
                        className="p-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('accuracy')}
                    >
                        <div className="flex items-center gap-1">Accuracy <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                    <th className="p-4 font-semibold text-gray-600">Total Points</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {processedStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">{student.name}</td>
                      <td className="p-4">
                         <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${student.accuracy < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${student.accuracy}%`}}></div>
                            </div>
                            <span className="text-sm font-bold">{student.accuracy}%</span>
                         </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{student.correct * 10} pts</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit
                          ${student.status.includes('Guessing') ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                            student.status === 'Needs Attention' ? 'bg-red-100 text-red-700' : 
                            student.status === 'Excellent' ? 'bg-green-100 text-green-700' : 
                            'bg-yellow-100 text-yellow-700'}`}>
                          {student.status.includes('Guessing') && <AlertTriangle className="w-3 h-3" />}
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {processedStudents.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                      <p>No students found matching your criteria.</p>
                  </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYTICS & BADGES */}
          <div className="space-y-6">
             
             {/* 1. GUESSING DETECTOR (Question Analytics) */}
             <div className={`rounded-xl shadow-sm border p-6 transition-all duration-500 ${hardQuestions.length > 0 ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'bg-white'}`}>
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${hardQuestions.length > 0 ? 'text-red-700' : 'text-gray-700'}`}>
                    <AlertTriangle className={`w-5 h-5 ${hardQuestions.length > 0 ? 'text-red-600 animate-pulse' : 'text-gray-400'}`} />
                    {hardQuestions.length > 0 ? "⚠️ Difficulty Detected" : "No Issues Detected"}
                </h3>
                
                {hardQuestions.length > 0 ? (
                    <div className="space-y-3">
                        {hardQuestions.map(q => {
                            const percentage = q.attempts > 0 ? Math.round((q.correctCount / q.attempts) * 100) : 0;
                            return (
                                <div key={q._id} className="p-4 bg-white border border-red-200 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-extrabold uppercase rounded">HARD</span>
                                        <span className="text-xl font-black text-red-600">{percentage}%</span>
                                    </div>
                                    <p className="font-bold text-gray-800 text-sm mb-3 border-b pb-2 line-clamp-2">{q.text}</p>
                                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                                        <span>Attempts: {q.attempts}</span>
                                        <span>Missed: {q.attempts - q.correctCount}</span>
                                    </div>
                                    <p className="text-xs text-red-600 mt-2 font-bold flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Low accuracy + High attempts
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2 opacity-50" />
                        <p className="text-gray-500 text-sm">Class comprehension is good.</p>
                    </div>
                )}
             </div>

             {/* 2. BADGE DISTRIBUTION (Validation of Effort) */}
             <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" /> Badge Distribution
                </h3>
                <div className="space-y-4">
                    {/* Fastest Finger */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-600">Fastest Finger (100%)</span>
                            <span className="font-bold text-gray-800">{badges.fastestFinger} Students</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{width: `${(badges.fastestFinger/students.length)*100}%`}}></div>
                        </div>
                    </div>
                    {/* Consistent Learner */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-600">Consistent (80%+)</span>
                            <span className="font-bold text-gray-800">{badges.consistent} Students</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{width: `${(badges.consistent/students.length)*100}%`}}></div>
                        </div>
                    </div>
                    {/* Needs Focus */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-600">Needs Focus</span>
                            <span className="font-bold text-gray-800">{badges.needsHelp} Students</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-red-400 h-2 rounded-full" style={{width: `${(badges.needsHelp/students.length)*100}%`}}></div>
                        </div>
                    </div>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;