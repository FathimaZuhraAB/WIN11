import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext"; // <--- IMPORT THIS
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>  {/* <--- ADD THIS WRAPPER */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </SocketProvider> {/* <--- CLOSE WRAPPER */}
    </AuthProvider>
  );
}

export default App;